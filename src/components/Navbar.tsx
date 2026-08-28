```tsx
import React from 'react';
import {
  Sparkles,
  Calendar,
  Scissors,
  Clock,
  User,
  Phone,
  Menu,
  X,
  Share2
} from 'lucide-react';
import { AppView, SalonInfo } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  salonInfo: SalonInfo;
  appointmentsCount: number;
  userRole?: 'client' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  salonInfo,
  appointmentsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [shareSuccess, setShareSuccess] = React.useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Laura Luíza Beauty | Agende seu horário',
      text: 'Agende seu horário no Laura Luíza Beauty de forma rápida e fácil.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);

      setTimeout(() => {
        setShareSuccess(false);
      }, 2500);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  const navItems: {
    id: AppView;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'home',
      label: 'Início',
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      id: 'services',
      label: 'Serviços',
      icon: <Scissors className="w-4 h-4" />
    },
    {
      id: 'booking',
      label: 'Agendar',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: 'appointments',
      label: 'Meus Agendamentos',
      icon: <Clock className="w-4 h-4" />
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FCF9F7]/95 backdrop-blur-md border-b border-[#F0E2E7] transition-all">

      {/* Barra superior */}
      <div className="bg-[#9E4760] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#F6D0DA]" />

          Atendimento personalizado com produtos de alta performance
        </span>

        <span className="hidden md:inline text-[#FCE7EB]">
          • {salonInfo.openingHours}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group transition-transform active:scale-98"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#9E4760] to-[#E8A7B8] p-0.5 shadow-sm shadow-[#9E4760]/20 flex items-center justify-center group-hover:shadow-md transition-all">

              <div className="w-full h-full bg-[#FCF9F7] rounded-full flex items-center justify-center text-[#9E4760]">

                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />

              </div>

            </div>

            <div>

              <div className="flex items-center gap-1.5">

                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#3D1E28]">
                  Laura Luíza Beauty
                </span>

              </div>

              <p className="text-[11px] uppercase tracking-widest text-[#A06D7B] font-medium hidden sm:block">
                {salonInfo.slogan}
              </p>

            </div>

          </button>

          {/* NAVEGAÇÃO DESKTOP */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F5EBEF]/60 p-1.5 rounded-full border border-[#EEDCE2]">

            {navItems.map((item) => {

              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-[#9E4760] shadow-xs font-semibold'
                      : 'text-[#6B4E58] hover:text-[#9E4760] hover:bg-white/50'
                  }`}
                >

                  {item.icon}

                  <span>
                    {item.label}
                  </span>

                  {item.id === 'appointments' && appointmentsCount > 0 && (
                    <span className="w-5 h-5 bg-[#9E4760] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {appointmentsCount}
                    </span>
                  )}

                </button>
              );
            })}

          </nav>

          {/* AÇÕES DESKTOP */}
          <div className="hidden md:flex items-center gap-3">

            {/* Compartilhar */}
            <button
              id="share-header-btn"
              onClick={handleShare}
              title="Compartilhar Studio"
              className="p-2.5 rounded-full border border-[#EAD3DC] text-[#7A505E] hover:text-[#9E4760] hover:bg-[#FBEFF2] transition-colors relative"
            >

              <Share2 className="w-4 h-4" />

              {shareSuccess && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#3D1E28] text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link copiado!
                </span>
              )}

            </button>

            {/* Minha conta */}
            <button
              id="header-auth-btn"
              onClick={() => onNavigate('auth')}
              className={`p-2.5 rounded-full border transition-colors ${
                currentView === 'auth'
                  ? 'bg-[#9E4760] text-white border-[#9E4760]'
                  : 'border-[#EAD3DC] text-[#7A505E] hover:text-[#9E4760] hover:bg-[#FBEFF2] bg-white'
              }`}
              title="Minha Conta"
            >

              <User className="w-4 h-4" />

            </button>

            {/* Agendar */}
            <button
              id="header-book-btn"
              onClick={() => onNavigate('booking')}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B54E6D] to-[#9E3D59] hover:from-[#9E3D59] hover:to-[#832D45] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-[#9E4760]/25 transition-all transform active:scale-98 flex items-center gap-2"
            >

              <Calendar className="w-4 h-4" />

              <span>
                Agendar Horário
              </span>

            </button>

          </div>

          {/* AÇÕES MOBILE */}
          <div className="flex lg:hidden items-center gap-2">

            <button
              id="mobile-share-btn"
              onClick={handleShare}
              className="p-2.5 rounded-full text-[#7A505E] bg-[#F5EBEF]/60 border border-[#EEDCE2]"
              title="Compartilhar"
            >

              <Share2 className="w-4 h-4" />

            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#7A505E] bg-[#F5EBEF]/80 border border-[#EEDCE2]"
              aria-label="Abrir Menu"
            >

              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}

            </button>

          </div>

        </div>

      </div>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F0E2E7] bg-[#FCF9F7] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">

          {/* Cabeçalho do menu */}
          <div className="flex items-center justify-between py-2 px-3 bg-[#FAF0F3] rounded-2xl mb-3">

            <div className="flex items-center gap-2.5">

              <div className="w-8 h-8 rounded-full bg-[#9E4760] text-white flex items-center justify-center text-xs font-bold font-serif">
                LLB
              </div>

              <div>

                <p className="text-xs font-semibold text-[#3D1E28]">
                  Laura Luíza Beauty
                </p>

                <p className="text-[10px] text-[#8C5D6C]">
                  Beleza, cuidado e autoestima
                </p>

              </div>

            </div>

            <button
              id="mobile-drawer-auth"
              onClick={() => {
                onNavigate('auth');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-[#9E4760] bg-white px-3 py-1.5 rounded-full border border-[#EAD3DC]"
            >
              Minha Conta
            </button>

          </div>

          {/* Links principais */}
          <div className="grid grid-cols-2 gap-2">

            {navItems.map((item) => (

              <button
                key={item.id}
                id={`drawer-link-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-[#9E4760] text-white font-semibold'
                    : 'bg-white border border-[#EEDCE2] text-[#6B4E58]'
                }`}
              >

                {item.icon}

                <span>
                  {item.label}
                </span>

              </button>

            ))}

          </div>

          {/* Ações */}
          <div className="pt-2 flex flex-col gap-2">

            {/* Minha conta */}
            <button
              id="drawer-account-btn"
              onClick={() => {
                onNavigate('auth');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#D9BAC5] text-[#6B4E58] bg-white text-xs font-semibold"
            >

              <User className="w-4 h-4 text-[#9E4760]" />

              <span>
                Minha Conta
              </span>

            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${salonInfo.whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20Laura%20Lu%C3%ADza%20Beauty.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-sm"
            >

              <Phone className="w-4 h-4" />

              <span>
                Falar no WhatsApp
              </span>

            </a>

          </div>

        </div>
      )}

    </header>
  );
};
```


    </header>
  );
};
```
