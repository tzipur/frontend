import { Outlet } from 'react-router-dom';

/**
 * RootLayout — Mobile-first app shell.
 *
 * Constrains the viewport to max-w-md (448px) centered on desktop,
 * with min-h-[100dvh] to fill the dynamic viewport height on mobile.
 * Uses shadow-2xl to visually separate the app from the desktop background.
 * overflow-x-hidden prevents horizontal scroll from RTL content overflow.
 */
export default function RootLayout() {
  return (
    <div
      dir="rtl"
      className="max-w-md mx-auto min-h-[100dvh] overflow-x-hidden relative shadow-2xl bg-tzipur-cream"
    >
      <Outlet />
    </div>
  );
}
