import React, { useEffect, useState } from 'react';
import { X, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { Service, ServiceOption } from '../types';

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
  const [selectedOption, setSelectedOption] =
    useState<ServiceOption | null>(null);

  useEffect(() => {
    if (!service) {
      setSelectedOption(null);
      return;
    }

    if (service.options && service.options.length > 0) {
      setSelectedOption(service.options[0]);
    } else {
      setSelectedOption(null);
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const hasOptions =
    Array.isArray(service.options) &&
    service.options.length > 0;

  const currentPrice =
    selectedOption?.price ?? service.price;

  const currentDuration =
    selectedOption?.durationFormatted ??
    service.durationFormatted;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(currentPrice);

  const handleBook = () => {
    /*
     * O serviço continua sendo enviado para o fluxo atual.
     *
     * A opção escolhida fica armazenada temporariamente
     * no objeto enviado para o próximo passo.
     */
    const serviceToBook: Service = {
      ...service,

      price: currentPrice,

      duration:
        selectedOption?.durationMinutes ??
        service.duration,

      durationMinutes:
        selectedOption?.durationMinutes ??
        service.durationMinutes,

      durationFormatted: currentDuration,

      highlights: selectedOption
        ? [
            ...(service.highlights || []).filter(
              (item) =>
                !item.toLowerCase().startsWith('r$') &&
                !item.toLowerCase().startsWith('a partir')
            ),
            `${selectedOption.name} — ${formattedPrice}`,
            `Tempo estimado: ${currentDuration}`,
          ]
        : service.highlights,
    };

    onBook(serviceToBook);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#2D1620]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-detail-title"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        id="service-detail-modal"
        className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-[#EFE2E7] shadow-2xl z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
      >
        {/* Botão fechar */}
        <button
          id="modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#351C26]/80 hover:bg-[#351C26] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="relative bg-gradient-to-br from-[#FAF0F3] via-white to-[#F7E7EC] px-6 sm:px-8 pt-8 pb-7 border-b border-[#EFE2E7]">
          <div className="pr-12">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#9E4760] text-white text-[11px] font-bold uppercase tracking-widest">
              Laura Luíza Beauty
            </span>

            <h2
              id="service-detail-title"
              className="font-serif text-3xl sm:text-4xl font-bold text-[#351C26] mt-4 tracking-tight"
            >
              {service.name}
            </h2>

            <p className="text-sm sm:text-base text-[#6B4E58] mt-3 leading-relaxed">
              {service.fullDescription || service.description}
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 sm:p-8 space-y-7">

          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#FAF1F4] border border-[#ECD3DC] p-4">
              <div className="flex items-center gap-2 text-[#9E4760] mb-1">
                <Clock className="w-4 h-4" />

                <span className="text-[11px] uppercase tracking-wider font-bold">
                  Duração
                </span>
              </div>

              <p className="font-semibold text-[#351C26]">
                {currentDuration}
              </p>
            </div>

            <div className="rounded-2xl bg-[#FAF1F4] border border-[#ECD3DC] p-4">
              <span className="block text-[11px] uppercase tracking-wider text-[#9E4760] font-bold mb-1">
                Investimento
              </span>

              <p className="font-serif text-xl font-bold text-[#351C26]">
                {formattedPrice}
              </p>
            </div>
          </div>

          {/* Escolha de opção */}
          {hasOptions && (
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#9E4760]">
                  Escolha uma opção
                </h3>

                <p className="text-sm text-[#7A5A66] mt-1">
                  Selecione a opção desejada para continuar.
                </p>
              </div>

              <div className="space-y-2.5">
                {service.options!.map((option, index) => {
                  const isSelected =
                    selectedOption?.name === option.name &&
                    selectedOption?.price === option.price;

                  return (
                    <button
                      key={`${option.name}-${index}`}
                      type="button"
                      onClick={() => setSelectedOption(option)}
                      className={`w-full text-left rounded-2xl border-2 p-4 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#9E4760] bg-[#FAF0F3] shadow-sm'
                          : 'border-[#EFE2E7] bg-white hover:border-[#DCA9BA] hover:bg-[#FCF8FA]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Radio */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                            isSelected
                              ? 'border-[#9E4760]'
                              : 'border-[#CDB4BD]'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#9E4760]" />
                          )}
                        </div>

                        {/* Nome */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold text-sm sm:text-base ${
                              isSelected
                                ? 'text-[#9E4760]'
                                : 'text-[#351C26]'
                            }`}
                          >
                            {option.name}
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-xs text-[#7A5A66]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {option.durationFormatted}
                            </span>
                          </div>
                        </div>

                        {/* Preço */}
                        <div className="text-right shrink-0">
                          <span className="block text-[10px] uppercase tracking-wider text-[#9E6C7C] font-semibold">
                            Valor
                          </span>

                          <span className="font-serif text-lg font-bold text-[#351C26]">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(option.price)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* O que está incluso */}
          {service.highlights &&
            service.highlights.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#9E4760]">
                  Informações do serviço
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {service.highlights.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-[#5C3F4B]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#9E4760] shrink-0 mt-0.5" />

                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Pagamento */}
          <div className="rounded-2xl bg-[#FCF9F7] border border-[#EFE2E7] p-4">
            <p className="text-xs text-[#8E6A77]">
              Pagamento presencial
            </p>

            <p className="text-sm font-semibold text-[#3D1E28] mt-1">
              Cartões de crédito, débito e Pix
            </p>
          </div>

          {/* Rodapé */}
          <div className="pt-4 border-t border-[#F0E0E6] flex flex-col sm:flex-row gap-3">
            <button
              id="modal-cancel-btn"
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-[#D9BAC5] text-[#7A4958] text-sm font-semibold hover:bg-[#FAF1F4] transition-colors cursor-pointer"
            >
              Voltar
            </button>

            <button
              id="modal-book-cta-btn"
              type="button"
              onClick={handleBook}
              className="w-full sm:flex-1 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#B54E6D] to-[#9E3D59] hover:from-[#9E3D59] hover:to-[#862D45] text-white text-sm font-bold shadow-lg shadow-[#9E4760]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />

              <span>
                Continuar para data e horário
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
