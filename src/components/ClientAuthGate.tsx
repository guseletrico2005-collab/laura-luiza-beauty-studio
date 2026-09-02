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
  ChevronRight,
} from 'lucide-react';

import {
  formatPhoneMask,
  validateBrazilianPhone,
  signInClientWithGoogle,
  saveClientUserProfile,
} from '../services/firestoreService';

import { User as FirebaseUser } from 'firebase/auth';
import AdminLoginModal from './AdminLoginModal';
import { SALON_INFO } from '../data/mockData';

interface ClientAuthGateProps {
  onAuthenticated: (user: FirebaseUser) => void;
}

const ClientAuthGate: React.FC<ClientAuthGateProps> = ({
  onAuthenticated,
}) => {
  const [step, setStep] = useState<'welcome' | 'complete_profile'>('welcome');

  const [authenticatedUser, setAuthenticatedUser] =
    useState<FirebaseUser | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // =====================================================
  // CONTROLE DO MODAL DO ADMINISTRADOR
  // =====================================================
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // =====================================================
  // LOGIN COM GOOGLE
  // =====================================================
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      const user = await signInClientWithGoogle();

      if (!user) {
        throw new Error('Não foi possível realizar o login.');
      }

      setAuthenticatedUser(user);

      // Se o usuário ainda não tiver perfil completo,
      // solicita nome e telefone.
      if (!user.displayName || !user.phoneNumber) {
        setFullName(user.displayName || '');
        setPhone(user.phoneNumber || '');
        setStep('complete_profile');
        return;
      }

      setSuccessMsg('Login realizado com sucesso!');

      onAuthenticated(user);
    } catch (error: any) {
      console.error('Erro no login com Google:', error);

      if (error?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('O login foi cancelado.');
      } else if (error?.code === 'auth/network-request-failed') {
        setErrorMsg(
          'Não foi possível conectar ao servidor. Verifique sua internet.'
        );
      } else {
        setErrorMsg(
          error?.message || 'Não foi possível realizar o login.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ALTERAÇÃO DO TELEFONE
  // =====================================================
  const handlePhoneChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setPhone(formatPhoneMask(value));
  };

  // =====================================================
  // FINALIZAÇÃO DO PERFIL DO CLIENTE
  // =====================================================
  const handleCompleteProfileSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!authenticatedUser) {
      setErrorMsg('Usuário não autenticado.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Digite seu nome completo.');
      return;
    }

    if (!validateBrazilianPhone(phone)) {
      setErrorMsg('Digite um telefone válido.');
      return;
    }

    try {
      setLoading(true);

      await saveClientUserProfile(authenticatedUser.uid, {
        uid: authenticatedUser.uid,
        name: fullName.trim(),
        phone: phone,
        email: authenticatedUser.email || '',
        role: 'client',
        photoURL: authenticatedUser.photoURL || '',
      });

      setSuccessMsg('Perfil salvo com sucesso!');

      onAuthenticated(authenticatedUser);
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);

      setErrorMsg(
        error?.message ||
          'Não foi possível salvar seus dados. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGIN DO ADMINISTRADOR
  // =====================================================
  const handleAdminLoginSuccess = (user: FirebaseUser) => {
    // O AdminLoginModal já fez toda a validação do administrador.
    // Aqui apenas devolvemos o usuário autenticado para o App.
    onAuthenticated(user);
  };

  // =====================================================
  // TELA
  // =====================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F9] via-[#FFF7F8] to-[#F8E9EE] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* =====================================================
            LOGO
        ===================================================== */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#9E4760] to-[#C97B91] flex items-center justify-center shadow-lg mb-4">
            <Sparkles className="w-9 h-9 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-[#5B3744]">
            Laura Luíza Beauty
          </h1>

          <p className="text-sm text-[#8A6873] mt-1">
            Studio &amp; Estética Exclusiva
          </p>
        </div>

        {/* =====================================================
            CARD DE AUTENTICAÇÃO
        ===================================================== */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#F0DDE3] p-6">

          {step === 'welcome' && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-[#5B3744]">
                  Acesso Exclusivo para Clientes
                </h2>

                <p className="text-sm text-[#8A6873] mt-2">
                  Entre para agendar seus procedimentos e acompanhar
                  seus horários.
                </p>
              </div>

              {/* =====================================================
                  MENSAGEM DE ERRO
              ===================================================== */}
              {errorMsg && (
                <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />

                  <p className="text-sm text-red-700">
                    {errorMsg}
                  </p>
                </div>
              )}

              {/* =====================================================
                  MENSAGEM DE SUCESSO
              ===================================================== */}
              {successMsg && (
                <div className="mb-4 rounded-2xl bg-green-50 border border-green-200 p-3 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />

                  <p className="text-sm text-green-700">
                    {successMsg}
                  </p>
                </div>
              )}

              {/* =====================================================
                  LOGIN GOOGLE
              ===================================================== */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl border border-[#E6D7DC] bg-white hover:bg-[#FCF5F7] transition-all flex items-center justify-center gap-3 text-[#5B3744] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.44h3.14c1.84-1.7 2.92-4.2 2.92-7.4Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.74 9.74 0 0 0 12 21.5Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M6.53 13.59A5.86 5.86 0 0 1 6.22 12c0-.55.11-1.09.31-1.59V7.89H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.11l3.25-2.52Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 6.38c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.45 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.72 5.39l3.25 2.52C7.3 8.1 9.46 6.38 12 6.38Z"
                      />
                    </svg>

                    <span>Continuar com Google</span>
                  </>
                )}
              </button>

              {/* =====================================================
                  AVISO DE SEGURANÇA
              ===================================================== */}
              <div className="mt-4 flex items-center justify-center gap-2 text-[#8A6873]">
                <Lock className="w-4 h-4" />

                <span className="text-xs">
                  Ambiente Seguro • Autenticação Oficial Google
                </span>
              </div>

              {/* =====================================================
                  ACESSO DO ADMINISTRADOR
                  FICA ABAIXO DO LOGIN DO CLIENTE
              ===================================================== */}
              <div className="pt-5 mt-5 border-t border-[#F1E3E7]">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(true)}
                  className="w-full py-3 px-4 rounded-2xl border border-[#E2CDD6] bg-[#FCF9F7] hover:bg-[#FAF0F3] hover:border-[#9E4760] text-[#6B4552] text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#9E4760]" />

                  <span>Acesso do Administrador</span>

                  <ChevronRight className="w-4 h-4 text-[#9E4760]" />
                </button>

                <p className="text-[10px] text-[#A07E8C] text-center mt-1.5">
                  Área exclusiva para gerenciamento do Studio
                </p>
              </div>
            </>
          )}

          {/* =====================================================
              COMPLETAR PERFIL
          ===================================================== */}
          {step === 'complete_profile' && (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto w-14 h-14 rounded-full bg-[#F8E9EE] flex items-center justify-center mb-3">
                  <User className="w-7 h-7 text-[#9E4760]" />
                </div>

                <h2 className="text-xl font-bold text-[#5B3744]">
                  Complete seu cadastro
                </h2>

                <p className="text-sm text-[#8A6873] mt-2">
                  Precisamos de mais algumas informações para seus
                  agendamentos.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />

                  <p className="text-sm text-red-700">
                    {errorMsg}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleCompleteProfileSubmit}
                className="space-y-4"
              >
                {/* NOME */}
                <div>
                  <label className="block text-sm font-semibold text-[#5B3744] mb-2">
                    Nome completo
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A98491]" />

                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Digite seu nome"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E6D7DC] focus:outline-none focus:ring-2 focus:ring-[#C97B91] focus:border-transparent text-[#5B3744]"
                    />
                  </div>
                </div>

                {/* TELEFONE */}
                <div>
                  <label className="block text-sm font-semibold text-[#5B3744] mb-2">
                    Telefone / WhatsApp
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A98491]" />

                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="(31) 99999-9999"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E6D7DC] focus:outline-none focus:ring-2 focus:ring-[#C97B91] focus:border-transparent text-[#5B3744]"
                    />
                  </div>
                </div>

                {/* BOTÃO */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#9E4760] hover:bg-[#863A50] text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Continuar</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* =====================================================
            RODAPÉ
        ===================================================== */}
        <div className="text-center mt-5">
          <div className="flex items-center justify-center gap-1.5 text-[#A07E8C]">
            <Heart className="w-3.5 h-3.5 fill-current" />

            <p className="text-[10px]">
              © {new Date().getFullYear()} {SALON_INFO.name}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MODAL DO ADMINISTRADOR
          FICA FORA DO CARD PARA FUNCIONAR COMO MODAL
      ===================================================== */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
};

export default ClientAuthGate;
