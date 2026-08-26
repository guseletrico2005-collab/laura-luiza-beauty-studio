import React from 'react';
import { Clock, Eye, Calendar, Sparkles } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onViewDetails: (service: Service) => void;
  onBookService: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onViewDetails,
  onBookService,
}) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(service.price);

  const getCategoryBadge = (category: Service['category']) => {
    switch (category) {
      case 'noiva':
        return { label: '👑 Dia da Noiva', bg: 'bg-[#FFF8E7] border border-[#F0D597]', text: 'text-[#996515]' };
      case 'pacotes':
        return { label: '✨ Pacote Exclusivo', bg: 'bg-[#F4EEFB] border border-[#DFC8F7]', text: 'text-[#7B3FA2]' };
      case 'maquiagem':
        return { label: '💄 Maquiagem', bg: 'bg-[#FDF2F4] border border-[#F7CCD5]', text: 'text-[#C22858]' };
      case 'cabelo':
        return { label: '💇‍♀️ Cabelo & Escova', bg: 'bg-[#FAF0F3] border border-[#ECD1DA]', text: 'text-[#9E4760]' };
      case 'sobrancelha':
        return { label: '👁️ Sobrancelha & Olhar', bg: 'bg-[#F9F4EB] border border-[#EADBBD]', text: 'text-[#966826]' };
      case 'pes':
        return { label: '🦶 Spa dos Pés', bg: 'bg-[#F2F7F4] border border-[#CCE2D4]', text: 'text-[#2D6646]' };
      case 'tratamento':
        return { label: '🧴 Tratamento VIP', bg: 'bg-[#FAF0F3] border border-[#ECD1DA]', text: 'text-[#9E4760]' };
      default:
        return { label: 'Especial', bg: 'bg-[#FAF0F3] border border-[#ECD1DA]', text: 'text-[#9E4760]' };
    }
  };

  const badge = getCategoryBadge(service.category);

  return (
    <div 
      id={`service-card-${service.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-[#EFE2E7] hover:border-[#DCA9BA] shadow-sm hover:shadow-xl hover:shadow-[#9E4760]/10 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Image Container with Badges */}
      <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-[#FAF0F3]">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        
        {/* Subtle top gradient shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-xs ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
          {(service.popular || service.isPopular) && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D4AF37] text-white shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Mais pedido
            </span>
          )}
        </div>

        {/* Bottom image overlay duration info */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium">
          <Clock className="w-3.5 h-3.5 text-[#FAD5DF]" />
          <span>{service.durationFormatted}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#351C26] group-hover:text-[#9E4760] transition-colors leading-tight">
              {service.name}
            </h3>
          </div>

          <p className="text-sm text-[#664C56] line-clamp-2 leading-relaxed font-normal">
            {service.description}
          </p>
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 border-t border-[#F5E8ED] space-y-3.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#9E6C7C] font-semibold block">
                Investimento
              </span>
              <span className="font-serif text-2xl font-bold text-[#351C26]">
                {formattedPrice}
              </span>
            </div>
            <span className="text-xs text-[#8E6976] bg-[#FAF1F4] px-2.5 py-1 rounded-lg">
              Em até 3x sem juros
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id={`service-details-btn-${service.id}`}
              onClick={() => onViewDetails(service)}
              className="w-full py-3 px-3 rounded-2xl bg-[#FCF9F7] hover:bg-[#F8EBF0] text-[#7A4B5B] hover:text-[#9E4760] border border-[#E8D4DC] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Ver detalhes</span>
            </button>

            <button
              id={`service-book-btn-${service.id}`}
              onClick={() => onBookService(service)}
              className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-[#B54E6D] to-[#9E3D59] hover:from-[#9E3D59] hover:to-[#862D45] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md hover:shadow-[#9E4760]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Calendar className="w-4 h-4 text-[#FDE7EC]" />
              <span>Agendar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
