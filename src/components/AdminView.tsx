import React, { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search,
  Sparkles,
  Scissors,
  ShieldAlert,
  Lock,
  LogIn,
  ArrowLeft,
  Clock,
  UserCheck,
  UserX,
  CalendarOff,
  Coffee,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MessageSquare,
  Phone,
  Mail,
  User,
  Filter,
  Eye
} from 'lucide-react';
import { Service, Appointment, Professional, WeeklySchedule, DayOfWeekKey, ScheduleException } from '../types';
import { DEFAULT_WEEKLY_SCHEDULE, getDayOfWeekKey, getProfessionalAvailabilityForDate, AVAILABLE_TIME_SLOTS } from '../data/mockData';
import { SeedResult, getSlotKey, formatPhoneMask, validateBrazilianPhone } from '../services/firestoreService';

interface AdminViewProps {
  services: Service[];
  professionals: Professional[];
  appointments: Appointment[];
  bookedSlots?: Set<string>;
  currentUser: { name?: string; email?: string; phone?: string; uid?: string; role?: 'client' | 'admin' } | null;
  onSaveService: (service: Service) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
  onSaveProfessional: (professional: Professional) => Promise<void>;
  onDeleteProfessional: (id: string, name?: string) => Promise<void>;
  onSeedProfessionals?: () => Promise<SeedResult>;
  onUpdateAppointmentStatus?: (appointment: Appointment, newStatus: 'Confirmado' | 'Concluído' | 'Cancelado') => Promise<void>;
  onRescheduleAppointment?: (appointment: Appointment, newDate: string, newDateFormatted: string, newTime: string, newProfessional: string) => Promise<void>;
  onCreateManualAppointment?: (appointment: Appointment) => Promise<void>;
  onExitAdmin: () => void;
  onOpenAuthModal?: () => void;
}

const DAYS_OF_WEEK: { key: DayOfWeekKey; label: string; short: string }[] = [
  { key: 'segunda', label: 'Segunda-feira', short: 'Seg' },
  { key: 'terca', label: 'Terça-feira', short: 'Ter' },
  { key: 'quarta', label: 'Quarta-feira', short: 'Qua' },
  { key: 'quinta', label: 'Quinta-feira', short: 'Qui' },
  { key: 'sexta', label: 'Sexta-feira', short: 'Sex' },
  { key: 'sabado', label: 'Sábado', short: 'Sáb' },
  { key: 'domingo', label: 'Domingo', short: 'Dom' }
];

export const AdminView: React.FC<AdminViewProps> = ({
  services,
  professionals,
  appointments,
  bookedSlots = new Set(),
  currentUser,
  onSaveService,
  onDeleteService,
  onSaveProfessional,
  onDeleteProfessional,
  onSeedProfessionals,
  onUpdateAppointmentStatus,
  onRescheduleAppointment,
  onCreateManualAppointment,
  onExitAdmin,
  onOpenAuthModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'professionals' | 'appointments'>('overview');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [profSearchTerm, setProfSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSeedingProfs, setIsSeedingProfs] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New exception form state inside professional modal
  const [newExceptionDate, setNewExceptionDate] = useState('');
  const [newExceptionType, setNewExceptionType] = useState<'day_off' | 'partial_block'>('day_off');
  const [newExceptionStartTime, setNewExceptionStartTime] = useState('13:00');
  const [newExceptionEndTime, setNewExceptionEndTime] = useState('15:00');
  const [newExceptionReason, setNewExceptionReason] = useState('');

  // --- APPOINTMENTS MANAGEMENT STATE ---
  const [aptSearchTerm, setAptSearchTerm] = useState('');
  const [aptDateFilter, setAptDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'this_week' | 'this_month' | 'custom'>('all');
  const [aptCustomDate, setAptCustomDate] = useState('');
  const [aptProfFilter, setAptProfFilter] = useState('all');
  const [aptStatusFilter, setAptStatusFilter] = useState<string>('all');
  const [isProcessingAptAction, setIsProcessingAptAction] = useState(false);
  const [viewingNotesAppointment, setViewingNotesAppointment] = useState<Appointment | null>(null);

  // Reschedule modal state
  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleProfName, setRescheduleProfName] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Manual booking modal state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualServiceId, setManualServiceId] = useState('');
  const [manualProfName, setManualProfName] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState('');
  const [manualClientName, setManualClientName] = useState('');
  const [manualClientPhone, setManualClientPhone] = useState('');
  const [manualClientEmail, setManualClientEmail] = useState('');
  const [manualNotes, setManualNotes] = useState('');


  // Check if current user has admin privileges
  const isAdmin = currentUser?.role === 'admin';

  // If not admin, block access with security barrier
  if (!isAdmin) {
    return (
      <section className="py-16 sm:py-24 bg-[#FAF3F5] min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EFE2E7] shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase">
                <ShieldAlert className="w-3.5 h-3.5" />
                Acesso Restrito
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#351C26]">
                Área Administrativa
              </h2>
              <p className="text-xs sm:text-sm text-[#7A5A66]">
                Este painel de gestão é de uso exclusivo da administração do salão de beleza.
              </p>
            </div>

            {currentUser ? (
              <div className="p-3.5 rounded-2xl bg-[#FCF9F7] border border-[#ECD1DA] text-xs text-[#5C3F4B]">
                Conectado atualmente como: <br />
                <strong className="text-[#9E4760] font-bold">{currentUser.email}</strong> (Perfil de Cliente)
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-[#FCF9F7] border border-[#ECD1DA] text-xs text-[#7A5A66]">
                Faça login com a conta de administrador autorizada para gerenciar serviços e agendamentos.
              </div>
            )}

            <div className="space-y-3 pt-2">
              {onOpenAuthModal && (
                <button
                  type="button"
                  id="admin-barrier-login-btn"
                  onClick={onOpenAuthModal}
                  className="w-full py-3 px-4 rounded-xl bg-[#9E4760] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#85354C] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar com Conta de Administrador</span>
                </button>
              )}

              <button
                type="button"
                id="admin-barrier-exit-btn"
                onClick={onExitAdmin}
                className="w-full py-2.5 px-4 rounded-xl border border-[#E2CDD6] text-xs font-semibold text-[#7A4B5B] hover:bg-[#FAF0F3] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Site Público</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Stats
  const totalRevenue = appointments
    .filter((a) => a.status === 'Confirmado')
    .reduce((acc, curr) => acc + curr.price, 0);

  const confirmedCount = appointments.filter((a) => a.status === 'Confirmado').length;

  const handleToggleService = async (service: Service) => {
    const updatedStatus = !service.isActive;
    const updated: Service = {
      ...service,
      isActive: updatedStatus,
      active: updatedStatus
    };
    try {
      await onSaveService(updated);
      setActionFeedback({
        type: 'success',
        message: `Serviço "${service.name}" ${updatedStatus ? 'ativado' : 'desativado'} com sucesso no catálogo.`
      });
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: `Falha ao alterar status do serviço: ${err?.message || 'Erro de permissão'}`
      });
    }
  };

  const handleSaveService = async (service: Service) => {
    setIsSaving(true);
    setActionFeedback(null);
    try {
      // Calculate duration formatted if needed
      const durationMins = Number(service.durationMinutes) || Number(service.duration) || 60;
      const hours = Math.floor(durationMins / 60);
      const mins = durationMins % 60;
      let durationFormatted = '';
      if (hours > 0 && mins > 0) {
        durationFormatted = `${hours}h ${mins.toString().padStart(2, '0')}min`;
      } else if (hours > 0) {
        durationFormatted = `${hours}h 00min`;
      } else {
        durationFormatted = `${mins} min`;
      }

      const serviceToSave: Service = {
        ...service,
        price: Number(service.price) || 0,
        duration: durationMins,
        durationMinutes: durationMins,
        durationFormatted: service.durationFormatted || durationFormatted,
        active: service.isActive ?? service.active ?? true,
        isActive: service.isActive ?? service.active ?? true
      };

      await onSaveService(serviceToSave);
      setEditingService(null);
      setActionFeedback({
        type: 'success',
        message: `Serviço "${serviceToSave.name}" salvo com sucesso no Firestore!`
      });
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: `Erro ao salvar serviço: ${err?.message || 'Erro desconhecido'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (service: Service) => {
    if (confirm(`Deseja realmente remover o serviço "${service.name}" do catálogo do Firestore?`)) {
      setActionFeedback(null);
      try {
        await onDeleteService(service.id);
        setActionFeedback({
          type: 'success',
          message: `Serviço "${service.name}" removido com sucesso!`
        });
      } catch (err: any) {
        setActionFeedback({
          type: 'error',
          message: err?.message || 'Falha ao excluir serviço do Firestore.'
        });
      }
    }
  };

  // --- PROFESSIONALS HANDLERS ---
  const handleToggleProfessional = async (prof: Professional) => {
    const updatedStatus = !(prof.isActive ?? prof.active ?? true);
    const updated: Professional = {
      ...prof,
      isActive: updatedStatus,
      active: updatedStatus
    };
    try {
      await onSaveProfessional(updated);
      setActionFeedback({
        type: 'success',
        message: `Profissional "${prof.name}" ${updatedStatus ? 'ativada' : 'desativada'} com sucesso.`
      });
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: `Falha ao alterar status da profissional: ${err?.message || 'Erro desconhecido'}`
      });
    }
  };

  const handleSaveProfessional = async (prof: Professional) => {
    setIsSaving(true);
    setActionFeedback(null);
    try {
      const profToSave: Professional = {
        ...prof,
        active: prof.isActive ?? prof.active ?? true,
        isActive: prof.isActive ?? prof.active ?? true,
        weeklySchedule: prof.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE,
        exceptions: prof.exceptions || []
      };

      await onSaveProfessional(profToSave);
      setEditingProfessional(null);
      setActionFeedback({
        type: 'success',
        message: `Profissional "${profToSave.name}" salva com sucesso no Firestore!`
      });
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: `Erro ao salvar profissional: ${err?.message || 'Erro desconhecido'}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfessional = async (prof: Professional) => {
    if (confirm(`Deseja realmente excluir a profissional "${prof.name}"? Se houver agendamentos confirmados vinculados a ela, o sistema solicitará apenas desativá-la.`)) {
      setActionFeedback(null);
      try {
        await onDeleteProfessional(prof.id, prof.name);
        setActionFeedback({
          type: 'success',
          message: `Profissional "${prof.name}" excluída com sucesso!`
        });
      } catch (err: any) {
        setActionFeedback({
          type: 'error',
          message: err?.message || 'Falha ao excluir profissional do Firestore.'
        });
      }
    }
  };

  const handleSeedProfessionals = async () => {
    if (!onSeedProfessionals) return;
    setIsSeedingProfs(true);
    setActionFeedback(null);
    try {
      const result = await onSeedProfessionals();
      setActionFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message
      });
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: `Erro ao inicializar profissionais: ${err?.message || 'Erro desconhecido'}`
      });
    } finally {
      setIsSeedingProfs(false);
    }
  };

  const handleAddException = () => {
    if (!editingProfessional || !newExceptionDate) return;
    const newEx: ScheduleException = {
      id: `ex_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      date: newExceptionDate,
      type: newExceptionType,
      startTime: newExceptionType === 'partial_block' ? newExceptionStartTime : undefined,
      endTime: newExceptionType === 'partial_block' ? newExceptionEndTime : undefined,
      reason: newExceptionReason.trim() || (newExceptionType === 'day_off' ? 'Folga programada' : 'Bloqueio de horário')
    };

    setEditingProfessional({
      ...editingProfessional,
      exceptions: [...(editingProfessional.exceptions || []), newEx]
    });

    // Reset form
    setNewExceptionDate('');
    setNewExceptionReason('');
  };

  const handleRemoveException = (exceptionId: string) => {
    if (!editingProfessional) return;
    setEditingProfessional({
      ...editingProfessional,
      exceptions: (editingProfessional.exceptions || []).filter((e) => e.id !== exceptionId)
    });
  };

  const handleDayScheduleChange = (
    dayKey: DayOfWeekKey,
    field: keyof import('../types').DaySchedule,
    value: any
  ) => {
    if (!editingProfessional) return;
    const currentSchedule = editingProfessional.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE;
    const currentDay = currentSchedule[dayKey] || { enabled: true, startTime: '09:00', endTime: '19:00' };

    setEditingProfessional({
      ...editingProfessional,
      weeklySchedule: {
        ...currentSchedule,
        [dayKey]: {
          ...currentDay,
          [field]: value
        }
      }
    });
  };

  // --- APPOINTMENTS HANDLERS ---
  const handleUpdateStatus = async (
    appointment: Appointment,
    newStatus: 'Confirmado' | 'Concluído' | 'Cancelado'
  ) => {
    if (newStatus === 'Cancelado') {
      if (!confirm(`Deseja realmente cancelar o agendamento de "${appointment.clientName}" (${appointment.dateFormatted} às ${appointment.time})? A vaga será liberada imediatamente no sistema.`)) {
        return;
      }
    }
    
    if (!onUpdateAppointmentStatus) return;
    setIsProcessingAptAction(true);
    setActionFeedback(null);
    try {
      await onUpdateAppointmentStatus(appointment, newStatus);
      setActionFeedback({
        type: 'success',
        message: `Status do agendamento de "${appointment.clientName}" alterado para ${newStatus}.`
      });
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err?.message || 'Falha ao atualizar status do agendamento.'
      });
    } finally {
      setIsProcessingAptAction(false);
    }
  };

  const handleOpenReschedule = (apt: Appointment) => {
    setReschedulingAppointment(apt);
    setRescheduleDate(apt.date);
    setRescheduleProfName(apt.professional);
    setRescheduleTime(apt.time);
    setActionFeedback(null);
  };

  const handleConfirmReschedule = async () => {
    if (!reschedulingAppointment || !onRescheduleAppointment) return;
    if (!rescheduleDate || !rescheduleTime || !rescheduleProfName) {
      alert('Selecione data, profissional e horário disponível para reagendar.');
      return;
    }

    const [y, m, d] = rescheduleDate.split('-');
    const newDateFormatted = `${d}/${m}/${y}`;

    setIsProcessingAptAction(true);
    try {
      await onRescheduleAppointment(
        reschedulingAppointment,
        rescheduleDate,
        newDateFormatted,
        rescheduleTime,
        rescheduleProfName
      );
      setActionFeedback({
        type: 'success',
        message: `Agendamento de "${reschedulingAppointment.clientName}" reagendado com sucesso para ${newDateFormatted} às ${rescheduleTime} com ${rescheduleProfName}!`
      });
      setReschedulingAppointment(null);
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err?.message || 'Erro ao reagendar no Firestore.'
      });
    } finally {
      setIsProcessingAptAction(false);
    }
  };

  const handleOpenManualBooking = () => {
    const activeProfs = professionals.filter((p) => p.isActive ?? p.active ?? true);
    const activeServs = services.filter((s) => s.isActive ?? s.active ?? true);
    
    setManualServiceId(activeServs[0]?.id || services[0]?.id || '');
    setManualProfName(activeProfs[0]?.name || professionals[0]?.name || 'Laura Luíza');
    setManualDate(new Date().toISOString().split('T')[0]);
    setManualTime('');
    setManualClientName('');
    setManualClientPhone('');
    setManualClientEmail('');
    setManualNotes('');
    setIsManualModalOpen(true);
    setActionFeedback(null);
  };

  const handleConfirmManualBooking = async () => {
    if (!onCreateManualAppointment) return;
    if (!manualClientName.trim()) {
      alert('Por favor, informe o nome da cliente.');
      return;
    }
    if (!manualClientPhone.trim() || !validateBrazilianPhone(manualClientPhone)) {
      alert('Por favor, informe um número de telefone/WhatsApp válido com DDD.');
      return;
    }
    if (!manualDate || !manualTime) {
      alert('Por favor, selecione data e horário de atendimento.');
      return;
    }

    const selectedServ = services.find((s) => s.id === manualServiceId) || services[0];
    if (!selectedServ) {
      alert('Selecione um serviço válido.');
      return;
    }

    const [y, m, d] = manualDate.split('-');
    const dateFormatted = `${d}/${m}/${y}`;

    const newApt: Appointment = {
      id: `apt_adm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      serviceId: selectedServ.id,
      serviceName: selectedServ.name,
      serviceImage: selectedServ.image,
      date: manualDate,
      dateFormatted,
      time: manualTime,
      professional: manualProfName,
      clientName: manualClientName.trim(),
      clientPhone: manualClientPhone.trim(),
      clientEmail: manualClientEmail.trim() || 'balcao@lauraluizabeauty.com.br',
      price: selectedServ.price,
      status: 'Confirmado',
      notes: manualNotes.trim() ? `[Agendamento Manual via Administração] ${manualNotes.trim()}` : '[Agendamento Manual via Administração]',
      createdAt: new Date().toISOString(),
      userId: currentUser?.uid || 'admin_manual'
    };

    setIsProcessingAptAction(true);
    try {
      await onCreateManualAppointment(newApt);
      setActionFeedback({
        type: 'success',
        message: `Novo agendamento de "${newApt.clientName}" para ${newApt.dateFormatted} às ${newApt.time} gravado com sucesso!`
      });
      setIsManualModalOpen(false);
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err?.message || 'Falha ao gravar agendamento manual no Firestore.'
      });
    } finally {
      setIsProcessingAptAction(false);
    }
  };

  // Date filtering constants
  const todayISO = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowISO = tomorrowDate.toISOString().split('T')[0];

  const nowObj = new Date();
  const currentDayOfWeek = nowObj.getDay();
  const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const startOfWeek = new Date(nowObj);
  startOfWeek.setDate(nowObj.getDate() + diffToMonday);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const startOfWeekISO = startOfWeek.toISOString().split('T')[0];
  const endOfWeekISO = endOfWeek.toISOString().split('T')[0];
  const currentMonthISO = todayISO.substring(0, 7);

  // Filtered appointments calculation
  const filteredAppointments = appointments.filter((apt) => {
    // 1. Search filter
    if (aptSearchTerm.trim()) {
      const q = aptSearchTerm.toLowerCase();
      const matches =
        apt.clientName?.toLowerCase().includes(q) ||
        apt.clientPhone?.toLowerCase().includes(q) ||
        apt.clientEmail?.toLowerCase().includes(q) ||
        apt.serviceName?.toLowerCase().includes(q) ||
        apt.professional?.toLowerCase().includes(q) ||
        apt.id?.toLowerCase().includes(q) ||
        apt.notes?.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // 2. Date filter
    if (aptDateFilter === 'today' && apt.date !== todayISO) return false;
    if (aptDateFilter === 'tomorrow' && apt.date !== tomorrowISO) return false;
    if (aptDateFilter === 'this_week' && (apt.date < startOfWeekISO || apt.date > endOfWeekISO)) return false;
    if (aptDateFilter === 'this_month' && !apt.date.startsWith(currentMonthISO)) return false;
    if (aptDateFilter === 'custom' && aptCustomDate && apt.date !== aptCustomDate) return false;

    // 3. Professional filter
    if (aptProfFilter !== 'all' && apt.professional !== aptProfFilter) return false;

    // 4. Status filter
    if (aptStatusFilter !== 'all' && apt.status !== aptStatusFilter) return false;

    return true;
  });

  return (
    <section className="py-8 sm:py-12 bg-[#FAF3F5] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFE2E7] shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F3] text-[#9E4760] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Painel de Gestão do Salão
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#351C26]">
              Laura Luíza Beauty • Administração
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="px-4 py-2.5 rounded-xl border border-[#E2CDD6] text-xs sm:text-sm font-semibold text-[#7A4B5B] hover:bg-[#FAF0F3] cursor-pointer"
            >
              Voltar ao Site Público
            </button>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
              actionFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionFeedback.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{actionFeedback.message}</span>
            </div>
            <button
              onClick={() => setActionFeedback(null)}
              className="p-1 hover:bg-black/5 rounded-lg text-gray-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#9E4760] text-white shadow-sm'
                : 'bg-white text-[#7A4B5B] hover:bg-[#FAF0F3] border border-[#EFE2E7]'
            }`}
          >
            📊 Visão Geral & Métricas
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-[#9E4760] text-white shadow-sm'
                : 'bg-white text-[#7A4B5B] hover:bg-[#FAF0F3] border border-[#EFE2E7]'
            }`}
          >
            📅 Agenda & Atendimentos ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#9E4760] text-white shadow-sm'
                : 'bg-white text-[#7A4B5B] hover:bg-[#FAF0F3] border border-[#EFE2E7]'
            }`}
          >
            ✂️ Gerenciar Serviços ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('professionals')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'professionals'
                ? 'bg-[#9E4760] text-white shadow-sm'
                : 'bg-white text-[#7A4B5B] hover:bg-[#FAF0F3] border border-[#EFE2E7]'
            }`}
          >
            👩‍💼 Profissionais & Horários ({professionals.length})
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Stat KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#EFE2E7] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#8E6A77]">
                  <span className="text-xs font-semibold">Faturamento Estimado</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#351C26]">
                  R$ {totalRevenue.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18% em relação ao mês anterior
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#EFE2E7] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#8E6A77]">
                  <span className="text-xs font-semibold">Agendamentos Confirmados</span>
                  <div className="p-2 rounded-xl bg-rose-50 text-[#9E4760]">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#351C26]">
                  {confirmedCount}
                </div>
                <p className="text-[11px] text-[#8E6A77]">
                  Taxa de ocupação da agenda: 85%
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#EFE2E7] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#8E6A77]">
                  <span className="text-xs font-semibold">Serviços no Catálogo</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Scissors className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#351C26]">
                  {services.length}
                </div>
                <p className="text-[11px] text-[#8E6A77]">
                  {services.filter((s) => s.isPopular).length} destacados como populares
                </p>
              </div>
            </div>

            {/* Recent Schedule Preview */}
            <div className="bg-white p-6 rounded-3xl border border-[#EFE2E7] shadow-xs space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#351C26]">
                Últimos Agendamentos Recebidos
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#F0E0E6] text-[#8E6A77] text-xs">
                      <th className="pb-3 font-semibold">Cliente</th>
                      <th className="pb-3 font-semibold">Serviço</th>
                      <th className="pb-3 font-semibold">Data & Hora</th>
                      <th className="pb-3 font-semibold">Profissional</th>
                      <th className="pb-3 font-semibold">Valor</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF0F3]">
                    {appointments.slice(0, 5).map((apt) => (
                      <tr key={apt.id} className="hover:bg-[#FCF9F7]">
                        <td className="py-3 font-bold text-[#351C26]">{apt.clientName}</td>
                        <td className="py-3 text-[#5C3F4B]">{apt.serviceName}</td>
                        <td className="py-3 text-[#7A5A66]">{apt.dateFormatted} às {apt.time}</td>
                        <td className="py-3 text-[#7A5A66]">{apt.professional}</td>
                        <td className="py-3 font-bold text-[#9E4760]">
                          R$ {apt.price.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            apt.status === 'Confirmado'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* SERVICES MANAGEMENT TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Feedback Alert Bar */}
            {actionFeedback && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all ${
                  actionFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <span>{actionFeedback.message}</span>
                <button
                  onClick={() => setActionFeedback(null)}
                  className="p-1 hover:bg-black/5 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar serviço..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E2CDD6] text-xs text-[#351C26]"
                />
                <Search className="w-4 h-4 text-[#8E6A77] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={() => {
                  setActionFeedback(null);
                  setEditingService({
                    id: `srv-${Date.now()}`,
                    name: 'Novo Procedimento',
                    category: 'cabelo',
                    duration: 60,
                    durationMinutes: 60,
                    durationFormatted: '1h 00min',
                    price: 120,
                    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
                    description: 'Descrição do procedimento oferecido no salão.',
                    fullDescription: 'Descrição detalhada e benefícios exclusivos.',
                    highlights: ['Atendimento VIP', 'Produtos Profissionais'],
                    isPopular: false,
                    popular: false,
                    active: true,
                    isActive: true
                  });
                }}
                className="px-4 py-2.5 rounded-xl bg-[#9E4760] text-white text-xs font-bold shadow-xs hover:bg-[#85354C] transition-all flex items-center gap-1.5 self-start cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Serviço</span>
              </button>
            </div>

            {/* Services Table List */}
            <div className="bg-white rounded-3xl border border-[#EFE2E7] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FAF0F3] border-b border-[#ECD1DA] text-[#7A4B5B]">
                    <tr>
                      <th className="p-4 font-bold">Serviço</th>
                      <th className="p-4 font-bold">Categoria</th>
                      <th className="p-4 font-bold">Duração</th>
                      <th className="p-4 font-bold">Preço Oficial (R$)</th>
                      <th className="p-4 font-bold">Destaque</th>
                      <th className="p-4 font-bold">Status no Site</th>
                      <th className="p-4 font-bold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5E8ED]">
                    {services
                      .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((srv) => (
                        <tr key={srv.id} className="hover:bg-[#FCF9F7]">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={srv.image}
                                alt={srv.name}
                                className="w-10 h-10 rounded-xl object-cover"
                              />
                              <div>
                                <p className="font-bold text-[#351C26]">{srv.name}</p>
                                <p className="text-[11px] text-[#8E6A77] line-clamp-1">{srv.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 uppercase text-[11px] font-bold text-[#8E6A77]">
                            {srv.category}
                          </td>
                          <td className="p-4 text-[#5C3F4B]">{srv.durationFormatted || `${srv.durationMinutes || srv.duration} min`}</td>
                          <td className="p-4 font-bold text-[#9E4760] font-mono text-sm">
                            R$ {srv.price.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="p-4">
                            {srv.isPopular || srv.popular ? (
                              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                                ⭐ Popular
                              </span>
                            ) : (
                              <span className="text-[#8E6A77] text-[10px]">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleService(srv)}
                              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                                srv.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-500 border border-gray-200'
                              }`}
                            >
                              {srv.isActive ? '● Ativo' : '○ Pausado'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setActionFeedback(null);
                                  setEditingService(srv);
                                }}
                                title="Editar Serviço"
                                className="p-1.5 rounded-lg border border-[#E2CDD6] text-[#7A4B5B] hover:bg-[#FAF0F3] cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(srv)}
                                title="Excluir Serviço"
                                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PROFESSIONALS TAB */}
        {activeTab === 'professionals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#EFE2E7] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#351C26]">
                    Equipe de Profissionais & Disponibilidade
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A5A66]">
                    Gerencie profissionais ativas, jornadas de trabalho semanais e bloqueios de folga/feriado.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onSeedProfessionals && professionals.length <= 4 && (
                    <button
                      type="button"
                      onClick={handleSeedProfessionals}
                      disabled={isSeedingProfs}
                      className="px-3.5 py-2.5 rounded-xl border border-[#D9BCC7] bg-[#FAF0F3] text-[#9E4760] text-xs font-bold hover:bg-[#F3DEE6] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Gravar as 4 profissionais padrão no Firestore"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isSeedingProfs ? 'Gravando...' : 'Sincronizar Padrões no Firestore'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setActionFeedback(null);
                      setEditingProfessional({
                        id: `prof-${Date.now()}`,
                        name: '',
                        role: '',
                        avatar: '',
                        specialties: [],
                        isActive: true,
                        active: true,
                        weeklySchedule: JSON.parse(JSON.stringify(DEFAULT_WEEKLY_SCHEDULE)),
                        exceptions: []
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#9E4760] text-white text-xs font-bold shadow-xs hover:bg-[#85354C] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Nova Profissional</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E6A77]" />
                <input
                  type="text"
                  placeholder="Buscar profissional por nome, cargo ou especialidade..."
                  value={profSearchTerm}
                  onChange={(e) => setProfSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FCF9F7] border border-[#ECD1DA] text-xs sm:text-sm focus:outline-none focus:border-[#9E4760]"
                />
              </div>

              {/* Grid of Professionals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {professionals
                  .filter((p) => 
                    p.name.toLowerCase().includes(profSearchTerm.toLowerCase()) ||
                    p.role.toLowerCase().includes(profSearchTerm.toLowerCase()) ||
                    (p.specialties || []).some(s => s.toLowerCase().includes(profSearchTerm.toLowerCase()))
                  )
                  .map((prof) => {
                    const isProfActive = prof.isActive ?? prof.active ?? true;
                    const exceptionsCount = (prof.exceptions || []).length;
                    const currentSchedule = prof.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE;

                    return (
                      <div
                        key={prof.id}
                        className={`p-5 rounded-3xl border transition-all ${
                          isProfActive
                            ? 'bg-white border-[#ECD1DA] shadow-xs'
                            : 'bg-gray-50 border-gray-200 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={prof.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'}
                              alt={prof.name}
                              className="w-13 h-13 rounded-2xl object-cover border border-[#ECD1DA] shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm sm:text-base text-[#351C26]">
                                  {prof.name}
                                </h4>
                              </div>
                              <p className="text-xs text-[#9E4760] font-medium">
                                {prof.role}
                              </p>
                              {prof.specialties && prof.specialties.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {prof.specialties.slice(0, 3).map((spec, i) => (
                                    <span
                                      key={i}
                                      className="px-1.5 py-0.5 rounded-md bg-[#FAF0F3] text-[#7A4B5B] text-[10px]"
                                    >
                                      {spec}
                                    </span>
                                  ))}
                                  {prof.specialties.length > 3 && (
                                    <span className="text-[10px] text-[#8E6A77] self-center">
                                      +{prof.specialties.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleProfessional(prof)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                                isProfActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200'
                              }`}
                            >
                              {isProfActive ? '● Ativa' : '○ Inativa'}
                            </button>
                          </div>
                        </div>

                        {/* Working Days & Schedule Badges */}
                        <div className="mt-4 pt-3 border-t border-[#F5E8ED] space-y-2">
                          <div className="flex items-center justify-between text-xs text-[#7A5A66]">
                            <span className="font-semibold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#9E4760]" />
                              Dias de Atendimento:
                            </span>
                            {exceptionsCount > 0 && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                                {exceptionsCount} {exceptionsCount === 1 ? 'bloqueio/folga' : 'bloqueios/folgas'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 flex-wrap">
                            {DAYS_OF_WEEK.map((day) => {
                              const daySched = currentSchedule[day.key];
                              const isWorking = daySched && daySched.enabled;
                              return (
                                <div
                                  key={day.key}
                                  title={
                                    isWorking
                                      ? `${day.label}: ${daySched.startTime} às ${daySched.endTime}${
                                          daySched.breakStart ? ` (Intervalo: ${daySched.breakStart}-${daySched.breakEnd})` : ''
                                        }`
                                      : `${day.label}: Folga`
                                  }
                                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border ${
                                    isWorking
                                      ? 'bg-[#FAF0F3] text-[#9E4760] border-[#E8CCD5]'
                                      : 'bg-gray-50 text-gray-400 border-gray-200 line-through'
                                  }`}
                                >
                                  {day.short}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 pt-3 border-t border-[#F5E8ED] flex items-center justify-between gap-2">
                          <span className="text-[11px] text-[#8E6A77] font-mono">
                            ID: {prof.id}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActionFeedback(null);
                                setEditingProfessional(JSON.parse(JSON.stringify(prof)));
                              }}
                              className="px-3 py-1.5 rounded-xl border border-[#ECD1DA] bg-[#FAF0F3] text-[#7A4B5B] text-xs font-semibold hover:bg-[#F3DEE6] transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#9E4760]" />
                              <span>Configurar Horários</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProfessional(prof)}
                              title="Excluir profissional"
                              className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            
            {/* Header & New Manual Booking Button */}
            <div className="bg-white rounded-3xl border border-[#EFE2E7] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F3] text-[#9E4760] text-xs font-bold uppercase tracking-wider mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Gestão da Agenda em Tempo Real
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#351C26]">
                  Controle de Atendimentos & Agendamentos
                </h3>
                <p className="text-xs sm:text-sm text-[#7A5A66]">
                  Acompanhe agendamentos, confirme presenças, reagende horários e crie marcações manuais para clientes de balcão e WhatsApp.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenManualBooking}
                className="px-5 py-3 rounded-2xl bg-[#9E4760] text-white text-xs sm:text-sm font-bold hover:bg-[#85354C] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Novo Agendamento Manual</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-3xl border border-[#EFE2E7] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#F5E8ED] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#351C26] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#9E4760]" />
                  Filtros e Busca na Agenda
                </span>
                <span className="text-xs text-[#8E6A77] font-semibold">
                  Exibindo {filteredAppointments.length} de {appointments.length} agendamento(s)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                
                {/* Search Text */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-[#543843] mb-1">Buscar por Cliente / Serviço</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nome, telefone, serviço..."
                      value={aptSearchTerm}
                      onChange={(e) => setAptSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2CDD6] bg-[#FCF9F7] text-xs focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-[11px] font-bold text-[#543843] mb-1">Filtrar por Período</label>
                  <select
                    value={aptDateFilter}
                    onChange={(e) => setAptDateFilter(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-[#E2CDD6] bg-[#FCF9F7] text-xs focus:bg-white"
                  >
                    <option value="all">Todas as Datas</option>
                    <option value="today">📅 Somente Hoje</option>
                    <option value="tomorrow">📅 Amanhã</option>
                    <option value="this_week">🗓️ Esta Semana</option>
                    <option value="this_month">🗓️ Este Mês</option>
                    <option value="custom">🔍 Data Específica...</option>
                  </select>
                </div>

                {/* Professional Filter */}
                <div>
                  <label className="block text-[11px] font-bold text-[#543843] mb-1">Profissional Responsável</label>
                  <select
                    value={aptProfFilter}
                    onChange={(e) => setAptProfFilter(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#E2CDD6] bg-[#FCF9F7] text-xs focus:bg-white"
                  >
                    <option value="all">Todas as Profissionais</option>
                    {professionals.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} {!(p.isActive ?? p.active ?? true) ? '(Inativa)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-[11px] font-bold text-[#543843] mb-1">Status do Agendamento</label>
                  <select
                    value={aptStatusFilter}
                    onChange={(e) => setAptStatusFilter(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#E2CDD6] bg-[#FCF9F7] text-xs focus:bg-white"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="Confirmado">🟢 Confirmados (Em aberto)</option>
                    <option value="Concluído">🔵 Concluídos (Atendidos)</option>
                    <option value="Cancelado">🔴 Cancelados</option>
                    <option value="Pendente">🟡 Pendentes</option>
                  </select>
                </div>

              </div>

              {/* Custom Date Input if selected */}
              {aptDateFilter === 'custom' && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-[#7A5A66]">Selecione a data exata:</span>
                  <input
                    type="date"
                    value={aptCustomDate}
                    onChange={(e) => setAptCustomDate(e.target.value)}
                    className="p-1.5 rounded-xl border border-[#E2CDD6] bg-white text-xs"
                  />
                </div>
              )}

              {/* Clear Filters button */}
              {(aptSearchTerm || aptDateFilter !== 'all' || aptProfFilter !== 'all' || aptStatusFilter !== 'all' || aptCustomDate) && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAptSearchTerm('');
                      setAptDateFilter('all');
                      setAptCustomDate('');
                      setAptProfFilter('all');
                      setAptStatusFilter('all');
                    }}
                    className="text-xs text-[#9E4760] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Limpar todos os filtros</span>
                  </button>
                </div>
              )}
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-3xl border border-[#EFE2E7] p-6 shadow-xs space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FAF0F3] border-b border-[#ECD1DA] text-[#7A4B5B]">
                    <tr>
                      <th className="p-3 font-bold">Cliente & Contato</th>
                      <th className="p-3 font-bold">Procedimento</th>
                      <th className="p-3 font-bold">Data & Horário</th>
                      <th className="p-3 font-bold">Profissional</th>
                      <th className="p-3 font-bold">Valor</th>
                      <th className="p-3 font-bold text-center">Status</th>
                      <th className="p-3 font-bold text-right">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5E8ED]">
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((apt) => {
                        const rawPhone = apt.clientPhone.replace(/\D/g, '');
                        const waLink = rawPhone ? `https://wa.me/55${rawPhone}` : null;

                        return (
                          <tr key={apt.id} className="hover:bg-[#FCF9F7] transition-colors">
                            {/* Client & Contact */}
                            <td className="p-3">
                              <div className="font-bold text-[#351C26] flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#9E4760] shrink-0" />
                                <span>{apt.clientName}</span>
                              </div>
                              <div className="text-[11px] text-[#7A5A66] mt-0.5 space-y-0.5">
                                {waLink ? (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-emerald-700 hover:underline flex items-center gap-1 font-mono"
                                    title="Conversar no WhatsApp"
                                  >
                                    <Phone className="w-3 h-3 text-emerald-600" />
                                    <span>{apt.clientPhone}</span>
                                  </a>
                                ) : (
                                  <span className="font-mono">{apt.clientPhone}</span>
                                )}
                                {apt.clientEmail && apt.clientEmail !== 'balcao@lauraluizabeauty.com.br' && (
                                  <div className="text-[10px] text-gray-500 truncate max-w-[160px]" title={apt.clientEmail}>
                                    {apt.clientEmail}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Service & Notes */}
                            <td className="p-3">
                              <div className="font-semibold text-[#5C3F4B]">
                                {apt.serviceName}
                              </div>
                              {apt.notes && (
                                <button
                                  type="button"
                                  onClick={() => setViewingNotesAppointment(apt)}
                                  className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium hover:bg-amber-100 transition-colors cursor-pointer"
                                  title="Ver observações da cliente"
                                >
                                  <MessageSquare className="w-3 h-3 text-amber-600" />
                                  <span>Ver Nota</span>
                                </button>
                              )}
                            </td>

                            {/* Date & Time */}
                            <td className="p-3">
                              <div className="font-bold text-[#351C26]">
                                {apt.dateFormatted}
                              </div>
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF0F3] text-[#9E4760] text-xs font-mono font-bold mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span>{apt.time}</span>
                              </div>
                            </td>

                            {/* Professional */}
                            <td className="p-3 text-[#543843] font-medium">
                              {apt.professional}
                            </td>

                            {/* Price */}
                            <td className="p-3 font-bold text-[#9E4760] font-mono whitespace-nowrap">
                              R$ {apt.price.toFixed(2).replace('.', ',')}
                            </td>

                            {/* Status Badge */}
                            <td className="p-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                  apt.status === 'Confirmado'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : apt.status === 'Concluído'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : apt.status === 'Cancelado'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {apt.status === 'Confirmado' && <CheckCircle2 className="w-3 h-3" />}
                                {apt.status === 'Concluído' && <Check className="w-3 h-3" />}
                                {apt.status === 'Cancelado' && <XCircle className="w-3 h-3" />}
                                <span>{apt.status}</span>
                              </span>
                            </td>

                            {/* Quick Actions */}
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                
                                {/* Mark as Completed */}
                                {apt.status === 'Confirmado' && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStatus(apt, 'Concluído')}
                                    disabled={isProcessingAptAction}
                                    title="Marcar como Concluído / Atendido"
                                    className="p-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer disabled:opacity-50"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}

                                {/* Reschedule */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenReschedule(apt)}
                                  disabled={isProcessingAptAction}
                                  title="Reagendar Data / Horário / Profissional"
                                  className="p-1.5 rounded-xl border border-[#ECD1DA] bg-[#FAF0F3] text-[#9E4760] hover:bg-[#F3DEE6] transition-all cursor-pointer disabled:opacity-50"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>

                                {/* Cancel */}
                                {apt.status === 'Confirmado' && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStatus(apt, 'Cancelado')}
                                    disabled={isProcessingAptAction}
                                    title="Cancelar agendamento (libera vaga no Firestore)"
                                    className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer disabled:opacity-50"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}

                                {/* If already canceled, show Reactivate / Reconfirm */}
                                {apt.status === 'Cancelado' && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReschedule(apt)}
                                    disabled={isProcessingAptAction}
                                    className="px-2.5 py-1 rounded-xl bg-[#9E4760] text-white text-[11px] font-bold hover:bg-[#85354C] transition-all cursor-pointer disabled:opacity-50"
                                  >
                                    Reativar
                                  </button>
                                )}

                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#8E6A77]">
                          <CalendarOff className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                          <p className="font-bold text-sm text-[#351C26]">Nenhum agendamento encontrado</p>
                          <p className="text-xs text-[#7A5A66] mt-1">
                            Não há agendamentos que correspondam aos filtros selecionados.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      {/* RESCHEDULE APPOINTMENT MODAL */}
      {reschedulingAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 border border-[#EFE2E7] shadow-2xl my-6">
            
            <div className="flex items-center justify-between border-b border-[#F0E0E6] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FAF0F3] text-[#9E4760]">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#351C26]">
                    Reagendar Atendimento
                  </h3>
                  <p className="text-xs text-[#7A5A66]">
                    Cliente: <strong>{reschedulingAppointment.clientName}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReschedulingAppointment(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current details box */}
            <div className="p-3.5 rounded-2xl bg-[#FCF9F7] border border-[#ECD1DA] text-xs space-y-1">
              <div className="text-[#7A5A66]">Agendamento Atual:</div>
              <div className="font-bold text-[#351C26]">{reschedulingAppointment.serviceName}</div>
              <div className="text-[#543843]">
                {reschedulingAppointment.dateFormatted} às {reschedulingAppointment.time} com {reschedulingAppointment.professional}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Select Professional */}
              <div>
                <label className="block font-bold text-[#543843] mb-1">1. Profissional Responsável</label>
                <select
                  value={rescheduleProfName}
                  onChange={(e) => {
                    setRescheduleProfName(e.target.value);
                    setRescheduleTime('');
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white text-xs font-semibold"
                >
                  {professionals
                    .filter((p) => p.isActive ?? p.active ?? true)
                    .map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} - {p.role}
                      </option>
                    ))}
                </select>
              </div>

              {/* Select Date */}
              <div>
                <label className="block font-bold text-[#543843] mb-1">2. Nova Data de Atendimento</label>
                <input
                  type="date"
                  min={todayISO}
                  value={rescheduleDate}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value);
                    setRescheduleTime('');
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white text-xs font-semibold"
                />
              </div>

              {/* Available Slots Grid */}
              <div>
                <label className="block font-bold text-[#543843] mb-1">3. Selecione o Novo Horário Disponível</label>
                {(() => {
                  const selectedProf = professionals.find((p) => p.name === rescheduleProfName);
                  const availability = selectedProf && rescheduleDate
                    ? getProfessionalAvailabilityForDate(selectedProf, rescheduleDate)
                    : { isAvailable: true, slots: AVAILABLE_TIME_SLOTS };

                  if (!availability.isAvailable) {
                    return (
                      <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                        {availability.reason || 'Profissional indisponível nesta data.'}
                      </p>
                    );
                  }

                  const slotsList = availability.slots.length > 0 ? availability.slots : AVAILABLE_TIME_SLOTS;

                  return (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                      {slotsList.map((slot) => {
                        const slotKey = getSlotKey(rescheduleDate, slot, rescheduleProfName);
                        // Check if booked by another appointment
                        const isBooked =
                          bookedSlots.has(slotKey) &&
                          !(
                            reschedulingAppointment.date === rescheduleDate &&
                            reschedulingAppointment.time === slot &&
                            reschedulingAppointment.professional === rescheduleProfName
                          );
                        const isSelected = rescheduleTime === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setRescheduleTime(slot)}
                            className={`p-2 rounded-xl text-xs font-mono font-bold text-center border transition-all cursor-pointer ${
                              isBooked
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-[#9E4760] text-white border-[#9E4760] shadow-sm'
                                : 'bg-[#FCF9F7] text-[#351C26] border-[#ECD1DA] hover:bg-[#FAF0F3]'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#F0E0E6]">
              <button
                type="button"
                onClick={() => setReschedulingAppointment(null)}
                disabled={isProcessingAptAction}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                disabled={isProcessingAptAction || !rescheduleTime || !rescheduleDate}
                className="px-5 py-2 rounded-xl bg-[#9E4760] text-white text-xs font-bold hover:bg-[#85354C] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isProcessingAptAction ? 'Salvando Reagendamento...' : 'Confirmar Reagendamento'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NEW MANUAL APPOINTMENT MODAL (WALK-IN / WHATSAPP) */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 border border-[#EFE2E7] shadow-2xl my-6 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-[#F0E0E6] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FAF0F3] text-[#9E4760]">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#351C26]">
                    Novo Agendamento Manual
                  </h3>
                  <p className="text-xs text-[#7A5A66]">
                    Cadastre clientes atendidos via WhatsApp, telefone ou presencialmente.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs overflow-y-auto pr-1 flex-1">
              
              {/* Select Service */}
              <div>
                <label className="block font-bold text-[#543843] mb-1">1. Procedimento / Serviço *</label>
                <select
                  value={manualServiceId}
                  onChange={(e) => setManualServiceId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white font-semibold"
                >
                  {services
                    .filter((s) => s.isActive ?? s.active ?? true)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — R$ {s.price.toFixed(2).replace('.', ',')} ({s.durationFormatted || `${s.durationMinutes || 60}min`})
                      </option>
                    ))}
                </select>
              </div>

              {/* Select Professional */}
              <div>
                <label className="block font-bold text-[#543843] mb-1">2. Profissional Responsável *</label>
                <select
                  value={manualProfName}
                  onChange={(e) => {
                    setManualProfName(e.target.value);
                    setManualTime('');
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white font-semibold"
                >
                  {professionals
                    .filter((p) => p.isActive ?? p.active ?? true)
                    .map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} - {p.role}
                      </option>
                    ))}
                </select>
              </div>

              {/* Select Date */}
              <div>
                <label className="block font-bold text-[#543843] mb-1">3. Data de Atendimento *</label>
                <input
                  type="date"
                  min={todayISO}
                  value={manualDate}
                  onChange={(e) => {
                    setManualDate(e.target.value);
                    setManualTime('');
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white font-semibold"
                />
              </div>

              {/* Available Time Slots */}
              <div>
                <label className="block font-bold text-[#543843] mb-1">4. Horário Disponível *</label>
                {(() => {
                  const selectedProf = professionals.find((p) => p.name === manualProfName);
                  const availability = selectedProf && manualDate
                    ? getProfessionalAvailabilityForDate(selectedProf, manualDate)
                    : { isAvailable: true, slots: AVAILABLE_TIME_SLOTS };

                  if (!availability.isAvailable) {
                    return (
                      <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                        {availability.reason || 'Profissional indisponível nesta data.'}
                      </p>
                    );
                  }

                  const slotsList = availability.slots.length > 0 ? availability.slots : AVAILABLE_TIME_SLOTS;

                  return (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
                      {slotsList.map((slot) => {
                        const slotKey = getSlotKey(manualDate, slot, manualProfName);
                        const isBooked = bookedSlots.has(slotKey);
                        const isSelected = manualTime === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setManualTime(slot)}
                            className={`p-2 rounded-xl text-xs font-mono font-bold text-center border transition-all cursor-pointer ${
                              isBooked
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-[#9E4760] text-white border-[#9E4760] shadow-sm'
                                : 'bg-[#FCF9F7] text-[#351C26] border-[#ECD1DA] hover:bg-[#FAF0F3]'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Client Info */}
              <div className="pt-2 border-t border-[#F0E0E6] space-y-2.5">
                <span className="font-bold text-[#351C26] text-xs uppercase tracking-wider block">
                  5. Dados da Cliente
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-[#543843] mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      placeholder="Ex: Amanda Silva"
                      value={manualClientName}
                      onChange={(e) => setManualClientName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#543843] mb-1">Telefone / WhatsApp com DDD *</label>
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={manualClientPhone}
                      onChange={(e) => setManualClientPhone(formatPhoneMask(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#543843] mb-1">E-mail (Opcional)</label>
                  <input
                    type="email"
                    placeholder="cliente@email.com"
                    value={manualClientEmail}
                    onChange={(e) => setManualClientEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#543843] mb-1">Observações do Atendimento (Opcional)</label>
                  <textarea
                    rows={2}
                    placeholder="Preferências da cliente, detalhes da make, histórico..."
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#F0E0E6]">
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                disabled={isProcessingAptAction}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmManualBooking}
                disabled={isProcessingAptAction || !manualClientName.trim() || !manualClientPhone.trim() || !manualTime}
                className="px-5 py-2 rounded-xl bg-[#9E4760] text-white text-xs font-bold hover:bg-[#85354C] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isProcessingAptAction ? 'Gravando Agendamento...' : 'Gravar Agendamento Manual'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW CLIENT NOTES MODAL */}
      {viewingNotesAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-[#EFE2E7] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F0E0E6] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#351C26]">
                    Observação da Cliente
                  </h3>
                  <p className="text-xs text-[#7A5A66]">
                    {viewingNotesAppointment.clientName} • {viewingNotesAppointment.dateFormatted} às {viewingNotesAppointment.time}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingNotesAppointment(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCF9F7] border border-[#ECD1DA] text-xs text-[#351C26] leading-relaxed whitespace-pre-wrap">
              {viewingNotesAppointment.notes || 'Nenhuma observação registrada.'}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingNotesAppointment(null)}
                className="px-5 py-2 rounded-xl bg-[#9E4760] text-white text-xs font-bold hover:bg-[#85354C] cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}


      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 border border-[#EFE2E7] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F0E0E6] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#351C26]">
                Editar Serviço
              </h3>
              <button onClick={() => setEditingService(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#543843] mb-1">Nome do Procedimento</label>
                  <input
                    type="text"
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E2CDD6]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#543843] mb-1">Categoria</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white text-xs"
                  >
                    <option value="noiva">👑 Dia da Noiva</option>
                    <option value="pacotes">✨ Pacotes & Combos</option>
                    <option value="maquiagem">💄 Maquiagem</option>
                    <option value="cabelo">💇‍♀️ Cabelos & Escovas</option>
                    <option value="sobrancelha">👁️ Sobrancelhas</option>
                    <option value="pes">🦶 Spa dos Pés</option>
                    <option value="tratamento">🧴 Tratamentos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#543843] mb-1">Preço Oficial (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-[#E2CDD6] font-mono font-bold text-[#9E4760]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#543843] mb-1">Duração (Minutos)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingService.durationMinutes || editingService.duration || 60}
                    onChange={(e) => {
                      const mins = Number(e.target.value);
                      const hours = Math.floor(mins / 60);
                      const remainder = mins % 60;
                      let formatted = '';
                      if (hours > 0 && remainder > 0) {
                        formatted = `${hours}h ${remainder.toString().padStart(2, '0')}min`;
                      } else if (hours > 0) {
                        formatted = `${hours}h 00min`;
                      } else {
                        formatted = `${remainder} min`;
                      }
                      setEditingService({
                        ...editingService,
                        duration: mins,
                        durationMinutes: mins,
                        durationFormatted: formatted
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-[#E2CDD6]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#543843] mb-1">Texto Duração</label>
                  <input
                    type="text"
                    value={editingService.durationFormatted}
                    onChange={(e) => setEditingService({ ...editingService, durationFormatted: e.target.value })}
                    placeholder="Ex: 1h 30min"
                    className="w-full p-2.5 rounded-xl border border-[#E2CDD6]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 py-2 px-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#351C26] font-semibold">
                  <input
                    type="checkbox"
                    checked={editingService.isActive ?? editingService.active ?? true}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      active: e.target.checked,
                      isActive: e.target.checked
                    })}
                    className="w-4 h-4 rounded text-[#9E4760] focus:ring-[#9E4760]"
                  />
                  <span>Serviço Ativo para Agendamento</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#351C26] font-semibold">
                  <input
                    type="checkbox"
                    checked={editingService.isPopular ?? editingService.popular ?? false}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      popular: e.target.checked,
                      isPopular: e.target.checked
                    })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>⭐ Destacar como Popular</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-[#543843] mb-1">URL da Imagem</label>
                <input
                  type="text"
                  value={editingService.image}
                  onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E2CDD6]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#543843] mb-1">Breve Descrição (Exibida no Card)</label>
                <textarea
                  rows={2}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E2CDD6]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#543843] mb-1">Descrição Completa (Exibida no Modal de Detalhes)</label>
                <textarea
                  rows={3}
                  value={editingService.fullDescription || ''}
                  onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                  placeholder="Detalhes completos sobre o procedimento, técnicas e diferenciais..."
                  className="w-full p-2.5 rounded-xl border border-[#E2CDD6]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#F0E0E6]">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSaveService(editingService)}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#9E4760] text-white text-xs font-bold hover:bg-[#85354C] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSaving ? 'Salvando no Firestore...' : 'Salvar no Firestore'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFESSIONAL CONFIGURATION & SCHEDULE MODAL */}
      {editingProfessional && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 shadow-2xl border border-[#ECD1DA] my-8 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E0E6]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FAF0F3] text-[#9E4760]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#351C26]">
                    {editingProfessional.name ? `Editar: ${editingProfessional.name}` : 'Cadastrar Nova Profissional'}
                  </h3>
                  <p className="text-xs text-[#7A5A66]">
                    Defina dados básicos, escala de trabalho semanal e exceções/folgas.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfessional(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs sm:text-sm overflow-y-auto pr-1 py-4 flex-1">
              
              {/* Basic Details */}
              <div className="bg-[#FAF3F5] p-4 rounded-2xl border border-[#ECD1DA] space-y-3">
                <h4 className="font-bold text-[#351C26] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Dados Principais da Profissional</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#543843] mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      value={editingProfessional.name}
                      onChange={(e) => setEditingProfessional({ ...editingProfessional, name: e.target.value })}
                      placeholder="Ex: Laura Luíza"
                      className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#543843] mb-1">Cargo / Função *</label>
                    <input
                      type="text"
                      value={editingProfessional.role}
                      onChange={(e) => setEditingProfessional({ ...editingProfessional, role: e.target.value })}
                      placeholder="Ex: Master Hair Stylist & Visagista"
                      className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#543843] mb-1">URL da Foto / Avatar</label>
                    <input
                      type="text"
                      value={editingProfessional.avatar || ''}
                      onChange={(e) => setEditingProfessional({ ...editingProfessional, avatar: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#543843] mb-1">Especialidades (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={(editingProfessional.specialties || []).join(', ')}
                      onChange={(e) => setEditingProfessional({
                        ...editingProfessional,
                        specialties: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })}
                      placeholder="Ex: Noivas, Cortes, Mechas, Visagismo"
                      className="w-full p-2.5 rounded-xl border border-[#E2CDD6] bg-white"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[#351C26] font-semibold">
                    <input
                      type="checkbox"
                      checked={editingProfessional.isActive ?? editingProfessional.active ?? true}
                      onChange={(e) => setEditingProfessional({
                        ...editingProfessional,
                        active: e.target.checked,
                        isActive: e.target.checked
                      })}
                      className="w-4 h-4 rounded text-[#9E4760] focus:ring-[#9E4760]"
                    />
                    <span>Profissional Ativa para Receber Agendamentos</span>
                  </label>
                </div>
              </div>

              {/* Weekly Schedule Configuration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#351C26] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#9E4760]" />
                    <span>2. Jornada Semanal de Atendimento</span>
                  </h4>
                  <span className="text-[11px] text-[#8E6A77]">
                    Defina horários e intervalos de cada dia
                  </span>
                </div>

                <div className="space-y-2 border border-[#ECD1DA] rounded-2xl p-3 bg-white">
                  {DAYS_OF_WEEK.map((day) => {
                    const daySched = (editingProfessional.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE)[day.key] || {
                      enabled: false,
                      startTime: '09:00',
                      endTime: '19:00'
                    };

                    return (
                      <div
                        key={day.key}
                        className={`p-3 rounded-xl border transition-all ${
                          daySched.enabled
                            ? 'bg-[#FAF3F5] border-[#E8CCD5]'
                            : 'bg-gray-50/70 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-xs sm:text-sm text-[#351C26] min-w-[130px]">
                            <input
                              type="checkbox"
                              checked={daySched.enabled}
                              onChange={(e) => handleDayScheduleChange(day.key, 'enabled', e.target.checked)}
                              className="w-4 h-4 rounded text-[#9E4760] focus:ring-[#9E4760]"
                            />
                            <span>{day.label}</span>
                          </label>

                          {daySched.enabled ? (
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <span className="text-[#7A5A66] font-medium">Das</span>
                                <input
                                  type="time"
                                  value={daySched.startTime || '09:00'}
                                  onChange={(e) => handleDayScheduleChange(day.key, 'startTime', e.target.value)}
                                  className="p-1.5 rounded-lg border border-[#D9BCC7] bg-white text-xs"
                                />
                                <span className="text-[#7A5A66] font-medium">às</span>
                                <input
                                  type="time"
                                  value={daySched.endTime || '19:00'}
                                  onChange={(e) => handleDayScheduleChange(day.key, 'endTime', e.target.value)}
                                  className="p-1.5 rounded-lg border border-[#D9BCC7] bg-white text-xs"
                                />
                              </div>

                              <div className="flex items-center gap-1 sm:pl-2 sm:border-l border-[#ECD1DA]">
                                <Coffee className="w-3 h-3 text-[#9E4760]" title="Intervalo" />
                                <span className="text-[#7A5A66] font-medium">Intervalo:</span>
                                <input
                                  type="time"
                                  value={daySched.breakStart || '12:00'}
                                  onChange={(e) => handleDayScheduleChange(day.key, 'breakStart', e.target.value)}
                                  className="p-1.5 rounded-lg border border-[#D9BCC7] bg-white text-xs"
                                />
                                <span>-</span>
                                <input
                                  type="time"
                                  value={daySched.breakEnd || '13:00'}
                                  onChange={(e) => handleDayScheduleChange(day.key, 'breakEnd', e.target.value)}
                                  className="p-1.5 rounded-lg border border-[#D9BCC7] bg-white text-xs"
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 font-semibold italic">
                              Não atende neste dia (Folga semanal)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specific Date Exceptions & Blocks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#351C26] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarOff className="w-3.5 h-3.5 text-[#9E4760]" />
                    <span>3. Exceções, Folgas Especiais & Bloqueios</span>
                  </h4>
                  <span className="text-[11px] text-[#8E6A77]">
                    Feriados, consultas médicas ou cursos
                  </span>
                </div>

                {/* List of configured exceptions */}
                {(editingProfessional.exceptions || []).length > 0 ? (
                  <div className="space-y-2 border border-[#ECD1DA] rounded-2xl p-3 bg-white">
                    {(editingProfessional.exceptions || []).map((exc) => (
                      <div
                        key={exc.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FCF9F7] border border-[#ECD1DA] text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#351C26]">{exc.date}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              exc.type === 'day_off'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {exc.type === 'day_off' ? 'Folga Integral' : `Bloqueio: ${exc.startTime} às ${exc.endTime}`}
                            </span>
                          </div>
                          {exc.reason && (
                            <p className="text-[#7A5A66] text-[11px]">{exc.reason}</p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveException(exc.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Remover bloqueio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8E6A77] italic bg-[#FCF9F7] p-3 rounded-xl border border-[#ECD1DA]">
                    Nenhuma folga ou bloqueio excepcional programado para esta profissional.
                  </p>
                )}

                {/* Add new exception form */}
                <div className="bg-[#FAF3F5] p-3 rounded-2xl border border-[#ECD1DA] space-y-2">
                  <span className="font-bold text-[#351C26] text-xs flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5 text-[#9E4760]" />
                    Programar Nova Folga ou Bloqueio:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#543843] mb-0.5">Data</label>
                      <input
                        type="date"
                        value={newExceptionDate}
                        onChange={(e) => setNewExceptionDate(e.target.value)}
                        className="w-full p-2 rounded-xl border border-[#E2CDD6] bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#543843] mb-0.5">Tipo de Bloqueio</label>
                      <select
                        value={newExceptionType}
                        onChange={(e) => setNewExceptionType(e.target.value as any)}
                        className="w-full p-2 rounded-xl border border-[#E2CDD6] bg-white text-xs"
                      >
                        <option value="day_off">Folga Integral (Dia Todo)</option>
                        <option value="partial_block">Bloqueio Parcial de Horário</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#543843] mb-0.5">Motivo (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ex: Treinamento, Consulta"
                        value={newExceptionReason}
                        onChange={(e) => setNewExceptionReason(e.target.value)}
                        className="w-full p-2 rounded-xl border border-[#E2CDD6] bg-white text-xs"
                      />
                    </div>
                  </div>

                  {newExceptionType === 'partial_block' && (
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className="text-[#7A5A66] font-medium">Das</span>
                      <input
                        type="time"
                        value={newExceptionStartTime}
                        onChange={(e) => setNewExceptionStartTime(e.target.value)}
                        className="p-1.5 rounded-lg border border-[#D9BCC7] bg-white text-xs"
                      />
                      <span className="text-[#7A5A66] font-medium">às</span>
                      <input
                        type="time"
                        value={newExceptionEndTime}
                        onChange={(e) => setNewExceptionEndTime(e.target.value)}
                        className="p-1.5 rounded-lg border border-[#D9BCC7] bg-white text-xs"
                      />
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleAddException}
                      disabled={!newExceptionDate}
                      className="px-3.5 py-1.5 rounded-xl bg-[#9E4760] text-white text-xs font-bold hover:bg-[#85354C] transition-all cursor-pointer disabled:opacity-40"
                    >
                      + Incluir Bloqueio
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#F0E0E6]">
              <button
                type="button"
                onClick={() => setEditingProfessional(null)}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSaveProfessional(editingProfessional)}
                disabled={isSaving || !editingProfessional.name.trim() || !editingProfessional.role.trim()}
                className="px-5 py-2 rounded-xl bg-[#9E4760] text-white text-xs font-bold hover:bg-[#85354C] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSaving ? 'Salvando no Firestore...' : 'Salvar Profissional no Firestore'}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
