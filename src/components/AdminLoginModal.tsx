```tsx
import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  X,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

import {
  loginAdminWithEmail,
  checkIsAdmin
} from '../services/firestoreService';

import {
  signInWithGoogle,
  auth
} from '../firebase';

import {
  signOut
} from 'firebase/auth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg(
        'Por favor, informe o e-mail e a senha administrativa.'
      );
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      /*
       * IMPORTANTE:
       * Se existir uma sessão anterior, encerramos antes
       * do login administrativo.
       */
      if (auth.currentUser) {
        await signOut(auth);
      }

      const user = await loginAdminWithEmail(
        email.trim(),
        password
      );

      const isAdmin = await checkIsAdmin();

      if (
        !isAdmin &&
        email.trim().toLowerCase() !==
          'guseletrico2005@gmail.com'
      ) {
        await signOut(auth);

        setErrorMsg(
          'Esta conta não possui privilégios de administrador.'
        );

        setLoading(false);
        return;
      }

      onLoginSuccess(user);
      onClose();

    } catch (err: any) {
      console.error(
        'Admin login error:',
        err
      );

      if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/user-not-found'
      ) {
        setErrorMsg(
          'E-mail ou senha de administrador incorretos.'
        );
      } else {
        setErrorMsg(
          err?.message ||
            'Falha ao autenticar administrador.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAdmin = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      /*
       * IMPORTANTE:
       * Encerra qualquer sessão existente antes
       * de iniciar o acesso administrativo.
       *
       * Isso evita que a conta do cliente continue
       * sendo utilizada automaticamente.
       */
      if (auth.currentUser) {
        await signOut(auth);
      }

      const user =
        await signInWithGoogle();

      const isAdmin =
        await checkIsAdmin();

      if (
        !isAdmin &&
        user.email?.toLowerCase() !==
          'guseletrico2005@gmail.com'
      ) {
        await signOut(auth);

        setErrorMsg(
          'Esta conta Google não possui privilégios de administrador.'
        );

        setLoading(false);
        return;
      }

      onLoginSuccess(user);
      onClose();

    } catch (err: any) {
      console.error(
        'Admin google error:',
        err
      );

      setErrorMsg(
        'Não foi possível autenticar com o Google.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">

      <div className="bg-white rounded-3xl border border-[#EFE2E7] shadow-2xl max-w-md w-full p-6 sm:p-8 relative space-y-5">

        {/* FECHAR */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#8E6A77] hover:text-[#351C26] hover:bg-[#FAF0F3] transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CABEÇALHO */}
        <div className="text-center space-y-2 pt-2">

          <div className="w-12 h-12 rounded-2xl bg-[#3D1E28] text-white flex items-center justify-center mx-auto shadow-md shadow-[#3D1E28]/20">
            <ShieldCheck className="w-6 h-6 text-[#F3D794]" />
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#351C26]">
            Acesso da Administração
          </h3>

          <p className="text-xs text-[#7A5A66]">
            Área restrita para gestão do Studio Laura Luíza Beauty
          </p>

        </div>

        {/* ERRO */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">

            <AlertCircle className="w-4 h-4 shrink-0" />

            <span>
              {errorMsg}
            </span>

          </div>
        )}

        {/* LOGIN E-MAIL */}
        <form
          onSubmit={handleEmailSubmit}
          className="space-y-4"
        >

          <div>

            <label className="block text-xs font-semibold text-[#543843] mb-1">
              E-mail do Administrador
            </label>

            <div className="relative">

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="guseletrico2005@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FCF9F7] border border-[#E2CDD6] text-xs sm:text-sm text-[#351C26] focus:outline-none focus:ring-2 focus:ring-[#9E4760]/30 focus:border-[#9E4760]"
              />

              <Mail className="w-4 h-4 text-[#9E7D8A] absolute left-3 top-1/2 -translate-y-1/2" />

            </div>

          </div>

          <div>

            <label className="block text-xs font-semibold text-[#543843] mb-1">
              Senha de Acesso
            </label>

            <div className="relative">

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FCF9F7] border border-[#E2CDD6] text-xs sm:text-sm text-[#351C26] focus:outline-none focus:ring-2 focus:ring-[#9E4760]/30 focus:border-[#9E4760]"
              />

              <Lock className="w-4 h-4 text-[#9E7D8A] absolute left-3 top-1/2 -translate-y-1/2" />

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#3D1E28] hover:bg-[#2B151C] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3D1E28]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >

            <span>
              {loading
                ? 'Validando Acesso...'
                : 'Entrar no Painel'}
            </span>

            <ArrowRight className="w-4 h-4 text-[#F3D794]" />

          </button>

        </form>

        {/* DIVISOR */}
        <div className="relative flex items-center justify-center">

          <div className="border-t border-[#F0E0E6] w-full" />

          <span className="bg-white px-3 text-[11px] text-[#8E6A77] absolute">
            ou
          </span>

        </div>

        {/* GOOGLE */}
        <button
          type="button"
          onClick={handleGoogleAdmin}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-[#E2CDD6] bg-white hover:bg-[#FAF0F3] text-xs font-bold text-[#351C26] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >

          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
          >

            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />

            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 0 13.82 1.25 17.42l4.03-3.15z"
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

          <span>
            Acesso Administrativo via Google
          </span>

        </button>

      </div>

    </div>
  );
};
```
