/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppView, Service, Appointment, Professional, CurrentUser } from './types';
import {
  INITIAL_SERVICES,
  PROFESSIONALS,
  SALON_INFO
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { ServicesSection } from './components/ServicesSection';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { BookingSection } from './components/BookingSection';
import { AppointmentsView } from './components/AppointmentsView';
import { AuthView } from './components/AuthView';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';
import { ClientAuthGate } from './components/ClientAuthGate';

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import {
  subscribeToServices,
  subscribeToAppointments,
  subscribeToBookedSlots,
  subscribeToProfessionals,
  createAppointmentInFirestore,
  updateAppointmentStatusInFirestore,
  rescheduleAppointmentInFirestore,
  saveServiceToFirestore,
  deleteServiceFromFirestore,
  saveProfessionalToFirestore,
  deleteProfessionalFromFirestore,
  seedDefaultProfessionalsIfAdmin,
  getUserProfileFromFirestore,
  checkIsAdmin
} from './services/firestoreService';

import { Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);

  const [professionals, setProfessionals] = useState<Professional[]>(
    PROFESSIONALS
  );

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  const [selectedServiceForModal, setSelectedServiceForModal] =
    useState<Service | null>(null);

  const [selectedServiceForBooking, setSelectedServiceForBooking] =
    useState<Service | null>(INITIAL_SERVICES[0]);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Auth state
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Firebase Auth + Firestore profile synchronization
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let isAdmin = false;
        let profileName = user.displayName || 'Cliente';
        let profilePhone = user.phoneNumber || '';

        try {
          // Check admin privileges
          isAdmin = await checkIsAdmin();

          // Load Firestore user profile
          const userDoc = await getUserProfileFromFirestore(user.uid);

          if (userDoc) {
            if (userDoc.name) {
              profileName = userDoc.name;
            }

            if (userDoc.phone) {
              profilePhone = userDoc.phone;
            }

            if (userDoc.role === 'admin') {
              isAdmin = true;
            }
          }
        } catch (e) {
          console.warn(
            'Error fetching user profile details:',
            e
          );
        }

        setCurrentUser({
          uid: user.uid,
          name: profileName,
          email: user.email || undefined,
          phone: profilePhone || undefined,
          photoURL: user.photoURL || undefined,
          role: isAdmin ? 'admin' : 'client'
        });

        // Depois do login, iniciar na tela de serviços
        setCurrentView('home');
      } else {
        setCurrentUser(null);
      }

      setIsAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time listener for Services, Booked Slots and Professionals
  useEffect(() => {
    if (!currentUser) return;

    const unsubServices = subscribeToServices((firestoreServices) => {
      if (firestoreServices && firestoreServices.length > 0) {
        setServices(firestoreServices);

        if (!selectedServiceForBooking) {
          setSelectedServiceForBooking(firestoreServices[0]);
        }
      }
    });

    const unsubSlots = subscribeToBookedSlots((slots) => {
      setBookedSlots(slots);
    });

    const unsubProfessionals = subscribeToProfessionals(
      (firestoreProfs) => {
        if (firestoreProfs && firestoreProfs.length > 0) {
          setProfessionals(firestoreProfs);
        }
      }
    );

    return () => {
      unsubServices();
      unsubSlots();
      unsubProfessionals();
    };
  }, [currentUser]);

  // Real-time listener for appointments
  useEffect(() => {
    if (!currentUser) {
      setAppointments([]);
      return;
    }

    const isAdmin = currentUser.role === 'admin';

    const unsubAppointments = subscribeToAppointments(
      (firestoreAppointments) => {
        if (firestoreAppointments) {
          setAppointments(firestoreAppointments);
        }
      },
      currentUser.email,
      currentUser.uid,
      isAdmin
    );

    return () => {
      if (unsubAppointments) {
        unsubAppointments();
      }
    };
  }, [currentUser]);

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentView]);

  // Open service details
  const handleViewDetails = (service: Service) => {
    setSelectedServiceForModal(service);
    setIsDetailModalOpen(true);
  };

  // Select service and go to booking
  const handleBookService = (service: Service) => {
    setSelectedServiceForBooking(service);
    setCurrentView('booking');
  };

  // Confirm booking
  const handleBookingConfirmed = async (
    newAppointment: Appointment
  ) => {
    await createAppointmentInFirestore(newAppointment);

    setAppointments((prev) => [
      newAppointment,
      ...prev.filter(
        (appointment) => appointment.id !== newAppointment.id
      )
    ]);
  };

  // Cancel appointment
  const handleCancelAppointment = async (
    appointment: Appointment
  ) => {
    try {
      await updateAppointmentStatusInFirestore(
        appointment,
        'Cancelado'
      );
    } catch (err) {
      console.error(
        'Error updating status in Firestore:',
        err
      );
    }

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointment.id
          ? {
              ...apt,
              status: 'Cancelado'
            }
          : apt
      )
    );
  };

  // Update appointment status
  const handleUpdateAppointmentStatus = async (
    appointment: Appointment,
    newStatus:
      | 'Confirmado'
      | 'Concluído'
      | 'Cancelado'
  ) => {
    await updateAppointmentStatusInFirestore(
      appointment,
      newStatus
    );

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointment.id
          ? {
              ...apt,
              status: newStatus
            }
          : apt
      )
    );
  };

  // Reschedule appointment
  const handleRescheduleAppointment = async (
    appointment: Appointment,
    newDate: string,
    newDateFormatted: string,
    newTime: string,
    newProfessional: string
  ) => {
    await rescheduleAppointmentInFirestore(
      appointment,
      newDate,
      newDateFormatted,
      newTime,
      newProfessional
    );

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointment.id
          ? {
              ...apt,
              date: newDate,
              dateFormatted: newDateFormatted,
              time: newTime,
              professional: newProfessional,
              status: 'Confirmado'
            }
          : apt
      )
    );
  };

  // Create manual appointment
  const handleCreateManualAppointment = async (
    newAppointment: Appointment
  ) => {
    await createAppointmentInFirestore(newAppointment);

    setAppointments((prev) => [
      newAppointment,
      ...prev.filter(
        (appointment) => appointment.id !== newAppointment.id
      )
    ]);
  };

  // Save service
  const handleSaveService = async (service: Service) => {
    await saveServiceToFirestore(service);
  };

  // Delete service
  const handleDeleteService = async (id: string) => {
    await deleteServiceFromFirestore(id);
  };

  // Save professional
  const handleSaveProfessional = async (
    professional: Professional
  ) => {
    await saveProfessionalToFirestore(professional);
  };

  // Delete professional
  const handleDeleteProfessional = async (
    id: string,
    name?: string
  ) => {
    await deleteProfessionalFromFirestore(id, name);
  };

  // Seed professionals
  const handleSeedProfessionals = async () => {
    return await seedDefaultProfessionalsIfAdmin();
  };

  // Login success
  const handleLoginSuccess = (
    name: string,
    email: string
  ) => {
    if (!name && !email) {
      setCurrentUser(null);
      setCurrentView('home');
    }
  };

  // ============================================================
  // 1. LOADING SCREEN
  // ============================================================

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF3F5] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9E4760] to-[#E8A7B8] p-1 shadow-lg shadow-[#9E4760]/20 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#FCF9F7] rounded-full flex items-center justify-center text-[#9E4760]">
            <Sparkles
              className="w-8 h-8 animate-spin"
              style={{
                animationDuration: '3s'
              }}
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-serif text-xl font-bold text-[#3D1E28]">
            Laura Luíza Beauty
          </h2>

          <p className="text-xs text-[#8E6A77] mt-1 flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3 h-3 animate-spin text-[#9E4760]" />
            <span>Iniciando ambiente seguro...</span>
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // 2. MANDATORY CLIENT AUTHENTICATION
  // ============================================================

  if (!currentUser) {
    return (
      <ClientAuthGate
        onAuthenticated={async (user) => {
          let isAdmin = false;
          let profileName = user.displayName || 'Cliente';
          let profilePhone = user.phoneNumber || '';

          try {
            isAdmin = await checkIsAdmin();

            const userDoc =
              await getUserProfileFromFirestore(user.uid);

            if (userDoc) {
              if (userDoc.name) {
                profileName = userDoc.name;
              }

              if (userDoc.phone) {
                profilePhone = userDoc.phone;
              }

              if (userDoc.role === 'admin') {
                isAdmin = true;
              }
            }
          } catch (e) {
            console.warn(
              'Error loading profile after auth:',
              e
            );
          }

          setCurrentUser({
            uid: user.uid,
            name: profileName,
            email: user.email || undefined,
            phone: profilePhone || undefined,
            photoURL: user.photoURL || undefined,
            role: isAdmin ? 'admin' : 'client'
          });

          // IMPORTANTE:
          // Depois do login o cliente vai para a tela de serviços.
          setCurrentView('home');
        }}
      />
    );
  }

  // ============================================================
  // 3. AUTHENTICATED APPLICATION
  // ============================================================

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7] text-[#3D2C33] antialiased pb-16 lg:pb-0 font-sans">

      {/* Main Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        salonInfo={SALON_INFO}
        appointmentsCount={
          appointments.filter(
            (appointment) =>
              appointment.status === 'Confirmado'
          ).length
        }
        userRole={currentUser.role}
      />

      {/* Main Content */}
      <main className="flex-1">

        {/* ======================================================
            HOME VIEW

            Depois do login:
            LOGIN → SERVIÇOS
            ====================================================== */}

        {currentView === 'home' && (
          <ServicesSection
            services={services}
            onViewDetails={handleViewDetails}
            onBookService={handleBookService}
          />
        )}

        {/* SERVICES VIEW */}
        {currentView === 'services' && (
          <div className="pt-4">
            <ServicesSection
              services={services}
              onViewDetails={handleViewDetails}
              onBookService={handleBookService}
            />
          </div>
        )}

        {/* BOOKING VIEW */}
        {currentView === 'booking' && (
          <BookingSection
            services={services}
            selectedService={selectedServiceForBooking}
            professionals={professionals}
            bookedSlots={bookedSlots}
            currentUser={currentUser}
            onServiceChange={setSelectedServiceForBooking}
            onBookingConfirmed={handleBookingConfirmed}
            onViewAppointments={() =>
              setCurrentView('appointments')
            }
          />
        )}

        {/* MY APPOINTMENTS VIEW */}
        {currentView === 'appointments' && (
          <AppointmentsView
            appointments={appointments}
            currentUser={currentUser}
            onCancelAppointment={handleCancelAppointment}
            onBookNew={() => {
              setSelectedServiceForBooking(services[0]);
              setCurrentView('booking');
            }}
            onOpenAuthModal={() =>
              setCurrentView('auth')
            }
          />
        )}

        {/* AUTH / CLIENT PROFILE VIEW */}
        {currentView === 'auth' && (
          <AuthView
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() =>
              setCurrentView('home')
            }
          />
        )}

        {/* ADMIN VIEW */}
        {currentView === 'admin' && (
          <AdminView
            services={services}
            professionals={professionals}
            appointments={appointments}
            bookedSlots={bookedSlots}
            currentUser={currentUser}
            onSaveService={handleSaveService}
            onDeleteService={handleDeleteService}
            onSaveProfessional={handleSaveProfessional}
            onDeleteProfessional={handleDeleteProfessional}
            onSeedProfessionals={handleSeedProfessionals}
            onUpdateAppointmentStatus={
              handleUpdateAppointmentStatus
            }
            onRescheduleAppointment={
              handleRescheduleAppointment
            }
            onCreateManualAppointment={
              handleCreateManualAppointment
            }
            onExitAdmin={() =>
              setCurrentView('home')
            }
            onOpenAuthModal={() =>
              setCurrentView('auth')
            }
          />
        )}

      </main>

      {/* Service Details Modal */}
      <ServiceDetailModal
        service={selectedServiceForModal}
        isOpen={isDetailModalOpen}
        onClose={() =>
          setIsDetailModalOpen(false)
        }
        onBook={handleBookService}
      />

      {/* Footer */}
      <Footer
        salonInfo={SALON_INFO}
        onNavigateBooking={() =>
          setCurrentView('booking')
        }
        onNavigateServices={() =>
          setCurrentView('services')
        }
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentView={currentView}
        onNavigate={setCurrentView}
        appointmentsCount={
          appointments.filter(
            (appointment) =>
              appointment.status === 'Confirmado'
          ).length
        }
      />

    </div>
  );
}
