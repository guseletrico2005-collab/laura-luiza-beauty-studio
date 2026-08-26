import React from 'react';
import { Star, Quote, Sparkles, Heart } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FCF9F7] relative overflow-hidden">
      
      {/* Subtle decorative background gradient circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#FAF0F3]/80 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#FAF0F3]/80 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAD3DC] text-[#9E4760] text-xs font-bold tracking-widest uppercase shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-[#9E4760]" />
            Experiências Reais
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#351C26]">
            O que Nossas Clientes Dizem
          </h2>
          
          <p className="text-sm sm:text-base text-[#6B4E58]">
            Mais de 1.200 transformações realizadas com carinho, técnica apurada e dedicação máxima ao bem-estar.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE2E7] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div className="absolute top-6 right-6 text-[#F0D5DE] group-hover:text-[#9E4760]/20 transition-colors">
                <Quote className="w-8 h-8" />
              </div>

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]"
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm sm:text-base text-[#4E3740] italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-[#F5E8ED]">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#9E4760] to-[#D47B95] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#351C26]">
                    {t.name}
                  </h4>
                  <p className="text-xs text-[#9E4760] font-medium">
                    {t.service}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-[#FAF0F3] via-white to-[#FAF0F3] border border-[#ECD1DA] flex flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#9E4760] block">
              4.9 / 5.0
            </span>
            <span className="text-xs text-[#7A5A66]">Avaliação no Google (380+ notas)</span>
          </div>

          <div className="hidden sm:block w-px h-8 bg-[#ECD1DA]" />

          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#351C26] block">
              100%
            </span>
            <span className="text-xs text-[#7A5A66]">Produtos Originais e Hipoalergênicos</span>
          </div>

          <div className="hidden sm:block w-px h-8 bg-[#ECD1DA]" />

          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#D4AF37] block">
              10+ Anos
            </span>
            <span className="text-xs text-[#7A5A66]">De Excelência em Estética Capilar</span>
          </div>
        </div>

      </div>
    </section>
  );
};
