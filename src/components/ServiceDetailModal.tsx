import React from 'react';
import { X, Clock, Calendar, CheckCircle2, Sparkles, Shield, Heart } from 'lucide-react';
import { Service } from '../types';

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (service: Service) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onBook,
}) => {
  if (!isOpen || !service) return null;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(service.price);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D1620]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Background click overlay */}
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Modal Card */}
      <div 
        id="service-detail-modal"
        className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-[#EFE2E7] shadow-2xl z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          id="modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Hero Image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/10] w-full overflow-hidden bg-[#FAF0F3]">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md inline-block mb-1.5">
                Laura Luíza Beauty
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm">
                {service.name}
              </h2>
            </div>
            
            <div className="text-right">
              <span className="text-xs text-[#FDE7EC] block font-medium">Investimento</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {formattedPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Key Specs Bar */}
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-[#FAF1F4] border border-[#ECD3DC]">
            <div className="flex items-center gap-2 text-sm text-[#7A4B5B] font-medium">
              <Clock className="w-4 h-4 text-[#9E4760]" />
              <span>Duração: <strong className="text-[#3D1E28]">{service.durationFormatted}</strong></span>
            </div>
            <span className="text-[#D8BAC5]">•</span>
            <div className="flex items-center gap-2 text-sm text-[#7A4B5B] font-medium">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Produtos de Linha Exclusiva</span>
            </div>
            <span className="text-[#D8BAC5]">•</span>
            <div className="flex items-center gap-2 text-sm text-[#7A4B5B] font-medium">
              <Shield className="w-4 h-4 text-[#9E4760]" />
              <span>Garantia de Satisfação</span>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#9E4760]">
              Sobre o Procedimento
            </h4>
            <p className="text-sm sm:text-base text-[#523A44] leading-relaxed">
              {service.fullDescription || service.description}
            </p>
          </div>

          {/* Highlights Checklist */}
          {service.highlights && service.highlights.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#9E4760]">
                O que está incluso:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {service.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#5C3F4B]">
                    <CheckCircle2 className="w-4 h-4 text-[#9E4760] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-[#F0E0E6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs text-[#8E6A77]">Pagamento presencial ou parcelado</p>
              <p className="text-xs font-semibold text-[#3D1E28]">Cartões de Crédito, Débito e Pix</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="modal-cancel-btn"
                onClick={onClose}
                className="w-1/3 sm:w-auto px-5 py-3 rounded-2xl border border-[#D9BAC5] text-[#7A4958] text-sm font-semibold hover:bg-[#FAF1F4] transition-colors"
              >
                Voltar
              </button>

              <button
                id="modal-book-cta-btn"
                onClick={() => {
                  onBook(service);
                  onClose();
                }}
                className="w-2/3 sm:w-auto flex-1 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#B54E6D] to-[#9E3D59] hover:from-[#9E3D59] hover:to-[#862D45] text-white text-sm font-bold shadow-lg shadow-[#9E4760]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Calendar className="w-4 h-4 text-[#FDE7EC]" />
                <span>Agendar este serviço</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
