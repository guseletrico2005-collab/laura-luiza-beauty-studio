import React from 'react';
import { Calendar, ArrowRight, Sparkles, Star, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { SalonInfo } from '../types';

interface HeroProps {
  salonInfo: SalonInfo;
  onBookClick: () => void;
  onServicesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  salonInfo,
  onBookClick,
  onServicesClick,
}) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-gradient-to-b from-[#FCF9F7] via-[#FAF3F5] to-[#FCF9F7]">
      {/* Subtle organic background glow circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#F7DCE3]/50 to-[#F5E8D3]/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FBE7EC]/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Presentation & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Elegant Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EAD3DC] shadow-xs text-[#9E4760] text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Experiência Exclusiva de Salão</span>
            </div>

            {/* Main Title & Slogan */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#331822] leading-[1.12]">
                Laura Luíza <span className="text-[#9E4760] italic font-normal">Beauty</span>
              </h1>
              <p className="font-serif text-xl sm:text-2xl text-[#844F60] font-normal italic tracking-wide">
                {salonInfo.slogan}
              </p>
            </div>

            {/* Short Presentation Text */}
            <p className="text-base sm:text-lg text-[#614751] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Um refúgio de sofisticação criado para realçar sua essência única. Oferecemos pacotes exclusivos, Dia da Noiva, maquiagem de alta definição, tratamentos capilares de precisão, visagismo e rituais de spa com produtos de padrão internacional.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-book-btn"
                onClick={onBookClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#B54E6D] via-[#9E3D59] to-[#862D45] text-white text-base font-semibold shadow-lg shadow-[#9E4760]/25 hover:shadow-xl hover:shadow-[#9E4760]/35 transition-all transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Calendar className="w-5 h-5 text-[#FAD5DF]" />
                <span>Agendar horário</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-services-btn"
                onClick={onServicesClick}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-[#FAF1F4] border border-[#E0CBD4] text-[#7A4958] hover:text-[#9E4760] text-base font-semibold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Conheça nossos serviços</span>
              </button>
            </div>

            {/* Trust Highlights Grid */}
            <div className="pt-6 border-t border-[#F0E0E6] grid grid-cols-3 gap-3 sm:gap-6 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0F3] border border-[#ECD1DA] text-[#9E4760] flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#3D1E28]">4.9 / 5.0</p>
                  <p className="text-[10px] sm:text-xs text-[#8A6774]">+500 clientes</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0F3] border border-[#ECD1DA] text-[#9E4760] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-[#9E4760]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#3D1E28]">Produtos</p>
                  <p className="text-[10px] sm:text-xs text-[#8A6774]">Linha Premium</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0F3] border border-[#ECD1DA] text-[#9E4760] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#9E4760]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#3D1E28]">Ambiente</p>
                  <p className="text-[10px] sm:text-xs text-[#8A6774]">Acolhedor & Vip</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Showcase Image with Floating Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative border frame */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#E8A7B8] via-[#F4E1D2] to-[#9E4760] opacity-40 blur-sm transform -rotate-1" />
              
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-[#FAF0F3]">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop"
                  alt="Laura Luíza Beauty - Salão de Beleza"
                  className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A131C]/60 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
                    <p className="text-xs text-[#FDE7EC] uppercase tracking-wider font-semibold">Destaque da Temporada</p>
                    <p className="font-serif text-lg font-bold">Dia da Noiva & Pacotes Glow</p>
                    <p className="text-xs text-white/90">Agende online em menos de 1 minuto</p>
                  </div>
                </div>
              </div>

              {/* Floating review card top right */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#F0DCE3] flex items-center gap-3 animate-bounce-subtle">
                <div className="w-10 h-10 rounded-full bg-[#FAF0F3] flex items-center justify-center text-[#9E4760]">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-[#3D1E28] mt-0.5">Atendimento 5 Estrelas</p>
                </div>
              </div>

              {/* Floating fast booking tag bottom left */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md py-2.5 px-4 rounded-2xl shadow-xl border border-[#F0DCE3] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-semibold text-[#3D1E28]">
                  Horários abertos para esta semana
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
