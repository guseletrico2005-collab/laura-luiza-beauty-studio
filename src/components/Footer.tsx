import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Heart, 
  ArrowUpRight 
} from 'lucide-react';
import { SalonInfo } from '../types';

interface FooterProps {
  salonInfo: SalonInfo;
  onNavigateBooking: () => void;
  onNavigateServices: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  salonInfo,
  onNavigateBooking,
  onNavigateServices,
}) => {
  return (
    <footer className="bg-[#2D1620] text-white pt-16 pb-12 border-t border-[#452230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top CTA Banner */}
        <div className="bg-gradient-to-r from-[#9E4760] via-[#B54E6D] to-[#9E4760] rounded-3xl p-8 sm:p-12 mb-16 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Pronta para realçar sua melhor versão?
            </h3>
            <p className="text-sm sm:text-base text-[#FDE7EC] max-w-xl">
              Agende seu horário online em poucos cliques e garanta um atendimento exclusivo com nossas especialistas.
            </p>
          </div>

          <button
            onClick={onNavigateBooking}
            id="footer-cta-book-btn"
            className="px-8 py-4 rounded-2xl bg-white text-[#9E4760] font-bold text-sm sm:text-base shadow-lg hover:bg-[#FAF0F3] transition-all shrink-0 flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Agendar meu momento</span>
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Column Footer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#4A2635]">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B54E6D] to-[#9E4760] text-white flex items-center justify-center font-serif text-base font-bold shadow-md">
                LLB
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Laura Luíza Beauty
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#D8BAC5] leading-relaxed">
              {salonInfo.tagline}. Um espaço pensado nos mínimos detalhes para proporcionar conforto, estética de alto padrão e bem-estar.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#B54E6D] transition-colors flex items-center justify-center text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/5511999998888`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#25D366] transition-colors flex items-center justify-center text-white"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#F3D794]">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#D8BAC5]">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-white transition-colors"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateServices}
                  className="hover:text-white transition-colors"
                >
                  Catálogo de Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateBooking}
                  className="hover:text-white transition-colors"
                >
                  Agendamento Online
                </button>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Tabela de Preços
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Políticas de Cancelamento
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours & Address */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#F3D794]">
              Horário de Atendimento
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-[#D8BAC5]">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#B54E6D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Terça a Sábado</p>
                  <p>09:00 às 19:00</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-[#8E6A77] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-400">Domingo e Segunda</p>
                  <p className="text-gray-400">Fechado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Map */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#F3D794]">
              Localização & Contato
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-[#D8BAC5]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#B54E6D] shrink-0 mt-0.5" />
                <span>{salonInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B54E6D] shrink-0" />
                <span>{salonInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B54E6D] shrink-0" />
                <span>{salonInfo.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A88291]">
          <p>© {new Date().getFullYear()} Laura Luíza Beauty. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Desenvolvido com</span>
            <Heart className="w-3.5 h-3.5 fill-[#B54E6D] text-[#B54E6D]" />
            <span>para realçar sua beleza</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
