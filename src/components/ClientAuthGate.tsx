import React, { useState } from 'react';
import { 
  Sparkles, 
  Phone, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Lock, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { 
  formatPhoneMask, 
  validateBrazilianPhone,
  signInClientWithGoogle,
  saveClientUserProfile
} from '../services/firestoreService';
import { User as FirebaseUser } from 'firebase/auth';
import { AdminLoginModal } from './AdminLoginModal';
import { SALON_INFO } from '../data/mockData';

interface ClientAuthGateProps {
  onAuthenticated: (user: FirebaseUser) => void;
}

export const ClientAuthGate: React.FC<ClientAuthGateProps> = ({
  onAuthenticated
}) => {
  const [step, setStep] = useState<'welcome' | 'complete_profile'>('welcome');
  const [authenticatedUser, setAuthenticatedUser] = useState<FirebaseUser | null>(null);
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Handle Google Login Click
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const { user, profile, needsProfileCompletion } = await signInClientWithGoogle();
      
      if (needsProfileCompletion) {
        setAuthenticatedUser(user);
        setFullName(profile?.name || user.displayName || '');
        setPhone(profile?.phone || '');
        setStep('complete_profile');
        setLoading(false);
      } else {
        // User already has complete profile -> enter immediately
        onAuthenticated(user);
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('A janela de login com o Google foi fechada antes de concluir.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('A janela popup foi bloqueada pelo navegador. Permita popups para este site e tente novamente.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        // user clicked multiple times, ignore
      } else if (err?.code === 'auth/network-request-failed') {
        setErrorMsg('Falha de conexão com a internet. Verifique sua rede e tente novamente.');
      } else {
        setErrorMsg(err?.message || 'Não foi possível realizar o login com Google. Tente novamente.');
      }
      setLoading(false);
    }
  };

  // Handle Phone Mask change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneMask(e.target.value);
    setPhone(formatted);
    if (errorMsg) setErrorMsg(null);
  };

  // Handle Profile Completion Save
  const handleCompleteProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = fullName.trim();
    if (!cleanName || cleanName.length < 3) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }

    if (!validateBrazilianPhone(phone)) {
      setErrorMsg('Por favor, informe um número de celular válido com DDD (ex: (11) 98765-4321).');
      return;
    }

    if (!authenticatedUser) {
      setErrorMsg('Sessão expirada. Por favor, faça login com o Google novamente.');
      setStep('welcome');
      return;
    }

    setLoading(true);

    try {
      await saveClientUserProfile(authenticatedUser.uid, {
        name: cleanName,
        phone: phone.trim(),
        email: authenticatedUser.email || undefined,
        photoURL: authenticatedUser.photoURL || undefined
      });

      onAuthenticated(authenticatedUser);
    } catch (err: any) {
      console.error('Error saving client profile:', err);
      setErrorMsg('Falha ao salvar seus dados. Verifique a conexão e tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FAF3F5] via-[#FCF9F7] to-[#F5EBEF] flex flex-col justify-between items-center px-4 py-8 sm:py-12 relative overflow-hidden font-sans">
      
      {/* Background soft ambient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#9E4760]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#E8A7B8]/20 blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <div className="text-center space-y-2 max-w-sm sm:max-w-md mx-auto z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#9E4760] via-[#B54E6D] to-[#E8A7B8] p-1 shadow-lg shadow-[#9E4760]/20 mx-auto flex items-center justify-center">
          <div className="w-full h-full bg-[#FCF9F7] rounded-full flex items-center justify-center text-[#9E4760]">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
          </div>
        </div>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#3D1E28]">
            Laura Luíza Beauty
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#9E4760] font-semibold mt-1">
            Studio & Estética Exclusiva
          </p>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white rounded-3xl sm:rounded-4xl border border-[#EFE2E7] shadow-xl p-6 sm:p-8 space-y-6 my-6 z-10 transition-all">
        
        {/* Card Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F3] text-[#9E4760] text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-[#9E4760]" />
            <span>Acesso Exclusivo para Clientes</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#351C26]">
            {step === 'welcome' ? 'Bem-vinda ao nosso Studio' : 'Quase lá! Complete seu cadastro'}
          </h2>
          <p className="text-xs text-[#7A5A66] leading-relaxed">
            {step === 'welcome'
              ? 'Entre para acessar a agenda, catálogo de serviços e agendar seu horário.'
              : 'Informe seu WhatsApp com DDD para receber lembretes e confirmações de horários.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1 leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1 leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Google Login Button */}
        {step === 'welcome' && (
          <div className="space-y-4 pt-1">
            <button
              type="button"
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#E2CDD6] hover:border-[#9E4760] bg-white hover:bg-[#FAF0F3]/50 text-[#351C26] text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#9E4760]" />
                  <span>Conectando com o Google...</span>
                </>
              ) : (
                <>
                  {/* Google G Logo SVG */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continuar com Google</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-[#8E6A77] text-center leading-relaxed px-2">
              Acesso rápido e seguro com sua conta Google. Sem necessidade de senhas ou códigos.
            </p>
          </div>
        )}

        {/* STEP 2: Profile Completion Form */}
        {step === 'complete_profile' && (
          <form onSubmit={handleCompleteProfileSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label htmlFor="client-name-input" className="block text-xs font-semibold text-[#543843] mb-1.5">
                Seu Nome Completo
              </label>
              <div className="relative">
                <input
                  id="client-name-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Ex: Camila Silva Mendonça"
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#FCF9F7] border border-[#E2CDD6] text-sm text-[#351C26] placeholder-[#9E7D8A] focus:outline-none focus:ring-2 focus:ring-[#9E4760]/30 focus:border-[#9E4760] transition-all"
                />
                <User className="w-4 h-4 text-[#9E7D8A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Phone / WhatsApp */}
            <div>
              <label htmlFor="client-phone-input" className="block text-xs font-semibold text-[#543843] mb-1.5">
                Celular / WhatsApp com DDD
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-[#664B55] border-r border-[#E2CDD6] pr-2">
                  <span>🇧🇷</span>
                  <span>+55</span>
                </div>
                <input
                  id="client-phone-input"
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 98765-4321"
                  maxLength={15}
                  className="w-full pl-22 pr-3.5 py-3 rounded-2xl bg-[#FCF9F7] border border-[#E2CDD6] text-sm text-[#351C26] placeholder-[#9E7D8A] focus:outline-none focus:ring-2 focus:ring-[#9E4760]/30 focus:border-[#9E4760] transition-all"
                />
              </div>
              <p className="text-[11px] text-[#8E6A77] mt-1 pl-1">
                Utilizado apenas para avisos e confirmações de seus horários.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="complete-profile-btn"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#B54E6D] to-[#9E3D59] hover:from-[#9E3D59] hover:to-[#832D45] text-white text-sm font-bold shadow-md shadow-[#9E4760]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Salvando cadastro...</span>
                </>
              ) : (
                <>
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Security badge */}
        <div className="pt-2 border-t border-[#F0E2E7] flex items-center justify-center gap-2 text-[11px] text-[#8E6A77]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Ambiente Seguro • Autenticação Oficial Google</span>
        </div>

      </div>

      {/* Footer / Admin Access Switcher */}
      <div className="text-center space-y-3 z-10">
        <button
          type="button"
          id="open-admin-login-btn"
          onClick={() => setIsAdminModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-[#8E6A77] hover:text-[#3D1E28] font-medium transition-colors py-1.5 px-3 rounded-full hover:bg-white/60"
        >
          <Lock className="w-3.5 h-3.5 text-[#9E4760]" />
          <span>Acesso da Equipe & Administração</span>
        </button>

        <p className="text-[11px] text-[#A07E8C]">
          © {new Date().getFullYear()} {SALON_INFO.name}. Todos os direitos reservados.
        </p>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={(user) => {
          onAuthenticated(user);
        }}
      />

    </div>
  );
};
