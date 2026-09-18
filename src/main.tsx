import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import i18next from 'i18next';
import { router } from './router';
import './index.css';
import './i18n';
import { AuthProvider } from './contexts/AuthContext';
import { pingServer } from './api/api';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      console.error('Query failed:', error);
      if (error?.response?.data?.status === 'blocked') return;
      if (query.meta?.suppressErrorToast) return;
      
      const msgKey = (query.meta?.errorMessage as string) || 'common.error';
      toast.error(i18next.t(msgKey, 'אופס, משהו השתבש'), { id: msgKey });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any, _variables, _context, mutation) => {
      console.error('Mutation failed:', error);
      if (error?.response?.data?.status === 'blocked') return;
      // Out of edits: the preview shows its own "no edits left" message instead.
      if (error?.response?.status === 409 && error?.response?.data?.edits_left === 0) return;
      if (mutation.meta?.suppressErrorToast) return;
      
      const msgKey = (mutation.meta?.errorMessage as string) || 'common.error';
      toast.error(i18next.t(msgKey, 'אופס, משהו השתבש'), { id: msgKey });
    },
  }),
});

// After a deploy, a page still running the old build asks for page chunks that
// no longer exist. Reload once to pick up the new build; the timestamp guard
// stops a reload loop if the chunk is missing for another reason.
const RELOAD_KEY = 'tzipur:chunk-reload-at';
window.addEventListener('vite:preloadError', (event) => {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < 10_000) return;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // No session storage means no loop guard: show the error screen instead.
    return;
  }
  event.preventDefault();
  window.location.reload();
});

// Ping the server to wake it up (useful for free tier hosting like Render)
// Doing this here ensures it fires on explicit app initialization.
pingServer();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
