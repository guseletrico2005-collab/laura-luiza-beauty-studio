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
  runTransaction
} from 'firebase/firestore';

import {
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signInWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';

import {
  db,
  handleFirestoreError,
  OperationType,
  auth
} from '../firebase';

import {
  Service,
  Appointment,
  Professional,
  UserProfile
} from '../types';

import {
  INITIAL_SERVICES,
  PROFESSIONALS,
  DEFAULT_WEEKLY_SCHEDULE
} from '../data/mockData';

const SERVICES_COL = 'services';
const PROFESSIONALS_COL = 'professionals';
const APPOINTMENTS_COL = 'appointments';
const BOOKED_SLOTS_COL = 'booked_slots';
const USERS_COL = 'users';

/* ============================================================
   TELEFONE / FORMATAÇÃO
============================================================ */

/**
 * Formata telefone brasileiro para padrão E.164.
 * Exemplo:
 * (31) 99999-9999 -> +5531999999999
 */
export function formatBrazilianPhoneToE164(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');

  if (digits.startsWith('55') && digits.length >= 12) {
    return `+${digits}`;
  }

  return `+55${digits}`;
}

/**
 * Valida telefone brasileiro.
 */
export function validateBrazilianPhone(rawPhone: string): boolean {
  const digits = rawPhone.replace(/\D/g, '');

  const localDigits =
    digits.startsWith('55') && digits.length > 11
      ? digits.slice(2)
      : digits;

  if (localDigits.length !== 10 && localDigits.length !== 11) {
    return false;
  }

  const ddd = parseInt(localDigits.substring(0, 2), 10);

  if (ddd < 11 || ddd > 99) {
    return false;
  }

  if (
    localDigits.length === 11 &&
    localDigits.charAt(2) !== '9'
  ) {
    return false;
  }

  return true;
}

/**
 * Máscara de telefone brasileiro.
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

/* ============================================================
   AUTENTICAÇÃO GOOGLE
============================================================ */

export interface GoogleAuthResult {
  user: FirebaseUser;
  profile: UserProfile | null;
  needsProfileCompletion: boolean;
}

/**
 * Login do cliente utilizando Google.
 */
export async function signInClientWithGoogle(): Promise<GoogleAuthResult> {
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: 'select_account'
  });

  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  const now = new Date().toISOString();

  const userDocRef = doc(
    db,
    USERS_COL,
    user.uid
  );

  const existingSnap = await getDoc(userDocRef);

  let profile: UserProfile | null = null;
  let needsProfileCompletion = false;

  if (existingSnap.exists()) {
    profile = existingSnap.data() as UserProfile;

    if (
      !profile.phone ||
      profile.phone.trim().length < 8 ||
      !profile.name
    ) {
      needsProfileCompletion = true;
    }

    await setDoc(
      userDocRef,
      {
        lastLogin: now,
        updatedAt: now,
        email: user.email || profile.email || '',
        photoURL:
          user.photoURL ||
          profile.photoURL ||
          ''
      },
      { merge: true }
    );
  } else {
    needsProfileCompletion = true;

    const initialName =
      user.displayName || '';

    const initialPhone =
      user.phoneNumber
        ? formatPhoneMask(user.phoneNumber)
        : '';

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
    });

    profile = {
      id: user.uid,
      name: initialName,
      email: user.email || undefined,
      phone:
        initialPhone || undefined,
      photoURL:
        user.photoURL || undefined,
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

/* ============================================================
   PERFIL DO CLIENTE
============================================================ */

/**
 * Salva ou atualiza o perfil do cliente.
 */
export async function saveClientUserProfile(
  uid: string,
  data: {
    name: string;
    phone: string;
    email?: string;
    photoURL?: string;
  }
): Promise<void> {
  const now = new Date().toISOString();

  const userDocRef = doc(
    db,
    USERS_COL,
    uid
  );

  if (
    auth.currentUser &&
    data.name &&
    data.name.trim()
  ) {
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name.trim()
      });
    } catch (error) {
      console.warn(
        'Não foi possível atualizar o nome no Firebase Auth:',
        error
      );
    }
  }

  await setDoc(
    userDocRef,
    {
      id: uid,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email:
        data.email ||
        auth.currentUser?.email ||
        '',
      photoURL:
        data.photoURL ||
        auth.currentUser?.photoURL ||
        '',
      role: 'client',
      updatedAt: now,
      lastLogin: now
    },
    { merge: true }
  );
}

/**
 * Busca perfil do usuário.
 */
export async function getUserProfileFromFirestore(
  uid: string
): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(
      doc(db, USERS_COL, uid)
    );

    if (snap.exists()) {
      return snap.data() as UserProfile;
    }

    return null;
  } catch (error) {
    console.warn(
      'Erro ao buscar perfil do usuário:',
      error
    );

    return null;
  }
}

/* ============================================================
   LOGIN ADMIN
============================================================ */

/**
 * Login administrativo por e-mail e senha.
 */
export async function loginAdminWithEmail(
  email: string,
  pass: string
): Promise<FirebaseUser> {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      pass
    );

  return userCredential.user;
}

/* ============================================================
   SLOT / DISPONIBILIDADE
============================================================ */

/**
 * Gera chave única para um horário.
 *
 * Exemplo:
 * slot_20260827_lauraluiza_1400
 */
export function getSlotKey(
  date: string,
  time: string,
  professional: string
): string {
  const cleanProf = professional
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_');

  const cleanTime =
    time.replace(/[^0-9]/g, '');

  const cleanDate =
    date.replace(/[^0-9]/g, '');

  return `slot_${cleanDate}_${cleanProf}_${cleanTime}`;
}

/* ============================================================
   ADMIN
============================================================ */

/**
 * Verifica se usuário possui privilégios administrativos.
 *
 * A autorização real deve continuar protegida
 * pelas regras do Firestore / custom claims.
 */
export async function checkIsAdmin(): Promise<boolean> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return false;
  }

  try {
    const tokenResult =
      await currentUser.getIdTokenResult();

    if (
      tokenResult.claims.role === 'admin' ||
      tokenResult.claims.admin === true
    ) {
      return true;
    }

    const adminDoc = await getDoc(
      doc(db, 'admins', currentUser.uid)
    );

    if (adminDoc.exists()) {
      return true;
    }

    const userDoc = await getDoc(
      doc(db, USERS_COL, currentUser.uid)
    );

    if (
      userDoc.exists() &&
      userDoc.data()?.role === 'admin'
    ) {
      return true;
    }

    return false;
  } catch (error) {
    console.warn(
      'Erro ao verificar administrador:',
      error
    );

    return false;
  }
}

/* ============================================================
   SEED
============================================================ */

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
 * Grava serviços iniciais no Firestore.
 * Somente serviços que ainda não existem são criados.
 */
export async function seedServicesIfAdmin(): Promise<SeedResult> {
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    return {
      success: false,
      message:
        'Acesso negado: Apenas administradores autenticados podem gravar o catálogo inicial.',
      createdCount: 0,
      existingCount: 0,
      createdIds: [],
      existingIds: [],
      totalCount: 0
    };
  }

  try {
    const snapshot = await getDocs(
      collection(db, SERVICES_COL)
    );

    const existingIds = new Set<string>();

    snapshot.forEach((document) => {
      existingIds.add(document.id);
    });

    let createdCount = 0;

    const createdIds: string[] = [];

    const now = new Date().toISOString();

    for (const service of INITIAL_SERVICES) {
      if (existingIds.has(service.id)) {
        continue;
      }

      const duration =
        service.durationMinutes ||
        service.duration ||
        60;

      const isActive =
        service.isActive !== undefined
          ? service.isActive
          : service.active ?? true;

      const isPopular =
        service.isPopular !== undefined
          ? service.isPopular
          : service.popular ?? false;

      const fullServiceDoc: Service = {
        ...service,

        duration,
        durationMinutes: duration,

        durationFormatted:
          service.durationFormatted ||
          '1h 00min',

        active: isActive,
        isActive,

        popular: isPopular,
        isPopular,

        createdAt:
          service.createdAt || now,

        updatedAt:
          service.updatedAt || now
      };

      await setDoc(
        doc(
          db,
          SERVICES_COL,
          service.id
        ),
        fullServiceDoc
      );

      createdCount++;

      createdIds.push(service.id);
    }

    const finalSnapshot =
      await getDocs(
        collection(db, SERVICES_COL)
      );

    return {
      success: true,
      message:
        `Gravação concluída: ${createdCount} novo(s) serviço(s) gravado(s) no Firestore com sucesso!`,
      createdCount,
      existingCount: existingIds.size,
      createdIds,
      existingIds:
        Array.from(existingIds),
      totalCount: finalSnapshot.size
    };
  } catch (error) {
    console.error(
      'Erro ao gravar serviços:',
      error
    );

    return {
      success: false,
      message:
        `Erro ao gravar serviços no Firestore: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
      createdCount: 0,
      existingCount: 0,
      createdIds: [],
      existingIds: [],
      totalCount: 0
    };
  }
}

/**
 * Inicializa serviços caso a coleção esteja vazia.
 */
export async function initServicesInFirestore(): Promise<Service[]> {
  try {
    const snapshot = await getDocs(
      collection(db, SERVICES_COL)
    );

    if (snapshot.empty) {
      const isAdmin =
        await checkIsAdmin();

      if (isAdmin) {
        await seedServicesIfAdmin();
      }

      return INITIAL_SERVICES;
    }

    const servicesList: Service[] = [];

    snapshot.forEach((document) => {
      const data =
        document.data() as Service;

      const duration =
        data.durationMinutes ||
        data.duration ||
        60;

      const isActive =
        data.isActive !== undefined
          ? data.isActive
          : data.active ?? true;

      servicesList.push({
        ...data,
        duration,
        durationMinutes: duration,
        durationFormatted:
          data.durationFormatted ||
          '1h 00min',
        active: isActive,
        isActive
      });
    });

    return servicesList;
  } catch (error) {
    console.error(
      'Erro ao ler serviços do Firestore:',
      error
    );

    return INITIAL_SERVICES;
  }
}

/* ============================================================
   SERVIÇOS - TEMPO REAL
============================================================ */

/**
 * Listener em tempo real dos serviços.
 */
export function subscribeToServices(
  onUpdate: (services: Service[]) => void
) {
  try {
    const colRef =
      collection(db, SERVICES_COL);

    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Service[] = [];

          snapshot.forEach((document) => {
            const data =
              document.data() as Service;

            const duration =
              data.durationMinutes ||
              data.duration ||
              60;

            const isActive =
              data.isActive !== undefined
                ? data.isActive
                : data.active ?? true;

            list.push({
              ...data,
              duration,
              durationMinutes: duration,
              durationFormatted:
                data.durationFormatted ||
                '1h 00min',
              active: isActive,
              isActive
            });
          });

          onUpdate(list);
        } else {
          initServicesInFirestore()
            .then(onUpdate);
        }
      },
      (error) => {
        handleFirestoreError(
          error,
          OperationType.LIST,
          SERVICES_COL
        );
      }
    );
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.LIST,
      SERVICES_COL
    );

    return () => {};
  }
}

/* ============================================================
   PROFISSIONAIS
============================================================ */

/**
 * Grava profissionais padrão.
 */
export async function seedDefaultProfessionalsIfAdmin(): Promise<SeedResult> {
  const isAdmin =
    await checkIsAdmin();

  if (!isAdmin) {
    return {
      success: false,
      message:
        'Acesso negado: Apenas administradores autenticados podem gravar profissionais no banco de dados.',
      createdCount: 0,
      existingCount: 0,
      createdIds: [],
      existingIds: [],
      totalCount: 0
    };
  }

  try {
    const snapshot =
      await getDocs(
        collection(
          db,
          PROFESSIONALS_COL
        )
      );

    const existingIds =
      new Set<string>();

    snapshot.forEach((document) => {
      existingIds.add(document.id);
    });

    let createdCount = 0;

    const createdIds: string[] = [];

    const now =
      new Date().toISOString();

    for (const professional of PROFESSIONALS) {
      if (
        existingIds.has(
          professional.id
        )
      ) {
        continue;
      }

      const isActive =
        professional.isActive !== undefined
          ? professional.isActive
          : professional.active ?? true;

      const fullProfDoc: Professional = {
        ...professional,

        active: isActive,
        isActive,

        weeklySchedule:
          professional.weeklySchedule ||
          DEFAULT_WEEKLY_SCHEDULE,

        exceptions:
          professional.exceptions ||
          [],

        createdAt:
          professional.createdAt ||
          now,

        updatedAt:
          professional.updatedAt ||
          now
      };

      await setDoc(
        doc(
          db,
          PROFESSIONALS_COL,
          professional.id
        ),
        fullProfDoc
      );

      createdCount++;

      createdIds.push(
        professional.id
      );
    }

    const finalSnapshot =
      await getDocs(
        collection(
          db,
          PROFESSIONALS_COL
        )
      );

    return {
      success: true,
      message:
        `Gravação concluída: ${createdCount} profissional(is) cadastrada(s) no Firestore com sucesso!`,
      createdCount,
      existingCount:
        existingIds.size,
      createdIds,
      existingIds:
        Array.from(existingIds),
      totalCount:
        finalSnapshot.size
    };
  } catch (error) {
    console.error(
      'Erro ao gravar profissionais:',
      error
    );

    return {
      success: false,
      message:
        `Erro ao gravar profissionais no Firestore: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
      createdCount: 0,
      existingCount: 0,
      createdIds: [],
      existingIds: [],
      totalCount: 0
    };
  }
}

/**
 * Listener dos profissionais.
 */
export function subscribeToProfessionals(
  onUpdate: (
    professionals: Professional[]
  ) => void
) {
  try {
    const colRef =
      collection(
        db,
        PROFESSIONALS_COL
      );

    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Professional[] = [];

          snapshot.forEach((document) => {
            const data =
              document.data() as Professional;

            const isActive =
              data.isActive !== undefined
                ? data.isActive
                : data.active ?? true;

            list.push({
              ...data,

              active: isActive,
              isActive,

              weeklySchedule:
                data.weeklySchedule ||
                DEFAULT_WEEKLY_SCHEDULE,

              exceptions:
                data.exceptions || []
            });
          });

          onUpdate(list);
        } else {
          onUpdate(PROFESSIONALS);
        }
      },
      (error) => {
        handleFirestoreError(
          error,
          OperationType.LIST,
          PROFESSIONALS_COL
        );

        onUpdate(PROFESSIONALS);
      }
    );
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.LIST,
      PROFESSIONALS_COL
    );

    onUpdate(PROFESSIONALS);

    return () => {};
  }
}

/**
 * Salva ou atualiza profissional.
 */
export async function saveProfessionalToFirestore(
  professional: Professional
): Promise<void> {
  const path =
    `${PROFESSIONALS_COL}/${professional.id}`;

  const now =
    new Date().toISOString();

  const isActive =
    professional.isActive !== undefined
      ? professional.isActive
      : professional.active ?? true;

  const profData: Professional = {
    ...professional,

    active: isActive,
    isActive,

    weeklySchedule:
      professional.weeklySchedule ||
      DEFAULT_WEEKLY_SCHEDULE,

    exceptions:
      professional.exceptions ||
      [],

    createdAt:
      professional.createdAt ||
      now,

    updatedAt: now
  };

  try {
    await setDoc(
      doc(
        db,
        PROFESSIONALS_COL,
        professional.id
      ),
      profData,
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      path
    );
  }
}

/**
 * Exclui profissional.
 *
 * Não permite excluir quando existem
 * agendamentos confirmados.
 */
export async function deleteProfessionalFromFirestore(
  id: string,
  profName?: string
): Promise<void> {
  const path =
    `${PROFESSIONALS_COL}/${id}`;

  try {
    const nameToCheck =
      profName || id;

    const aptQuery = query(
      collection(
        db,
        APPOINTMENTS_COL
      ),
      where(
        'professional',
        '==',
        nameToCheck
      ),
      where(
        'status',
        '==',
        'Confirmado'
      )
    );

    const aptSnapshot =
      await getDocs(aptQuery);

    if (!aptSnapshot.empty) {
      throw new Error(
        `Não é possível excluir esta profissional pois existem ${aptSnapshot.size} agendamento(s) confirmado(s) vinculados a ela. Para preservar o histórico, você pode desativá-la.`
      );
    }

    await deleteDoc(
      doc(
        db,
        PROFESSIONALS_COL,
        id
      )
    );
  } catch (error: any) {
    if (
      error?.message?.includes(
        'Não é possível excluir'
      )
    ) {
      throw error;
    }

    handleFirestoreError(
      error,
      OperationType.DELETE,
      path
    );
  }
}

/* ============================================================
   BOOKED SLOTS
============================================================ */

/**
 * Listener dos horários ocupados.
 *
 * Esta coleção NÃO possui dados pessoais.
 */
export function subscribeToBookedSlots(
  onUpdate: (
    bookedSlotKeys: Set<string>
  ) => void
) {
  try {
    const colRef =
      collection(
        db,
        BOOKED_SLOTS_COL
      );

    return onSnapshot(
      colRef,
      (snapshot) => {
        const slotKeys =
          new Set<string>();

        snapshot.forEach((document) => {
          const data =
            document.data();

          if (
            data &&
            data.isBooked
          ) {
            slotKeys.add(
              document.id
            );
          }
        });

        onUpdate(slotKeys);
      },
      (error) => {
        console.warn(
          'Erro no listener de horários:',
          error
        );
      }
    );
  } catch (error) {
    console.warn(
      'Falha ao acompanhar horários:',
      error
    );

    return () => {};
  }
}

/* ============================================================
   SERVIÇOS - CRUD
============================================================ */

/**
 * Salva ou atualiza serviço.
 *
 * Compatível com:
 * - duration
 * - durationMinutes
 * - active
 * - isActive
 * - popular
 * - isPopular
 * - options
 */
export async function saveServiceToFirestore(
  service: Service
): Promise<void> {
  const path =
    `${SERVICES_COL}/${service.id}`;

  const now =
    new Date().toISOString();

  const duration =
    service.durationMinutes ||
    service.duration ||
    60;

  const isActive =
    service.isActive !== undefined
      ? service.isActive
      : service.active ?? true;

  const isPopular =
    service.isPopular !== undefined
      ? service.isPopular
      : service.popular ?? false;

  const serviceData: Service = {
    ...service,

    duration,
    durationMinutes: duration,

    durationFormatted:
      service.durationFormatted ||
      '1h 00min',

    active: isActive,
    isActive,

    popular: isPopular,
    isPopular,

    createdAt:
      service.createdAt ||
      now,

    updatedAt: now
  };

  try {
    await setDoc(
      doc(
        db,
        SERVICES_COL,
        service.id
      ),
      serviceData,
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      path
    );
  }
}

/**
 * Exclui serviço.
 *
 * Não permite excluir quando há
 * agendamentos confirmados vinculados.
 */
export async function deleteServiceFromFirestore(
  id: string
): Promise<void> {
  const path =
    `${SERVICES_COL}/${id}`;

  try {
    const aptQuery = query(
      collection(
        db,
        APPOINTMENTS_COL
      ),
      where(
        'serviceId',
        '==',
        id
      ),
      where(
        'status',
        '==',
        'Confirmado'
      )
    );

    const aptSnapshot =
      await getDocs(aptQuery);

    if (!aptSnapshot.empty) {
      throw new Error(
        `Não é possível excluir este serviço pois existem ${aptSnapshot.size} agendamento(s) confirmado(s) vinculados a ele. Em vez de excluir, você pode desativá-lo.`
      );
    }

    await deleteDoc(
      doc(
        db,
        SERVICES_COL,
        id
      )
    );
  } catch (error: any) {
    if (
      error?.message?.includes(
        'Não é possível excluir'
      )
    ) {
      throw error;
    }

    handleFirestoreError(
      error,
      OperationType.DELETE,
      path
    );
  }
}

/* ============================================================
   AGENDAMENTOS - LISTAGEM
============================================================ */

/**
 * Listener dos agendamentos.
 *
 * Administrador:
 * recebe todos.

 * Cliente:
 * recebe somente os próprios.
 */
export function subscribeToAppointments(
  onUpdate: (
    appointments: Appointment[]
  ) => void,
  userEmail?: string | null,
  userId?: string | null,
  isAdminUser: boolean = false
) {
  try {
    if (
      !isAdminUser &&
      !userEmail &&
      !userId
    ) {
      onUpdate([]);

      return () => {};
    }

    const colRef =
      collection(
        db,
        APPOINTMENTS_COL
      );

    let q = query(colRef);

    if (
      !isAdminUser &&
      userEmail
    ) {
      q = query(
        colRef,
        where(
          'clientEmail',
          '==',
          userEmail
        )
      );
    } else if (
      !isAdminUser &&
      userId
    ) {
      q = query(
        colRef,
        where(
          'userId',
          '==',
          userId
        )
      );
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const list: Appointment[] = [];

        snapshot.forEach((document) => {
          list.push(
            document.data() as Appointment
          );
        });

        list.sort(
          (a, b) =>
            (
              b.createdAt ||
              b.date
            ).localeCompare(
              a.createdAt ||
              a.date
            )
        );

        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(
          error,
          OperationType.LIST,
          APPOINTMENTS_COL
        );
      }
    );
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.LIST,
      APPOINTMENTS_COL
    );

    return () => {};
  }
}

/* ============================================================
   CRIAÇÃO DE AGENDAMENTO
============================================================ */

/**
 * Cria agendamento utilizando transação atômica.
 *
 * Protege contra duas pessoas tentando reservar
 * exatamente o mesmo horário ao mesmo tempo.
 *
 * booked_slots NÃO recebe:
 * - nome
 * - telefone
 * - e-mail
 * - userId
 */
export async function createAppointmentInFirestore(
  appointment: Appointment
): Promise<void> {
  const currentUid =
    auth.currentUser?.uid ||
    appointment.userId;

  if (
    !currentUid ||
    currentUid === 'guest_user'
  ) {
    throw new Error(
      'É obrigatório estar autenticado para criar um agendamento no sistema.'
    );
  }

  const slotKey =
    getSlotKey(
      appointment.date,
      appointment.time,
      appointment.professional
    );

  const slotRef =
    doc(
      db,
      BOOKED_SLOTS_COL,
      slotKey
    );

  const aptRef =
    doc(
      db,
      APPOINTMENTS_COL,
      appointment.id
    );

  try {
    await runTransaction(
      db,
      async (transaction) => {
        const slotSnapshot =
          await transaction.get(
            slotRef
          );

        if (
          slotSnapshot.exists() &&
          slotSnapshot.data()?.isBooked
        ) {
          throw new Error(
            `Horário indisponível: ${appointment.time} em ${appointment.dateFormatted} com ${appointment.professional} já foi reservado por outro cliente.`
          );
        }

        const now =
          new Date().toISOString();

        /* Reserva do horário */
        transaction.set(
          slotRef,
          {
            id: slotKey,
            date: appointment.date,
            time: appointment.time,
            professional:
              appointment.professional,
            appointmentId:
              appointment.id,
            isBooked: true,
            createdAt: now
          }
        );

        /* Agendamento completo */
        transaction.set(
          aptRef,
          {
            ...appointment,
            userId: currentUid,
            createdAt:
              appointment.createdAt ||
              now
          }
        );
      }
    );
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.CREATE,
      `${APPOINTMENTS_COL}/${appointment.id}`
    );
  }
}

/* ============================================================
   ALTERAR STATUS
============================================================ */

/**
 * Atualiza status do agendamento.
 *
 * Quando cancelado:
 * libera somente o slot pertencente
 * ao próprio agendamento.
 *
 * IMPORTANTE:
 * Todos os READS são feitos antes dos WRITES
 * para manter a transação válida no Firestore.
 */
export async function updateAppointmentStatusInFirestore(
  appointment: Appointment,
  newStatus:
    | 'Confirmado'
    | 'Concluído'
    | 'Cancelado'
): Promise<void> {
  const aptPath =
    `${APPOINTMENTS_COL}/${appointment.id}`;

  const slotKey =
    getSlotKey(
      appointment.date,
      appointment.time,
      appointment.professional
    );

  const slotRef =
    doc(
      db,
      BOOKED_SLOTS_COL,
      slotKey
    );

  const aptRef =
    doc(
      db,
      APPOINTMENTS_COL,
      appointment.id
    );

  try {
    await runTransaction(
      db,
      async (transaction) => {
        /* ============================
           READS
        ============================ */

        const aptSnapshot =
          await transaction.get(
            aptRef
          );

        if (!aptSnapshot.exists()) {
          throw new Error(
            'Agendamento não encontrado no sistema.'
          );
        }

        let slotSnapshot = null;

        if (
          newStatus === 'Cancelado'
        ) {
          slotSnapshot =
            await transaction.get(
              slotRef
            );
        }

        /* ============================
           WRITES
        ============================ */

        transaction.update(
          aptRef,
          {
            status: newStatus,
            updatedAt:
              new Date().toISOString()
          }
        );

        if (
          newStatus === 'Cancelado' &&
          slotSnapshot?.exists()
        ) {
          const slotData =
            slotSnapshot.data();

          if (
            slotData?.appointmentId ===
            appointment.id
          ) {
            transaction.delete(
              slotRef
            );
          }
        }
      }
    );
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      aptPath
    );
  }
}

/* ============================================================
   REAGENDAMENTO
============================================================ */

/**
 * Reagenda de forma atômica.
 *
 * Libera o horário antigo e reserva o novo.
 */
export async function rescheduleAppointmentInFirestore(
  appointment: Appointment,
  newDate: string,
  newDateFormatted: string,
  newTime: string,
  newProfessional: string
): Promise<void> {
  const oldSlotKey =
    getSlotKey(
      appointment.date,
      appointment.time,
      appointment.professional
    );

  const newSlotKey =
    getSlotKey(
      newDate,
      newTime,
      newProfessional
    );

  const oldSlotRef =
    doc(
      db,
      BOOKED_SLOTS_COL,
      oldSlotKey
    );

  const newSlotRef =
    doc(
      db,
      BOOKED_SLOTS_COL,
      newSlotKey
    );

  const aptRef =
    doc(
      db,
      APPOINTMENTS_COL,
      appointment.id
    );

  const now =
    new Date().toISOString();

  try {
    await runTransaction(
      db,
      async (transaction) => {
        /* ============================
           READS
        ============================ */

        const aptSnapshot =
          await transaction.get(
            aptRef
          );

        if (!aptSnapshot.exists()) {
          throw new Error(
            'Agendamento não encontrado no sistema.'
          );
        }

        let newSlotSnapshot = null;
        let oldSlotSnapshot = null;

        if (
          oldSlotKey !== newSlotKey
        ) {
          newSlotSnapshot =
            await transaction.get(
              newSlotRef
            );

          oldSlotSnapshot =
            await transaction.get(
              oldSlotRef
            );

          if (
            newSlotSnapshot.exists() &&
            newSlotSnapshot.data()?.isBooked
          ) {
            throw new Error(
              `Horário indisponível: ${newTime} em ${newDateFormatted} com ${newProfessional} já foi reservado por outro cliente.`
            );
          }
        }

        /* ============================
           WRITES
        ============================ */

        if (
          oldSlotKey !== newSlotKey
        ) {
          if (
            oldSlotSnapshot?.exists() &&
            oldSlotSnapshot.data()
              ?.appointmentId ===
              appointment.id
          ) {
            transaction.delete(
              oldSlotRef
            );
          }

          transaction.set(
            newSlotRef,
            {
              id: newSlotKey,
              date: newDate,
              time: newTime,
              professional:
                newProfessional,
              appointmentId:
                appointment.id,
              isBooked: true,
              createdAt: now
            }
          );
        }

        transaction.update(
          aptRef,
          {
            date: newDate,
            dateFormatted:
              newDateFormatted,
            time: newTime,
            professional:
              newProfessional,
            status: 'Confirmado',
            updatedAt: now
          }
        );
      }
    );
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `${APPOINTMENTS_COL}/${appointment.id}`
    );
  }
}
