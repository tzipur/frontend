import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import TopBar from '../components/TopBar';
import SplashScreen from '../components/SplashScreen';

import { useTranslation } from 'react-i18next';

/**
 * RootLayout — Mobile-first app shell.
 */
export default function RootLayout() {
  const { i18n } = useTranslation();
  const location = useLocation();

  // Hide TopBar on homepage ('/') and welcome ('/welcome')
  const hideTopBar = location.pathname === '/' || location.pathname === '/welcome';

  return (
    <div
      dir={i18n.dir()}
      className="max-w-md mx-auto min-h-[100dvh] flex flex-col overflow-x-hidden relative shadow-2xl bg-tzipur-cream"
    >
      {!hideTopBar && <TopBar />}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
