import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import TopBar from '../components/TopBar';
import SplashScreen from '../components/SplashScreen';
import IosInstallBanner from '../components/IosInstallBanner';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

import { useTranslation } from 'react-i18next';

/**
 * RootLayout — Mobile-first app shell.
 */
export default function RootLayout() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthError = () => {
      localStorage.setItem('user_id', 'null');
      window.dispatchEvent(new Event('auth_changed'));
      navigate('/auth');
    };
    window.addEventListener('auth_error', handleAuthError);
    return () => window.removeEventListener('auth_error', handleAuthError);
  }, [navigate]);

  // Hide TopBar on homepage ('/') and welcome ('/welcome')
  const hideTopBar = location.pathname === '/' || location.pathname === '/welcome';

  return (
    <div
      dir={i18n.dir()}
      className="max-w-md mx-auto min-h-[100dvh] flex flex-col overflow-x-hidden relative shadow-2xl bg-tzipur-cream"
    >
      <Toaster 
        position="top-left" 
        toastOptions={{ className: 'font-sans font-medium' }} 
        containerStyle={{ top: 72 }} 
      />
      {!hideTopBar && <TopBar />}
      <IosInstallBanner />
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
