import React from 'react';
import { Home, Scissors, Calendar, Clock, User, ShieldCheck } from 'lucide-react';
import { AppView } from '../types';

interface MobileNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  appointmentsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onNavigate,
  appointmentsCount,
}) => {
  const items: { id: AppView; label: string; icon: React.ReactNode; isCta?: boolean }[] = [
    { id: 'home', label: 'Início', icon: <Home className="w-5 h-5" /> },
    { id: 'services', label: 'Serviços', icon: <Scissors className="w-5 h-5" /> },
    { id: 'booking', label: 'Agendar', icon: <Calendar className="w-5 h-5" />, isCta: true },
    { id: 'appointments', label: 'Agendamentos', icon: <Clock className="w-5 h-5" /> },
    { id: 'auth', label: 'Perfil', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-safe pt-1 bg-[#FCF9F7]/95 backdrop-blur-lg border-t border-[#F0E2E7] shadow-[0_-4px_20px_rgba(158,71,96,0.08)]">
      <div className="max-w-md mx-auto flex items-center justify-around py-1.5">
        {items.map((item) => {
          const isActive = currentView === item.id;
          
          if (item.isCta) {
            return (
              <button
                key={item.id}
                id={`mobile-bottom-nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#9E3D59] to-[#D47B95] text-white flex items-center justify-center shadow-lg shadow-[#9E4760]/35 ring-4 ring-[#FCF9F7] active:scale-95 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-[#9E4760] mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`mobile-bottom-nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[58px] min-h-[48px] ${
                isActive ? 'text-[#9E4760]' : 'text-[#8A6774] hover:text-[#9E4760]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.id === 'appointments' && appointmentsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#9E4760] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {appointmentsCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E4760] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
