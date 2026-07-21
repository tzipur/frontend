import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isOffline } from '../lib/supabase';
import SplashScreen from '../components/SplashScreen';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isInitializing: boolean;
  refreshMockSession: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isInitializing: true,
  refreshMockSession: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const setupMockSession = () => {
      const pin = localStorage.getItem('tzipur_pin');
      const isRegistered = !!pin;
      const mockSessionUser = isRegistered 
        ? { id: 'offline-user', email: 'test@example.com', role: 'authenticated' }
        : { id: 'offline-user', role: 'anon' };
      
      setSession({ access_token: 'mock-offline-token', user: mockSessionUser } as any);
      setUser(mockSessionUser as any);
    };

    async function initAuth() {
      if (isOffline) {
        // Mock offline behavior
        setTimeout(() => {
          if (mounted) {
            setupMockSession();
            setIsInitializing(false);
          }
        }, 1000); // 1s splash screen for offline demo
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Anonymous sign-in for guests
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error('Anonymous sign-in failed:', error);
          }
          if (data.session && mounted) {
            setSession(data.session);
            setUser(data.user);
          }
        } else if (mounted) {
          setSession(session);
          setUser(session.user);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      }
      
      if (mounted) setIsInitializing(false);
    }

    initAuth();

    if (!isOffline) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      });
      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } else {
      return () => { mounted = false; };
    }
  }, []);

  const refreshMockSession = () => {
    if (isOffline) {
      const pin = localStorage.getItem('tzipur_pin');
      const isRegistered = !!pin;
      const mockSessionUser = isRegistered 
        ? { id: 'offline-user', email: 'test@example.com', role: 'authenticated' }
        : { id: 'offline-user', role: 'anon' };
      setSession({ access_token: 'mock-offline-token', user: mockSessionUser } as any);
      setUser(mockSessionUser as any);
    }
  };

  useEffect(() => {
    window.addEventListener('tzipur_auth_changed', refreshMockSession);
    return () => window.removeEventListener('tzipur_auth_changed', refreshMockSession);
  }, []);

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ session, user, isInitializing, refreshMockSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
