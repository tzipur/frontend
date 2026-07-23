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
    onError: (error, query) => {
      console.error('Query failed:', error);
      const msgKey = (query.meta?.errorMessage as string) || 'common.error';
      toast.error(i18next.t(msgKey, 'אופס, משהו השתבש'), { id: msgKey });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      console.error('Mutation failed:', error);
      const msgKey = (mutation.meta?.errorMessage as string) || 'common.error';
      toast.error(i18next.t(msgKey, 'אופס, משהו השתבש'), { id: msgKey });
    },
  }),
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
