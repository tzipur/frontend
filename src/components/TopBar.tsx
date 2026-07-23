import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, User, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoSrc from '../assets/tzipur_logo.png';
import { useAuth } from '../contexts/AuthContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const { isLoggedIn } = useAuth();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  // Hide back button on the root page
  const showBack = location.pathname !== '/';
  
  // Show profile avatar if registered
  const showProfile = isLoggedIn;

  return (
    <header className="w-full bg-tzipur-cream text-tzipur-brown h-14 sm:h-16 px-3 sm:px-4 flex items-center justify-between z-40 relative shadow-sm border-b border-tzipur-border shrink-0">
      {/* Right side (RTL Start) */}
      <div className="flex items-center z-10 w-18">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 -m-2 text-tzipur-sky hover:text-tzipur-sky-dark transition-colors"
            aria-label={t('navigation.back', 'Back')}
            title={t('navigation.back', 'Back')}
          >
            <ChevronRight className="hidden rtl:block w-7 h-7 sm:w-8 sm:h-8" />
            <ChevronLeft className="hidden ltr:block w-7 h-7 sm:w-8 sm:h-8" />
          </button>
        )}  
      </div>

      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Link 
          to="/" 
          className="flex items-center gap-2 pointer-events-auto"
          aria-label={t('components.topBar.home')}
          title={t('components.topBar.home')}
        >
          <img src={logoSrc} alt="Tzipur Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
        </Link>
      </div>

      {/* Left side (RTL End) */}
      <div className="flex items-center justify-end z-10 gap-1 w-24"> 
        {isInstallable && !isInstalled && (
          <button
            onClick={promptInstall}
            className="p-2 -m-2 text-tzipur-sky hover:text-tzipur-sky-dark transition-colors flex items-center gap-1 bg-tzipur-sky/10 rounded-full px-3 mr-1"
            aria-label={t('components.topBar.install', 'התקנת אפליקציה')}
            title={t('components.topBar.install', 'התקנת אפליקציה')}
          >
            <Download className="w-5 h-5" strokeWidth={2.5} />
          </button>
        )}
        
        {showProfile && (
          <Link
            to="/profile"
            className="p-2 -m-2 text-tzipur-sky hover:text-tzipur-sky-dark transition-colors ml-2"
            aria-label={t('components.topBar.profile')}
            title={t('components.topBar.profile')}
          >
            <User className="w-7 h-7 sm:w-8 sm:h-8" />
          </Link>
        )}
      </div>
    </header>
  );
}
