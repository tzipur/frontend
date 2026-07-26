import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import TopBar from '../components/TopBar';
import SplashScreen from '../components/SplashScreen';

import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

import { useTranslation } from 'react-i18next';
import { useAuth, DEMO_MODE } from '../contexts/AuthContext';

/**
 * RootLayout — Mobile-first app shell.
 */
export default function RootLayout() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, isGuest, hasSavedId, exitGuestMode } = useAuth();

  useEffect(() => {
    const handleAuthError = () => {
      localStorage.removeItem('user_id');
      sessionStorage.removeItem('active_user_id');
      exitGuestMode();
      window.dispatchEvent(new Event('auth_changed'));
      navigate(DEMO_MODE ? '/' : '/login');
    };
    window.addEventListener('auth_error', handleAuthError);
    return () => window.removeEventListener('auth_error', handleAuthError);
  }, [navigate]);

  // Protect routes for locked users
  useEffect(() => {
    if (!isLoggedIn && !isGuest && hasSavedId && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/welcome') {
      navigate('/');
    }
  }, [isLoggedIn, isGuest, hasSavedId, location.pathname, navigate]);

  // Hide TopBar on homepage ('/') and welcome ('/welcome')
  const hideTopBar = location.pathname === '/' || location.pathname === '/welcome';

  return (
    <div
      dir={i18n.dir()}
      className="max-w-md mx-auto h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden relative shadow-2xl bg-tzipur-cream"
    >
      <Toaster 
        position="top-left" 
        toastOptions={{ className: 'font-sans font-medium' }} 
        containerStyle={{ top: 72 }} 
      />
      {!hideTopBar && <TopBar />}

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Suspense fallback={<SplashScreen />}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex-1 flex flex-col w-full h-full"
          >
            <Outlet />
          </motion.div>
        </Suspense>
      </div>
    </div>
  );
}
