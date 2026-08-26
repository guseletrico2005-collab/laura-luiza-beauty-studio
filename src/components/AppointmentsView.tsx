import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  User, 
  Scissors, 
  XCircle, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Phone, 
  Share2, 
  MapPin,
  Sparkles,
  LogIn,
  ShieldCheck
} from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentsViewProps {
  appointments: Appointment[];
  currentUser: { name?: string; email?: string; phone?: string; uid?: string; role?: 'client' | 'admin' } | null;
  onCancelAppointment: (appointment: Appointment) => void;
  onBookNew: () => void;
  onOpenAuthModal?: () => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  currentUser,
  onCancelAppointment,
  onBookNew,
  onOpenAuthModal,
}) => {
  const [cancelingAppointment, setCancelingAppointment] = useState<Appointment | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleCancel = (appointment: Appointment) => {
    onCancelAppointment(appointment);
    setCancelingAppointment(null);
    setSuccessToast('Agendamento cancelado e horário liberado com sucesso.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmado':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          label: 'Confirmado'
        };
      case 'Cancelado':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: 'Cancelado'
        };
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: status
        };
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FCF9F7] min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0E0E6] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9E4760] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Área do Cliente</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#351C26]">
              Meus Agendamentos
            </h1>
            <p className="text-xs sm:text-sm text-[#7A5A66] mt-1">
              {currentUser ? (
                <span className="flex items-center gap-1.5 text-[#9E4760] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Sessão conectada: {currentUser.email}
                </span>
              ) : (
                <span>Acompanhe suas reservas, horários confirmados e detalhes dos seus procedimentos.</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {!currentUser && onOpenAuthModal && (
              <button
                type="button"
                id="appointments-login-sync-btn"
                onClick={onOpenAuthModal}
                className="px-4 py-3 rounded-2xl border border-[#E2CDD6] bg-white hover:bg-[#FAF0F3] text-xs font-bold text-[#7A4B5B] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#9E4760]" />
                <span>Entrar com Google</span>
              </button>
            )}

            <button
              id="book-another-appointment-btn"
              onClick={onBookNew}
              className="self-start sm:self-center px-5 py-3 rounded-2xl bg-[#9E4760] hover:bg-[#85354C] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#9E4760]/20 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Agendamento</span>
            </button>
          </div>
        </div>

        {/* Success Toast notification */}
        {successToast && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-xs font-bold">✕</button>
          </div>
        )}

        {/* Appointments List */}
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((apt) => {
              const badge = getStatusBadge(apt.status);
              const isCanceled = apt.status === 'Cancelado';

              return (
                <div
                  key={apt.id}
                  id={`appointment-card-${apt.id}`}
                  className={`bg-white rounded-3xl border overflow-hidden transition-all duration-200 p-5 sm:p-6 shadow-xs hover:shadow-md ${
                    isCanceled ? 'border-gray-200 opacity-60' : 'border-[#EFE2E7]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Left: Service Image + Info */}
                    <div className="flex items-start sm:items-center gap-4">
                      <img
                        src={apt.serviceImage}
                        alt={apt.serviceName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-[#ECD1DA] shrink-0"
                      />
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#351C26]">
                            {apt.serviceName}
                          </h3>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.icon}
                            <span>{badge.label}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#7A5A66]">
                          <span className="flex items-center gap-1 font-semibold text-[#9E4760]">
                            <Calendar className="w-3.5 h-3.5" />
                            {apt.dateFormatted}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-[#351C26]">
                            <Clock className="w-3.5 h-3.5" />
                            {apt.time}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {apt.professional}
                          </span>
                        </div>

                        <div className="text-xs text-[#8E6A77] pt-1">
                          Valor: <strong className="text-[#351C26] font-bold">R$ {apt.price.toFixed(2).replace('.', ',')}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center sm:flex-col justify-end gap-2 border-t sm:border-t-0 border-[#F5E8ED] pt-3 sm:pt-0">
                      {!isCanceled && (
                        <button
                          id={`cancel-appointment-btn-${apt.id}`}
                          onClick={() => setCancelingAppointment(apt)}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-[#F2CCD6] text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancelar agendamento</span>
                        </button>
                      )}

                      <a
                        href={`https://wa.me/5511999998888?text=Ol%C3%A1!%20Preciso%20de%20informa%C3%A7%C3%B5es%20sobre%20meu%20agendamento%20de%20${encodeURIComponent(apt.serviceName)}%20no%20dia%20${apt.dateFormatted}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#FAF0F3] text-[#7A4B5B] hover:text-[#9E4760] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#9E4760]" />
                        <span>Falar com Salão</span>
                      </a>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EFE2E7] p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF0F3] text-[#9E4760] flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#351C26]">
              Nenhum agendamento ativo
            </h3>
            <p className="text-xs sm:text-sm text-[#7A5A66] max-w-sm mx-auto">
              Você ainda não possui horários marcados. Que tal reservar um momento especial para você hoje?
            </p>
            <button
              onClick={onBookNew}
              className="px-6 py-3 rounded-2xl bg-[#9E4760] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#9E4760]/20 hover:bg-[#85354C] transition-all"
            >
              Agendar Meu Primeiro Horário
            </button>
          </div>
        )}

        {/* Location & Studio Card Banner */}
        <div className="bg-[#FAF0F3] rounded-3xl p-6 border border-[#ECD1DA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#9E4760] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#351C26]">Laura Luíza Beauty</p>
              <p className="text-xs text-[#7A5A66]">Av. Paulista, 1842 - Jardins • São Paulo</p>
            </div>
          </div>

          <span className="text-xs text-[#9E4760] font-semibold">
            Chegue com 10 min de antecedência
          </span>
        </div>

      </div>

      {/* Cancel Confirmation Dialog */}
      {cancelingAppointment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 border border-[#EFE2E7] shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#351C26]">
              Cancelar este agendamento?
            </h4>
            <p className="text-xs text-[#7A5A66]">
              O horário das <strong>{cancelingAppointment.time}</strong> no dia <strong>{cancelingAppointment.dateFormatted}</strong> será liberado para outros clientes. Deseja realmente cancelar?
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelingAppointment(null)}
                className="py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
              >
                Não, manter
              </button>
              <button
                type="button"
                id="confirm-cancel-dialog-btn"
                onClick={() => handleCancel(cancelingAppointment)}
                className="py-2.5 px-4 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
              >
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
