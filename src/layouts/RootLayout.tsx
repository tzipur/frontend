import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar';

/**
 * RootLayout — Mobile-first app shell.
 */
export default function RootLayout() {
  return (
    <div
      dir="rtl"
      className="max-w-md mx-auto min-h-[100dvh] flex flex-col overflow-x-hidden relative shadow-2xl bg-tzipur-cream"
    >
      <TopBar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
