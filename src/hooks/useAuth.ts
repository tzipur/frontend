import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const loginAsGuest = () => {
    if (!sessionStorage.getItem('guest_user_id')) {
      sessionStorage.setItem('guest_user_id', context.user?.id || crypto.randomUUID());
    }
    window.dispatchEvent(new Event('auth_changed'));
  };

  const login = (userId: string, nickname: string) => {
    localStorage.setItem('user_id', userId);
    localStorage.setItem('nickname', nickname);
    sessionStorage.setItem('active_user_id', userId);
    window.dispatchEvent(new Event('auth_changed'));
  };

  const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('nickname');
    sessionStorage.removeItem('guest_user_id');
    sessionStorage.removeItem('active_user_id');
    window.dispatchEvent(new Event('auth_changed'));
  };

  return { ...context, loginAsGuest, login, logout };
};
