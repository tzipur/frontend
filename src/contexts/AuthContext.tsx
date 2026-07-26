import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isOffline } from '../lib/supabase';
import SplashScreen from '../components/SplashScreen';

export const DEMO_MODE = true;

/**
 * Resolves the effective user_id:
 * - Registered users: active_user_id in sessionStorage (set after login/register)
 * - Guests: guest_user_id in sessionStorage (only if backend returned one)
 * - No user: null
 */
export function getUserId(): string | null {
  const activeSession = sessionStorage.getItem('active_user_id');
  if (activeSession && activeSession !== 'null') return activeSession;
  
  // For guests, only return a user_id if the backend provided one
  const guestUserId = sessionStorage.getItem('guest_user_id');
  if (guestUserId && guestUserId !== 'null') return guestUserId;
  
  return null;
}

/**
 * Stores a backend-provided user_id for the current guest session.
 * Called when the backend returns a user_id (e.g., during story generation).
 */
export function setGuestUserId(userId: string) {
  if (sessionStorage.getItem('guest_mode') === 'true') {
    sessionStorage.setItem('guest_user_id', userId);
    window.dispatchEvent(new Event('auth_changed'));
  }
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userId: string | null;
  isInitializing: boolean;
  isLoggedIn: boolean;
  isGuest: boolean;
  hasSavedId: boolean;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
  refreshMockSession: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userId: null,
  isInitializing: true,
  isLoggedIn: false,
  isGuest: false,
  hasSavedId: false,
  enterGuestMode: () => {},
  exitGuestMode: () => {},
  refreshMockSession: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [hasSavedId, setHasSavedId] = useState(false);

  const syncAuthState = useCallback(() => {
    const validId = getUserId();
    setUserId(validId);
    setIsLoggedIn(!!sessionStorage.getItem('active_user_id') && sessionStorage.getItem('active_user_id') !== 'null');
    setIsGuest(sessionStorage.getItem('guest_mode') === 'true');
    setHasSavedId(!!localStorage.getItem('user_id') && localStorage.getItem('user_id') !== 'null');
  }, []);

  /** Enter guest mode — sets the flag and syncs state */
  const enterGuestMode = useCallback(() => {
    sessionStorage.setItem('guest_mode', 'true');
    syncAuthState();
  }, [syncAuthState]);

  /** Exit guest mode — clears guest flags and syncs state */
  const exitGuestMode = useCallback(() => {
    sessionStorage.removeItem('guest_mode');
    sessionStorage.removeItem('guest_user_id');
    syncAuthState();
  }, [syncAuthState]);

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
            syncAuthState();
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
        syncAuthState();
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
  }, [syncAuthState]);

  const refreshMockSession = useCallback(() => {
    if (isOffline) {
      const validId = getUserId();
      const isRegistered = !!validId;
      const mockSessionUser = isRegistered 
        ? { id: 'offline-user', email: 'test@example.com', role: 'authenticated' }
        : { id: 'offline-user', role: 'anon' };
      setSession({ access_token: 'mock-offline-token', user: mockSessionUser } as any);
      setUser(mockSessionUser as any);
    }
  }, []);

  useEffect(() => {
    const handleAuthChanged = () => {
      syncAuthState();
      refreshMockSession();
    };

    window.addEventListener('auth_changed', handleAuthChanged);
    return () => window.removeEventListener('auth_changed', handleAuthChanged);
  }, [syncAuthState, refreshMockSession]);

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ session, user, userId, isInitializing, isLoggedIn, isGuest, hasSavedId, enterGuestMode, exitGuestMode, refreshMockSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
