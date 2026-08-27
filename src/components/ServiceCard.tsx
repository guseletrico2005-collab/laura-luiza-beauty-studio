import React from 'react';
import { Clock, Eye, Calendar } from 'lucide-react';
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

  return (
    <div
      id={`service-card-${service.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-[#EFE2E7] hover:border-[#DCA9BA] shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Imagem */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF0F3]">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#9E4760]">
            <span className="text-sm">Laura Luíza Beauty</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{service.durationFormatted}</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 sm:p-6">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#351C26] group-hover:text-[#9E4760] transition-colors">
          {service.name}
        </h3>

        <p className="mt-2 text-sm text-[#664C56] line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Preço */}
        <div className="mt-5 pt-4 border-t border-[#F5E8ED]">
          <span className="block text-[11px] uppercase tracking-wider text-[#9E6C7C] font-semibold">
            Valor
          </span>

          <span className="font-serif text-2xl font-bold text-[#351C26]">
            {formattedPrice}
          </span>
        </div>

        {/* Botões */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            id={`service-details-btn-${service.id}`}
            onClick={() => onViewDetails(service)}
            className="py-3 px-3 rounded-2xl bg-[#FCF9F7] hover:bg-[#F8EBF0] text-[#7A4B5B] hover:text-[#9E4760] border border-[#E8D4DC] text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Ver detalhes
          </button>

          <button
            id={`service-book-btn-${service.id}`}
            onClick={() => onBookService(service)}
            className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#B54E6D] to-[#9E3D59] hover:from-[#9E3D59] hover:to-[#862D45] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Agendar
          </button>
        </div>
      </div>
    </div>
  );
};
