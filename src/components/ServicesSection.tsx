import React, { useState, useMemo } from 'react';
import { Sparkles, Search, SlidersHorizontal } from 'lucide-react';
import { Service } from '../types';
import { ServiceCard } from './ServiceCard';

interface ServicesSectionProps {
  services: Service[];
  onViewDetails: (service: Service) => void;
  onBookService: (service: Service) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onViewDetails,
  onBookService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'todos', label: 'Todos os Serviços' },
    { id: 'noiva', label: '👑 Dia da Noiva' },
    { id: 'pacotes', label: '✨ Pacotes & Combos' },
    { id: 'maquiagem', label: '💄 Maquiagem' },
    { id: 'cabelo', label: '💇‍♀️ Cabelos & Escovas' },
    { id: 'sobrancelha', label: '👁️ Sobrancelhas' },
    { id: 'pes', label: '🦶 Spa dos Pés' },
    { id: 'tratamento', label: '🧴 Tratamentos' },
  ];

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const isServiceActive = service.isActive ?? service.active ?? true;
      if (!isServiceActive) return false;
      const matchesCategory =
        selectedCategory === 'todos' || service.category === selectedCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <section id="services-section" className="py-16 sm:py-24 bg-[#FCF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0F3] border border-[#ECD1DA] text-[#9E4760] text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Menu de Cuidados
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#351C26] tracking-tight">
            Nossos Serviços Exclusivos
          </h2>

          <p className="text-base sm:text-lg text-[#6B4E58] font-normal leading-relaxed">
            Procedimentos realizados com técnicas refinadas, visagismo e produtos de alta tecnologia para elevar sua beleza natural.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`filter-category-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#9E4760] text-white shadow-md shadow-[#9E4760]/20'
                        : 'bg-white text-[#6B4E58] hover:text-[#9E4760] hover:bg-[#FAF0F3] border border-[#EFE2E7]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                id="search-services-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por procedimento..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E2CDD6] text-sm text-[#351C26] placeholder-[#9E7D8A] focus:outline-none focus:ring-2 focus:ring-[#9E4760]/30 focus:border-[#9E4760] transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-[#9E7D8A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

          </div>
        </div>

        {/* Services Grid (1 col on mobile, 2 col on tablet, 3 on desktop) */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onViewDetails={onViewDetails}
                onBookService={onBookService}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EFE2E7] p-8 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#FAF0F3] text-[#9E4760] flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#351C26] mb-2">
              Nenhum serviço encontrado
            </h3>
            <p className="text-sm text-[#7A5A66] mb-4">
              Não encontramos resultados para a busca "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
              }}
              className="px-4 py-2 rounded-xl bg-[#FAF0F3] text-[#9E4760] text-xs font-bold hover:bg-[#F3DEE5] transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
