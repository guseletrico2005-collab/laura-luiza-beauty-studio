import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  runTransaction
} from 'firebase/firestore';
import { 
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile, 
  signInWithEmailAndPassword, 
  User as FirebaseUser 
} from 'firebase/auth';
import { db, handleFirestoreError, OperationType, auth } from '../firebase';
import { Service, Appointment, Professional, UserProfile } from '../types';
import { INITIAL_SERVICES, PROFESSIONALS, DEFAULT_WEEKLY_SCHEDULE } from '../data/mockData';

const SERVICES_COL = 'services';
const PROFESSIONALS_COL = 'professionals';
const APPOINTMENTS_COL = 'appointments';
const BOOKED_SLOTS_COL = 'booked_slots';
const USERS_COL = 'users';

/**
 * Format Brazilian phone number to standard international E.164 (+55DDDN...)
 */
export function formatBrazilianPhoneToE164(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('55') && digits.length >= 12) {
    return `+${digits}`;
  }
  return `+55${digits}`;
}

/**
 * Validate Brazilian phone number (10 digits for landline or 11 digits for mobile with DDD)
 */
export function validateBrazilianPhone(rawPhone: string): boolean {
  const digits = rawPhone.replace(/\D/g, '');
  // Clean off +55 prefix if present for length check
  const localDigits = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
  
  if (localDigits.length !== 10 && localDigits.length !== 11) {
    return false;
  }
  
  // Validate Brazilian DDD (11 to 99)
  const ddd = parseInt(localDigits.substring(0, 2), 10);
  if (ddd < 11 || ddd > 99) {
    return false;
  }
  
  // Mobile numbers (11 digits) should start with 9
  if (localDigits.length === 11 && localDigits.charAt(2) !== '9') {
    return false;
  }
  
  return true;
}

/**
 * Mask raw input into Brazilian phone format (XX) XXXXX-XXXX
 */
export function formatPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export interface GoogleAuthResult {
  user: FirebaseUser;
  profile: UserProfile | null;
  needsProfileCompletion: boolean;
}

/**
 * Authenticate Client via Google Sign-In (Firebase Authentication Popup)
 * Checks and creates/updates client profile in Firestore users/{uid}
 */
export async function signInClientWithGoogle(): Promise<GoogleAuthResult> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  const now = new Date().toISOString();

  // 1. Fetch user document in Firestore users/{uid}
  const userDocRef = doc(db, USERS_COL, user.uid);
  const existingSnap = await getDoc(userDocRef);
  
  let profile: UserProfile | null = null;
  let needsProfileCompletion = false;

  if (existingSnap.exists()) {
    profile = existingSnap.data() as UserProfile;
    // If phone number is missing, mark for completion
    if (!profile.phone || profile.phone.trim().length < 8 || !profile.name) {
      needsProfileCompletion = true;
    }
    // Update lastLogin, email & photo
    await setDoc(userDocRef, {
      lastLogin: now,
      updatedAt: now,
      email: user.email || profile.email || '',
      photoURL: user.photoURL || profile.photoURL || ''
    }, { merge: true });
  } else {
    // New user -> prompt for name & phone verification
    needsProfileCompletion = true;
    const initialName = user.displayName || '';
    const initialPhone = user.phoneNumber ? formatPhoneMask(user.phoneNumber) : '';
    
    await setDoc(userDocRef, {
      id: user.uid,
      name: initialName,
      email: user.email || '',
      phone: initialPhone,
      photoURL: user.photoURL || '',
      role: 'client',
      createdAt: now,
      lastLogin: now,
      updatedAt: now
    }, { merge: true });

    profile = {
      id: user.uid,
      name: initialName,
      email: user.email || undefined,
      phone: initialPhone || undefined,
      photoURL: user.photoURL || undefined,
      role: 'client',
      createdAt: now,
      lastLogin: now,
      updatedAt: now
    };
  }

  return {
    user,
    profile,
    needsProfileCompletion
  };
}

/**
 * Save / Update Client profile in Firestore users/{uid}
 */
export async function saveClientUserProfile(
  uid: string, 
  data: { name: string; phone: string; email?: string; photoURL?: string }
): Promise<void> {
  const now = new Date().toISOString();
  const userDocRef = doc(db, USERS_COL, uid);

  // 1. Update Firebase Auth displayName if available
  if (auth.currentUser && data.name && data.name.trim()) {
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name.trim()
      });
    } catch (e) {
      console.warn('Could not update Firebase Auth profile displayName:', e);
    }
  }

  // 2. Persist in Firestore users/{uid}
  await setDoc(userDocRef, {
    id: uid,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email || auth.currentUser?.email || '',
    photoURL: data.photoURL || auth.currentUser?.photoURL || '',
    role: 'client',
    updatedAt: now,
    lastLogin: now
  }, { merge: true });
}

/**
 * Get User Profile from Firestore users/{uid}
 */
export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, USERS_COL, uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Admin Email Login
 */
export async function loginAdminWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

/**
 * Generate unique predictable key for a time slot to prevent duplicate bookings
 */
export function getSlotKey(date: string, time: string, professional: string): string {
  const cleanProf = professional
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_');
  const cleanTime = time.replace(/[^0-9]/g, '');
  const cleanDate = date.replace(/[^0-9]/g, '');
  return `slot_${cleanDate}_${cleanProf}_${cleanTime}`;
}

/**
 * Helper to securely check if the current user has administrator privileges
 */
export async function checkIsAdmin(): Promise<boolean> {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;
  if (currentUser.email === 'guseletrico2005@gmail.com') return true;
  try {
    const tokenResult = await currentUser.getIdTokenResult();
    if (tokenResult.claims.role === 'admin' || tokenResult.claims.admin === true) {
      return true;
    }
    const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
    if (adminDoc.exists()) {
      return true;
    }
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists() && userDoc.data()?.role === 'admin') {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

export interface SeedResult {
  success: boolean;
  message: string;
  createdCount: number;
  existingCount: number;
  createdIds: string[];
  existingIds: string[];
  totalCount: number;
}

/**
 * Administrative Seed operation: writes the 13 demo services to Firestore if not present
 */
export async function seedServicesIfAdmin(): Promise<SeedResult> {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return {
      success: false,
      message: 'Acesso negado: Apenas administradores autenticados podem gravar o catálogo inicial.',
      createdCount: 0,
      existingCount: 0,
      createdIds: [],
      existingIds: [],
      totalCount: 0
    };
  }

  try {
    const snapshot = await getDocs(collection(db, SERVICES_COL));
    const existingIds = new Set<string>();
    snapshot.forEach((d) => existingIds.add(d.id));

    let createdCount = 0;
    const createdIds: string[] = [];
    const now = new Date().toISOString();

    for (const service of INITIAL_SERVICES) {
      if (!existingIds.has(service.id)) {
        const fullServiceDoc: Service = {
          ...service,
          duration: service.durationMinutes || service.duration || 60,
          durationMinutes: service.durationMinutes || service.duration || 60,
          durationFormatted: service.durationFormatted || '1h 00min',
          active: service.isActive !== undefined ? service.isActive : true,
          isActive: service.isActive !== undefined ? service.isActive : true,
          popular: Boolean(service.isPopular || service.popular),
          isPopular: Boolean(service.isPopular || service.popular),
          createdAt: service.createdAt || now,
          updatedAt: service.updatedAt || now
        };
        await setDoc(doc(db, SERVICES_COL, service.id), fullServiceDoc);
        createdCount++;
        createdIds.push(service.id);
      }
    }

    const finalSnapshot = await getDocs(collection(db, SERVICES_COL));
    return {
      success: true,
      message: `Gravação concluída: ${createdCount} novo(s) serviço(s) gravado(s) no Firestore com sucesso!`,
      createdCount,
      existingCount: existingIds.size,
      createdIds,
      existingIds: Array.from(existingIds),
      totalCount: finalSnapshot.size
    };
  } catch (error) {
    console.error('Error seeding services in Firestore:', error);
    return {
      success: false,
      message: `Erro ao gravar serviços no Firestore: ${error instanceof Error ? error.message : String(error)}`,
      createdCount: 0,
      existingCount: 0,
      createdIds: [],
      existingIds: [],
      totalCount: 0
    };
  }
}

/**
 * Seed initial services into Firestore if the collection is empty
 */
export async function initServicesInFirestore(): Promise<Service[]> {
  try {
    const snapshot = await getDocs(collection(db, SERVICES_COL));
    if (snapshot.empty) {
      // Security Check: Only administrators can seed/write documents to services collection
      const isAdmin = await checkIsAdmin();
      if (isAdmin) {
        await seedServicesIfAdmin();
      }
      return INITIAL_SERVICES;
    } else {
      const servicesList: Service[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as Service;
        servicesList.push({
          ...data,
          duration: data.durationMinutes || data.duration || 60,
          durationMinutes: data.durationMinutes || data.duration || 60,
          active: data.isActive !== undefined ? data.isActive : data.active ?? true,
          isActive: data.isActive !== undefined ? data.isActive : data.active ?? true,
        });
      });
      return servicesList;
    }
  } catch (error) {
    console.error('Error reading services from Firestore:', error);
    return INITIAL_SERVICES;
  }
}

/**
 * Real-time listener for Services Catalog
 */
export function subscribeToServices(onUpdate: (services: Service[]) => void) {
  try {
    const q = collection(db, SERVICES_COL);
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Service[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as Service;
            list.push({
              ...data,
              duration: data.durationMinutes || data.duration || 60,
              durationMinutes: data.durationMinutes || data.duration || 60,
              active: data.isActive !== undefined ? data.isActive : data.active ?? true,
              isActive: data.isActive !== undefined ? data.isActive : data.active ?? true,
            });
          });
          onUpdate(list);
        } else {
          initServicesInFirestore().then(onUpdate);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, SERVICES_COL);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, SERVICES_COL);
  }
}

/**
 * Seed initial professionals into Firestore if the collection is empty (Admin Only)
 */
export async function seedDefaultProfessionalsIfAdmin(): Promise<SeedResult> {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    return {
      success: false,
      message: 'Acesso negado: Apenas administradores autenticados podem gravar profissionais no banco de dados.',
      createdCount: 0,
      existingCount: 0,
      createdIds: [],
      existingIds: [],
      totalCount: 0
    };
  }

  try {
    const snapshot = await getDocs(collection(db, PROFESSIONALS_COL));
    const existingIds = new Set<string>();
    snapshot.forEach((d) => existingIds.add(d.id));

    let createdCount = 0;
    const createdIds: string[] = [];
    const now = new Date().toISOString();

    for (const prof of PROFESSIONALS) {
      if (!existingIds.has(prof.id)) {
        const fullProfDoc: Professional = {
          ...prof,
          active: prof.isActive !== undefined ? prof.isActive : true,
          isActive: prof.isActive !== undefined ? prof.isActive : true,
          weeklySchedule: prof.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE,
          exceptions: prof.exceptions || [],
          createdAt: prof.createdAt || now,
          updatedAt: prof.updatedAt || now
        };
        await setDoc(doc(db, PROFESSIONALS_COL, prof.id), fullProfDoc);
        createdCount++;
        createdIds.push(prof.id);
      }
    }

    const finalSnapshot = await getDocs(collection(db, PROFESSIONALS_COL));
    return {
      success: true,
      message: `Gravação concluída: ${createdCount} profissional(is) cadastrada(s) no Firestore com sucesso!`,
      createdCount,
      existingCount: existingIds.size,
      createdIds,
      existingIds: Array.from(existingIds),
      totalCount: finalSnapshot.size
    };
  } catch (error) {
    console.error('Error seeding professionals in Firestore:', error);
    return {
      success: false,
      message: `Erro ao gravar profissionais no Firestore: ${error instanceof Error ? error.message : String(error)}`,
      createdCount: 0,
      existingCount: 0,
      createdIds: [],
      existingIds: [],
      totalCount: 0
    };
  }
}

/**
 * Real-time listener for Professionals Catalog
 */
export function subscribeToProfessionals(onUpdate: (professionals: Professional[]) => void) {
  try {
    const colRef = collection(db, PROFESSIONALS_COL);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Professional[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as Professional;
            list.push({
              ...data,
              active: data.isActive !== undefined ? data.isActive : data.active ?? true,
              isActive: data.isActive !== undefined ? data.isActive : data.active ?? true,
              weeklySchedule: data.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE,
              exceptions: data.exceptions || []
            });
          });
          onUpdate(list);
        } else {
          // Fallback to mock PROFESSIONALS until admin seeds the collection
          onUpdate(PROFESSIONALS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, PROFESSIONALS_COL);
        onUpdate(PROFESSIONALS);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PROFESSIONALS_COL);
    onUpdate(PROFESSIONALS);
  }
}

/**
 * Save or update a professional with weekly schedule and exceptions (Admin Only)
 */
export async function saveProfessionalToFirestore(professional: Professional): Promise<void> {
  const path = `${PROFESSIONALS_COL}/${professional.id}`;
  const now = new Date().toISOString();
  const profData: Professional = {
    ...professional,
    active: professional.isActive !== undefined ? professional.isActive : professional.active ?? true,
    isActive: professional.isActive !== undefined ? professional.isActive : professional.active ?? true,
    weeklySchedule: professional.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE,
    exceptions: professional.exceptions || [],
    createdAt: professional.createdAt || now,
    updatedAt: now
  };

  try {
    await setDoc(doc(db, PROFESSIONALS_COL, professional.id), profData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a professional (Admin Only).
 * Checks if there are active appointments for this professional before deleting to preserve history.
 */
export async function deleteProfessionalFromFirestore(id: string, profName?: string): Promise<void> {
  const path = `${PROFESSIONALS_COL}/${id}`;
  try {
    // Check if there are confirmed appointments for this professional
    const nameToCheck = profName || id;
    const aptQuery = query(
      collection(db, APPOINTMENTS_COL),
      where('professional', '==', nameToCheck),
      where('status', '==', 'Confirmado')
    );
    const aptSnapshot = await getDocs(aptQuery);
    if (!aptSnapshot.empty) {
      throw new Error(
        `Não é possível excluir esta profissional pois existem ${aptSnapshot.size} agendamento(s) confirmado(s) vinculados a ela. Para preservar o histórico, você pode desativá-la no botão Ativa/Inativa para que não receba novos agendamentos.`
      );
    }
    await deleteDoc(doc(db, PROFESSIONALS_COL, id));
  } catch (error: any) {
    if (error?.message && error.message.includes('Não é possível excluir')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Real-time listener for Authenticated Booked Slots (Availability Matrix without PII)
 */
export function subscribeToBookedSlots(onUpdate: (bookedSlotKeys: Set<string>) => void) {
  try {
    const colRef = collection(db, BOOKED_SLOTS_COL);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const slotKeys = new Set<string>();
        snapshot.forEach((d) => {
          const data = d.data();
          if (data && data.isBooked) {
            slotKeys.add(d.id);
          }
        });
        onUpdate(slotKeys);
      },
      (error) => {
        console.warn('Booked slots availability listener note:', error);
      }
    );
  } catch (error) {
    console.warn('Failed to subscribe to booked slots:', error);
  }
}

/**
 * Save or update a service (Admin Only)
 */
export async function saveServiceToFirestore(service: Service): Promise<void> {
  const path = `${SERVICES_COL}/${service.id}`;
  const now = new Date().toISOString();
  const serviceData: Service = {
    ...service,
    duration: service.durationMinutes || service.duration || 60,
    durationMinutes: service.durationMinutes || service.duration || 60,
    active: service.isActive !== undefined ? service.isActive : service.active ?? true,
    isActive: service.isActive !== undefined ? service.isActive : service.active ?? true,
    createdAt: service.createdAt || now,
    updatedAt: now
  };
  try {
    await setDoc(doc(db, SERVICES_COL, service.id), serviceData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a service (Admin Only).
 * Checks if there are active appointments with this service before deleting.
 */
export async function deleteServiceFromFirestore(id: string): Promise<void> {
  const path = `${SERVICES_COL}/${id}`;
  try {
    // Check if there are confirmed appointments using this service
    const aptQuery = query(
      collection(db, APPOINTMENTS_COL),
      where('serviceId', '==', id),
      where('status', '==', 'Confirmado')
    );
    const aptSnapshot = await getDocs(aptQuery);
    if (!aptSnapshot.empty) {
      throw new Error(
        `Não é possível excluir este serviço pois existem ${aptSnapshot.size} agendamento(s) confirmado(s) vinculados a ele. Em vez de excluir, você pode desativá-lo para que não apareça para novos clientes.`
      );
    }
    await deleteDoc(doc(db, SERVICES_COL, id));
  } catch (error: any) {
    if (error?.message && error.message.includes('Não é possível excluir')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Real-time listener for appointments with client data isolation
 */
export function subscribeToAppointments(
  onUpdate: (appointments: Appointment[]) => void,
  userEmail?: string | null,
  userId?: string | null,
  isAdminUser: boolean = false
) {
  try {
    // If not admin and not logged in (no email or uid), return empty list to protect privacy and respect rules
    if (!isAdminUser && !userEmail && !userId) {
      onUpdate([]);
      return () => {};
    }

    const colRef = collection(db, APPOINTMENTS_COL);
    
    // If admin, query all appointments
    // If regular client, query strictly by client email or user ID
    let q = query(colRef);
    if (!isAdminUser && userEmail) {
      q = query(colRef, where('clientEmail', '==', userEmail));
    } else if (!isAdminUser && userId) {
      q = query(colRef, where('userId', '==', userId));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const list: Appointment[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as Appointment);
        });
        list.sort((a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date));
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, APPOINTMENTS_COL);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, APPOINTMENTS_COL);
  }
}

/**
 * Create a new appointment with strict atomic transaction against duplicate bookings
 * Note: BookedSlot contains strictly availability metadata, ZERO personal data (no name, email, phone, userId)
 */
export async function createAppointmentInFirestore(appointment: Appointment): Promise<void> {
  const currentUid = auth.currentUser?.uid || appointment.userId;
  if (!currentUid || currentUid === 'guest_user') {
    throw new Error('É obrigatório estar autenticado para criar um agendamento no sistema.');
  }

  const slotKey = getSlotKey(appointment.date, appointment.time, appointment.professional);
  const slotRef = doc(db, BOOKED_SLOTS_COL, slotKey);
  const aptRef = doc(db, APPOINTMENTS_COL, appointment.id);

  try {
    await runTransaction(db, async (transaction) => {
      // 1. Read existing slot inside transaction (eliminates race conditions)
      const slotSnapshot = await transaction.get(slotRef);
      if (slotSnapshot.exists() && slotSnapshot.data()?.isBooked) {
        throw new Error(
          `Horário indisponível: ${appointment.time} em ${appointment.dateFormatted} com ${appointment.professional} já foi reservado por outro cliente.`
        );
      }

      // 2. Atomically reserve slot containing ONLY availability parameters (No client PII or userId)
      transaction.set(slotRef, {
        id: slotKey,
        date: appointment.date,
        time: appointment.time,
        professional: appointment.professional,
        appointmentId: appointment.id,
        isBooked: true,
        createdAt: new Date().toISOString()
      });

      // 3. Atomically persist the full appointment document in appointments collection
      transaction.set(aptRef, {
        ...appointment,
        userId: currentUid
      });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${APPOINTMENTS_COL}/${appointment.id}`);
  }
}

/**
 * Update appointment status (e.g. Cancelado, Concluído) and release slot if canceled
 * Ensures cancellation only releases the slot corresponding to that specific appointment
 */
export async function updateAppointmentStatusInFirestore(
  appointment: Appointment,
  newStatus: 'Confirmado' | 'Concluído' | 'Cancelado'
): Promise<void> {
  const aptPath = `${APPOINTMENTS_COL}/${appointment.id}`;
  const slotKey = getSlotKey(appointment.date, appointment.time, appointment.professional);
  const slotRef = doc(db, BOOKED_SLOTS_COL, slotKey);
  const aptRef = doc(db, APPOINTMENTS_COL, appointment.id);

  try {
    await runTransaction(db, async (transaction) => {
      const aptSnapshot = await transaction.get(aptRef);
      if (!aptSnapshot.exists()) {
        throw new Error('Agendamento não encontrado no sistema.');
      }

      // Update status
      transaction.update(aptRef, { status: newStatus, updatedAt: new Date().toISOString() });

      // If canceled, only release the slot if it corresponds to this exact appointment
      if (newStatus === 'Cancelado') {
        const slotSnapshot = await transaction.get(slotRef);
        if (slotSnapshot.exists()) {
          const slotData = slotSnapshot.data();
          if (slotData?.appointmentId === appointment.id) {
            transaction.delete(slotRef);
          }
        }
      }
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, aptPath);
  }
}

/**
 * Atomically reschedule an appointment to a new date, time or professional.
 * Releases the old booked slot and reserves the new slot atomically.
 */
export async function rescheduleAppointmentInFirestore(
  appointment: Appointment,
  newDate: string,
  newDateFormatted: string,
  newTime: string,
  newProfessional: string
): Promise<void> {
  const oldSlotKey = getSlotKey(appointment.date, appointment.time, appointment.professional);
  const newSlotKey = getSlotKey(newDate, newTime, newProfessional);
  const oldSlotRef = doc(db, BOOKED_SLOTS_COL, oldSlotKey);
  const newSlotRef = doc(db, BOOKED_SLOTS_COL, newSlotKey);
  const aptRef = doc(db, APPOINTMENTS_COL, appointment.id);
  const now = new Date().toISOString();

  try {
    await runTransaction(db, async (transaction) => {
      const aptSnapshot = await transaction.get(aptRef);
      if (!aptSnapshot.exists()) {
        throw new Error('Agendamento não encontrado no sistema.');
      }

      // If slot changed, check availability of the new slot and release old slot
      if (oldSlotKey !== newSlotKey) {
        const newSlotSnapshot = await transaction.get(newSlotRef);
        if (newSlotSnapshot.exists() && newSlotSnapshot.data()?.isBooked) {
          throw new Error(
            `Horário indisponível: ${newTime} em ${newDateFormatted} com ${newProfessional} já foi reservado por outro cliente.`
          );
        }

        // Release old slot if it was created for this appointment
        const oldSlotSnapshot = await transaction.get(oldSlotRef);
        if (oldSlotSnapshot.exists() && oldSlotSnapshot.data()?.appointmentId === appointment.id) {
          transaction.delete(oldSlotRef);
        }

        // Reserve new slot
        transaction.set(newSlotRef, {
          id: newSlotKey,
          date: newDate,
          time: newTime,
          professional: newProfessional,
          appointmentId: appointment.id,
          isBooked: true,
          createdAt: now
        });
      }

      // Update appointment document
      transaction.update(aptRef, {
        date: newDate,
        dateFormatted: newDateFormatted,
        time: newTime,
        professional: newProfessional,
        status: 'Confirmado',
        updatedAt: now
      });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${APPOINTMENTS_COL}/${appointment.id}`);
  }
}

