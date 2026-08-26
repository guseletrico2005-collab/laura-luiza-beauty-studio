import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Scissors, 
  ShieldCheck,
  CheckCircle2,
  Share2,
  CalendarCheck,
  AlertCircle
} from 'lucide-react';
import { Service, Professional, Appointment } from '../types';
import { AVAILABLE_TIME_SLOTS, PROFESSIONALS, getProfessionalAvailabilityForDate } from '../data/mockData';
import { getSlotKey } from '../services/firestoreService';

interface BookingSectionProps {
  services: Service[];
  selectedService: Service | null;
  professionals?: Professional[];
  bookedSlots?: Set<string>;
  currentUser?: { name?: string; email?: string; phone?: string; uid?: string; role?: 'client' | 'admin' } | null;
  onServiceChange: (service: Service) => void;
  onBookingConfirmed: (appointment: Appointment) => Promise<void> | void;
  onViewAppointments: () => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  services,
  selectedService,
  professionals = [],
  bookedSlots = new Set(),
  currentUser = null,
  onServiceChange,
  onBookingConfirmed,
  onViewAppointments,
}) => {
  const activeServices = services.filter((s) => (s.isActive ?? s.active ?? true));
  const currentService = selectedService || activeServices[0] || services[0];

  const effectiveProfessionals = (professionals && professionals.length > 0)
    ? professionals
    : PROFESSIONALS;
  const activeProfessionals = effectiveProfessionals.filter((p) => (p.isActive ?? p.active ?? true));

  // Calendar State: Default to tomorrow
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Tomorrow by default
    return d;
  });
  
  const [selectedProf, setSelectedProf] = useState<Professional>(activeProfessionals[0] || PROFESSIONALS[0]);
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Keep selectedProf in sync with activeProfessionals
  useEffect(() => {
    if (activeProfessionals.length > 0) {
      const match = activeProfessionals.find((p) => p.id === selectedProf?.id || p.name === selectedProf?.name);
      if (match) {
        setSelectedProf(match);
      } else {
        setSelectedProf(activeProfessionals[0]);
      }
    }
  }, [professionals]);

  // Compute availability for current selected professional on selected date
  const availability = getProfessionalAvailabilityForDate(selectedProf, selectedDate);
  const availableSlotsForDay = availability.isAvailable ? availability.slots : [];

  // If selectedTime is no longer available in the current day/professional schedule, pick first available
  useEffect(() => {
    if (availableSlotsForDay.length > 0) {
      if (!availableSlotsForDay.includes(selectedTime)) {
        // Find first slot that is not booked
        const firstFreeSlot = availableSlotsForDay.find((slot) => {
          const key = getSlotKey(formatDateISO(selectedDate), slot, selectedProf.name);
          return !bookedSlots.has(key);
        });
        setSelectedTime(firstFreeSlot || availableSlotsForDay[0]);
      }
    }
  }, [selectedProf, selectedDate, availableSlotsForDay.join(',')]);
  
  // Client Form Info: Prefill from logged in user if available
  const [clientName, setClientName] = useState<string>(currentUser?.name || '');
  const [clientPhone, setClientPhone] = useState<string>(currentUser?.phone || '');
  const [clientEmail, setClientEmail] = useState<string>(currentUser?.email || '');
  const [clientNotes, setClientNotes] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setClientName(currentUser.name);
      if (currentUser.phone) setClientPhone(currentUser.phone);
      if (currentUser.email) setClientEmail(currentUser.email);
    }
  }, [currentUser]);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [lastCreatedAppointment, setLastCreatedAppointment] = useState<Appointment | null>(null);

  // Month navigation helpers
  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newDate);
  };

  // Calendar days generator
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const totalDays = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const isPastDate = (day: number) => {
    const checkDate = new Date(year, month, day, 23, 59, 59);
    return checkDate < new Date();
  };

  const formatDatePT = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const y = d.getFullYear();
    return `${day}/${m}/${y}`;
  };

  const formatDateISO = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const y = d.getFullYear();
    return `${y}-${m}-${day}`;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setIsSubmitting(true);

    if (!currentService) {
      setIsSubmitting(false);
      return;
    }

    // Pre-check duplicate booking protection from real-time client state
    const selectedSlotKey = getSlotKey(formatDateISO(selectedDate), selectedTime, selectedProf.name);
    if (bookedSlots.has(selectedSlotKey)) {
      setBookingError(`O horário das ${selectedTime} no dia ${formatDatePT(selectedDate)} com ${selectedProf.name} já está ocupado. Por favor, escolha outro horário ou profissional.`);
      setIsSubmitting(false);
      return;
    }

    if (!currentUser?.uid) {
      setBookingError('É obrigatório estar autenticado para confirmar seu agendamento.');
      setIsSubmitting(false);
      return;
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      serviceId: currentService.id,
      serviceName: currentService.name,
      serviceImage: currentService.image,
      date: formatDateISO(selectedDate),
      dateFormatted: formatDatePT(selectedDate),
      time: selectedTime,
      professional: selectedProf.name,
      clientName: clientName.trim() || currentUser?.name || 'Cliente',
      clientPhone: clientPhone.trim() || currentUser?.phone || '(11) 99999-9999',
      clientEmail: clientEmail.trim() || (currentUser?.email || ''),
      price: currentService.price,
      status: 'Confirmado',
      notes: clientNotes.trim(),
      createdAt: new Date().toISOString(),
      userId: currentUser.uid
    };

    try {
      await onBookingConfirmed(newAppointment);
      setLastCreatedAppointment(newAppointment);
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      console.error('Booking failed:', err);
      setBookingError(
        err?.message ||
        'Não foi possível confirmar o agendamento devido a uma concorrência de horário. Por favor, escolha outro horário.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking-section" className="py-12 sm:py-20 bg-gradient-to-b from-[#FAF3F5] via-[#FCF9F7] to-[#FAF3F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAD3DC] text-[#9E4760] text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Agendamento Rápido
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#351C26]">
            Reserve seu Horário Exclusivo
          </h2>
          <p className="text-sm sm:text-base text-[#6B4E58]">
            Selecione o procedimento desejado, a melhor data e horário para seu momento de beleza e autocuidado.
          </p>
        </div>

        {/* Booking Form Layout */}
        <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Service Selection + Calendar + Time Slots */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Escolha o Serviço */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#EFE2E7] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF0F3] text-[#9E4760] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#351C26]">
                    Escolha o Serviço
                  </h3>
                </div>
                <span className="text-xs text-[#8E6A77]">
                  {activeServices.length} opções disponíveis
                </span>
              </div>

              {/* Service Cards Grid selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeServices.map((service) => {
                  const isSelected = currentService?.id === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      id={`booking-select-service-${service.id}`}
                      onClick={() => onServiceChange(service)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#9E4760] bg-[#FAF0F3] ring-2 ring-[#9E4760]/20 shadow-sm'
                          : 'border-[#ECE0E6] bg-white hover:border-[#D9BAC5]'
                      }`}
                    >
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-[#9E4760]' : 'text-[#351C26]'}`}>
                          {service.name}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="text-[#8E6A77]">{service.durationFormatted}</span>
                          <span className="font-bold text-[#351C26]">
                            R$ {service.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#9E4760] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Escolha a Data (Calendário Visual) */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#EFE2E7] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF0F3] text-[#9E4760] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#351C26]">
                    Escolha a data
                  </h3>
                </div>
                
                {/* Month Navigator */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl border border-[#E2CDD6] text-[#7A4B5B] hover:bg-[#FAF0F3] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs sm:text-sm font-bold text-[#351C26] min-w-[120px] text-center">
                    {monthNames[month]} {year}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl border border-[#E2CDD6] text-[#7A4B5B] hover:bg-[#FAF0F3] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Visual Calendar Grid */}
              <div className="pt-2">
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {weekDayNames.map((d, i) => (
                    <div key={i} className="text-[11px] font-bold text-[#9E7D8A] py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days numbers */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {/* Empty slots before first day */}
                  {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10 sm:h-11" />
                  ))}

                  {/* Month days */}
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateObj = new Date(year, month, dayNum);
                    const isSelected = isSameDay(dateObj, selectedDate);
                    const isPast = isPastDate(dayNum);
                    const dayAvail = getProfessionalAvailabilityForDate(selectedProf, dateObj);
                    const isProfOff = !dayAvail.isAvailable;
                    const isDisabled = isPast || isProfOff;

                    return (
                      <button
                        key={`day-${dayNum}`}
                        type="button"
                        id={`calendar-day-${dayNum}`}
                        disabled={isDisabled}
                        title={isPast ? 'Data passada' : isProfOff ? (dayAvail.reason || 'Profissional indisponível') : 'Disponível'}
                        onClick={() => setSelectedDate(dateObj)}
                        className={`h-10 sm:h-11 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex flex-col items-center justify-center relative ${
                          isDisabled
                            ? 'text-gray-300 cursor-not-allowed opacity-50 bg-[#FAFAFA]'
                            : isSelected
                            ? 'bg-[#9E4760] text-white shadow-md shadow-[#9E4760]/30 font-bold scale-102'
                            : 'bg-[#FCF9F7] text-[#3D1E28] hover:bg-[#FAF0F3] hover:text-[#9E4760] border border-[#F0E0E6]'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {isSameDay(dateObj, today) && (
                          <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#9E4760]'} absolute bottom-1.5`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-[11px] text-[#8E6A77] text-center pt-1">
                * As datas e horários disponíveis adaptam-se automaticamente à escala e folgas de cada profissional.
              </p>
            </div>

            {/* 3. Horários Disponíveis */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#EFE2E7] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF0F3] text-[#9E4760] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#351C26]">
                    Horários disponíveis
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#9E4760]">
                  {formatDatePT(selectedDate)} • {selectedProf.name}
                </span>
              </div>

              {!availability.isAvailable ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Profissional Indisponível nesta data
                  </p>
                  <p className="text-amber-700 text-xs">
                    {availability.reason || 'Esta profissional não possui expediente nesta data.'} Por favor, selecione outro dia no calendário acima ou escolha outra profissional ao lado.
                  </p>
                </div>
              ) : availableSlotsForDay.length === 0 ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
                  <p className="font-bold">Nenhum horário disponível</p>
                  <p className="text-rose-700 text-xs">Todos os horários desta data estão ocupados ou bloqueados.</p>
                </div>
              ) : (
                /* Time Slots Buttons */
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {AVAILABLE_TIME_SLOTS.map((slot) => {
                    const isWithinWorkingHours = availableSlotsForDay.includes(slot);
                    const slotKey = getSlotKey(formatDateISO(selectedDate), slot, selectedProf.name);
                    const isBooked = bookedSlots.has(slotKey);
                    const isUnavailable = !isWithinWorkingHours || isBooked;
                    const isSelected = selectedTime === slot && !isUnavailable;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isUnavailable}
                        id={`time-slot-${slot.replace(':', '')}`}
                        onClick={() => {
                          setSelectedTime(slot);
                          setBookingError(null);
                        }}
                        className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                          isUnavailable
                            ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through opacity-60'
                            : isSelected
                            ? 'bg-[#9E4760] text-white shadow-md shadow-[#9E4760]/25 ring-2 ring-[#9E4760]/20 cursor-pointer'
                            : 'bg-[#FCF9F7] text-[#4A2D39] hover:bg-[#FAF0F3] hover:text-[#9E4760] border border-[#ECD8E1] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot}</span>
                        </div>
                        {isBooked ? (
                          <span className="text-[10px] text-rose-500 font-semibold no-underline">
                            Ocupado
                          </span>
                        ) : !isWithinWorkingHours ? (
                          <span className="text-[10px] text-gray-400 font-normal no-underline">
                            Indisponível
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Professional + Client Details + Booking Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Professional Picker */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EFE2E7] shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#9E4760]">
                Profissional Preferida
              </h4>
              
              <div className="space-y-2">
                {activeProfessionals.map((prof) => {
                  const isSelected = selectedProf.id === prof.id || selectedProf.name === prof.name;
                  return (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => setSelectedProf(prof)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#9E4760] bg-[#FAF0F3] ring-1 ring-[#9E4760]'
                          : 'border-[#EDE0E6] bg-white hover:border-[#D9BAC5]'
                      }`}
                    >
                      <img
                        src={prof.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'}
                        alt={prof.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#9E4760]/20 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-[#351C26] truncate">
                          {prof.name}
                        </p>
                        <p className="text-[11px] text-[#8E6A77] truncate">
                          {prof.role}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#9E4760] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Info Inputs */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EFE2E7] shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#9E4760]">
                Seus Dados para Contato
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#543843] mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FCF9F7] border border-[#E2CDD6] text-xs sm:text-sm text-[#351C26] focus:outline-none focus:ring-2 focus:ring-[#9E4760]/30 focus:border-[#9E4760]"
                    />
                    <User className="w-4 h-4 text-[#9E7D8A] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#543843] mb-1">
                    WhatsApp / Telefone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FCF9F7] border border-[#E2CDD6] text-xs sm:text-sm text-[#351C26] focus:outline-none focus:ring-2 focus:ring-[#9E4760]/30 focus:border-[#9E4760]"
                    />
                    <Phone className="w-4 h-4 text-[#9E7D8A] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#543843] mb-1">
                    E-mail (Opcional)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FCF9F7] border border-[#E2CDD6] text-xs sm:text-sm text-[#351C26] focus:outline-none focus:ring-2 focus:ring-[#9E4760]/30 focus:border-[#9E4760]"
                    />
                    <Mail className="w-4 h-4 text-[#9E7D8A] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#543843] mb-1">
                    Observações (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Preferências, tipo de cabelo ou alergias..."
                    className="w-full p-3 rounded-xl bg-[#FCF9F7] border border-[#E2CDD6] text-xs sm:text-sm text-[#351C26] focus:outline-none focus:ring-2 focus:ring-[#9E4760]/30 focus:border-[#9E4760] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Summary & Confirm Button Box */}
            <div className="bg-gradient-to-br from-[#3D1E28] to-[#261017] text-white p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className="text-xs text-[#FDE7EC] font-medium">Resumo do Agendamento</span>
                <span className="text-xs font-bold text-[#F3D794]">Studio Laura</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-[#EAD0D9]">Procedimento:</span>
                  <span className="font-bold text-white text-right">{currentService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#EAD0D9]">Data:</span>
                  <span className="font-bold text-white">{formatDatePT(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#EAD0D9]">Horário:</span>
                  <span className="font-bold text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#EAD0D9]">Profissional:</span>
                  <span className="font-bold text-white">{selectedProf.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#EAD0D9]">Duração:</span>
                  <span className="font-bold text-white">{currentService?.durationFormatted}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/15 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-[#EAD0D9]">Valor Total</span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#F3D794]">
                  R$ {currentService?.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Booking Conflict Error Alert */}
              {bookingError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Main Submit Button */}
              <button
                type="submit"
                id="booking-submit-confirm-btn"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D47B95] via-[#9E3D59] to-[#D47B95] hover:opacity-95 text-white text-sm sm:text-base font-bold shadow-lg shadow-black/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <CalendarCheck className="w-5 h-5 text-white" />
                <span>{isSubmitting ? 'Reservando horário...' : 'Confirmar agendamento'}</span>
              </button>

              <p className="text-[11px] text-[#D8BAC5] text-center">
                * Sem cobrança antecipada. Pagamento realizado no salão.
              </p>
            </div>

          </div>

        </form>

      </div>

      {/* Success Confirmation Modal */}
      {isSuccessModalOpen && lastCreatedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D1620]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl overflow-hidden max-w-md w-full border border-[#EFE2E7] shadow-2xl p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 rounded-full bg-[#FAF0F3] text-[#9E4760] mx-auto flex items-center justify-center ring-8 ring-[#FAF0F3]/60">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-2xl font-bold text-[#351C26]">
                Agendamento Confirmado!
              </h3>
              <p className="text-xs sm:text-sm text-[#7A5A66]">
                Seu horário no <strong>Laura Luíza Beauty</strong> foi reservado com sucesso.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="p-4 rounded-2xl bg-[#FAF0F3] border border-[#ECD1DA] text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8E6A77]">Serviço:</span>
                <span className="font-bold text-[#351C26]">{lastCreatedAppointment.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E6A77]">Data & Hora:</span>
                <span className="font-bold text-[#351C26]">
                  {lastCreatedAppointment.dateFormatted} às {lastCreatedAppointment.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E6A77]">Profissional:</span>
                <span className="font-bold text-[#351C26]">{lastCreatedAppointment.professional}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E6A77]">Cliente:</span>
                <span className="font-bold text-[#351C26]">{lastCreatedAppointment.clientName}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E8CCD6]">
                <span className="text-[#8E6A77]">Valor:</span>
                <span className="font-bold text-[#9E4760]">
                  R$ {lastCreatedAppointment.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Actions in Modal */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                id="booking-modal-view-appointments-btn"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  onViewAppointments();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#9E4760] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#9E4760]/25 hover:bg-[#85354C] transition-all cursor-pointer"
              >
                Ver Meus Agendamentos
              </button>

              <a
                href={`https://wa.me/5511999998888?text=Ol%C3%A1!%20Acabei%20de%20agendar%20${encodeURIComponent(lastCreatedAppointment.serviceName)}%20para%20${lastCreatedAppointment.dateFormatted}%20%C3%A0s%20${lastCreatedAppointment.time}%20com%20${encodeURIComponent(lastCreatedAppointment.professional)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-[#1EBE5D] transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Salvar / Enviar no WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-2 text-xs font-semibold text-[#8E6A77] hover:text-[#351C26]"
              >
                Fechar e continuar navegando
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
