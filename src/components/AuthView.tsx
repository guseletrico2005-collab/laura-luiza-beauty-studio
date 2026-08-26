import React from 'react';
import { Phone, User, LogOut, CheckCircle2, ShieldCheck, Sparkles, Calendar, Heart } from 'lucide-react';
import { logOut } from '../firebase';

interface AuthViewProps {
  currentUser: { 
    name: string; 
    email?: string; 
    phone?: string; 
    photoURL?: string; 
    uid?: string;
    role?: 'client' | 'admin';
  } | null;
  onLoginSuccess: (name: string, email: string) => void;
  onNavigateHome: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  currentUser,
  onLoginSuccess,
  onNavigateHome,
}) => {
  const handleSignOut = async () => {
    try {
      await logOut();
      onLoginSuccess('', '');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-[#FAF3F5] to-[#FCF9F7] min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        
        {currentUser ? (
          <div className="bg-white rounded-3xl border border-[#EFE2E7] shadow-xl p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FAF0F3] border-2 border-[#9E4760] text-[#9E4760] flex items-center justify-center mx-auto text-2xl font-bold font-serif overflow-hidden shadow-sm">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cliente Autenticado</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#351C26] mt-2">
                Olá, {currentUser.name}!
              </h2>
              {currentUser.phone && (
                <div className="inline-flex items-center gap-1 text-xs text-[#7A5A66] bg-[#FCF9F7] px-3 py-1 rounded-full border border-[#EFE2E7]">
                  <Phone className="w-3 h-3 text-[#9E4760]" />
                  <span>{currentUser.phone}</span>
                </div>
              )}
              {currentUser.email && (
                <p className="text-xs text-[#7A5A66]">{currentUser.email}</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#FCF9F7] border border-[#EFE2E7] text-left space-y-2 text-xs">
              <p className="font-semibold text-[#351C26] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#9E4760]" />
                <span>Benefícios de sua identificação:</span>
              </p>
              <ul className="space-y-1.5 text-[#664B55] pl-1">
                <li>✓ Agendamentos confirmados e protegidos em seu nome</li>
                <li>✓ Notificações e lembretes por WhatsApp</li>
                <li>✓ Cancelamento e remarcação rápida em 1 clique</li>
                <li>✓ Histórico exclusivo salvo no Firebase</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#B54E6D] to-[#9E3D59] hover:from-[#9E3D59] hover:to-[#832D45] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#9E4760]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Calendar className="w-4 h-4" />
                <span>Ir para Início & Agendamentos</span>
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 rounded-2xl border border-[#E2CDD6] text-xs font-semibold text-[#8E5A6B] hover:bg-[#FAF0F3] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair / Trocar Telefone</span>
              </button>
            </div>
          </div>
        ) : null}

      </div>
    </section>
  );
};
