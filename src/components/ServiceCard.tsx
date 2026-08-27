/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Calendar, ChevronRight, Sparkles } from 'lucide-react';
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
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);

  const hasOptions = service.options && service.options.length > 0;

  const lowestPrice = hasOptions
    ? Math.min(...service.options!.map((option) => option.price))
    : service.price;

  return (
    <div
      id={`service-card-${service.id}`}
      className="group relative bg-white rounded-[28px] border border-[#EFE2E7] shadow-sm hover:shadow-xl hover:border-[#DCA9BA] transition-all duration-300 overflow-hidden"
    >
      {/* Detalhe decorativo superior */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#D9A0B2] via-[#B54E6D] to-[#D4AF37]" />

      <div className="p-5 sm:p-6">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full bg-[#FAF0F3] border border-[#ECD3DC] text-[#9E4760] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              Laura Luíza Beauty
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#351C26] group-hover:text-[#9E4760] transition-colors">
              {service.name}
            </h3>

            <p className="mt-2 text-sm text-[#664C56] leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        {/* Informações principais */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {/* Duração */}
          <div className="rounded-2xl bg-[#FCF9F7] border border-[#F0E0E6] p-3">
            <div className="flex items-center gap-2 text-[#9E4760] mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-wider font-bold">
                Duração
              </span>
            </div>

            <p className="text-sm font-semibold text-[#351C26]">
              {service.durationFormatted}
            </p>
          </div>

          {/* Valor */}
          <div className="rounded-2xl bg-[#FCF9F7] border border-[#F0E0E6] p-3">
            <span className="block text-[10px] uppercase tracking-wider text-[#9E6C7C] font-bold mb-1">
              {hasOptions ? 'A partir de' : 'Valor'}
            </span>

            <p className="font-serif text-lg font-bold text-[#351C26]">
              {formatPrice(lowestPrice)}
            </p>
          </div>
        </div>

        {/* Opções de preço */}
        {hasOptions && (
          <div className="mt-4 rounded-2xl bg-[#FAF1F4] border border-[#ECD3DC] p-4">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#9E4760] mb-3">
              Opções disponíveis
            </p>

            <div className="space-y-2">
              {service.options!.slice(0, 4).map((option) => (
                <div
                  key={`${service.id}-${option.name}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-2 text-[#5C3F4B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B54E6D]" />
                    <span>{option.name}</span>
                  </div>

                  <span className="font-semibold text-[#351C26] whitespace-nowrap">
                    {formatPrice(option.price)}
                  </span>
                </div>
              ))}
            </div>

            {service.options!.length > 4 && (
              <p className="mt-3 text-xs text-[#8E6A77]">
                + outras opções disponíveis
              </p>
            )}
          </div>
        )}

        {/* Destaques */}
        {!hasOptions &&
          service.highlights &&
          service.highlights.length > 0 && (
            <div className="mt-4 space-y-1.5">
              {service.highlights.slice(0, 3).map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-xs text-[#664C56]"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}

        {/* Ações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <button
            id={`service-details-btn-${service.id}`}
            onClick={() => onViewDetails(service)}
            className="py-3.5 px-4 rounded-2xl bg-[#FCF9F7] hover:bg-[#F8EBF0] text-[#7A4B5B] hover:text-[#9E4760] border border-[#E8D4DC] text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>Ver opções e detalhes</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            id={`service-book-btn-${service.id}`}
            onClick={() => onBookService(service)}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#B54E6D] to-[#9E3D59] hover:from-[#9E3D59] hover:to-[#862D45] text-white text-sm font-bold shadow-md shadow-[#9E4760]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
