import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isOffline } from '../lib/supabase';
import SplashScreen from '../components/SplashScreen';

/**
 * Resolves the effective user_id:
 * - Registered users: stored in localStorage (persists across sessions)
 * - Guests: stored in sessionStorage (cleared when tab closes)
 */
export function getUserId(): string | null {
  const activeSession = sessionStorage.getItem('active_user_id');
  if (activeSession && activeSession !== 'null') return activeSession;
  return sessionStorage.getItem('guest_user_id');
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userId: string | null;
  isInitializing: boolean;
  isLoggedIn: boolean;
  hasSavedId: boolean;
  refreshMockSession: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userId: null,
  isInitializing: true,
  isLoggedIn: false,
  hasSavedId: false,
  refreshMockSession: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSavedId, setHasSavedId] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (localStorage.getItem('has_seen_onboarding') === null) {
      localStorage.setItem('has_seen_onboarding', 'false');
    }

    const setupMockSession = () => {
      const validId = getUserId();
      const isRegistered = !!validId;
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
      
      if (mounted) {
        const validId = getUserId();
        setUserId(validId);
        setIsLoggedIn(!!sessionStorage.getItem('active_user_id') && sessionStorage.getItem('active_user_id') !== 'null');
        setHasSavedId(!!localStorage.getItem('user_id') && localStorage.getItem('user_id') !== 'null');
        setIsInitializing(false);
      }
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
      const validId = getUserId();
      const isRegistered = !!validId;
      const mockSessionUser = isRegistered 
        ? { id: 'offline-user', email: 'test@example.com', role: 'authenticated' }
        : { id: 'offline-user', role: 'anon' };
      setSession({ access_token: 'mock-offline-token', user: mockSessionUser } as any);
      setUser(mockSessionUser as any);
    }
  };

  useEffect(() => {
    const handleAuthChanged = () => {
      const validId = getUserId();
      setUserId(validId);
      setIsLoggedIn(!!sessionStorage.getItem('active_user_id') && sessionStorage.getItem('active_user_id') !== 'null');
      setHasSavedId(!!localStorage.getItem('user_id') && localStorage.getItem('user_id') !== 'null');
      refreshMockSession();
    };

    window.addEventListener('auth_changed', handleAuthChanged);
    return () => window.removeEventListener('auth_changed', handleAuthChanged);
  }, []);

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ session, user, userId, isInitializing, isLoggedIn, hasSavedId, refreshMockSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

