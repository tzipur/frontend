import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../../../api';
import { useAuth } from '../../../contexts/AuthContext';

export function useAuthPage() {
  const navigate = useNavigate();
  const { hasSavedId, exitGuestMode } = useAuth();

  // Explicit mode: initialized from hasSavedId (the only reliable signal)
  const [isLoginMode, setIsLoginMode] = useState(hasSavedId);

  const [nickname, setNickname] = useState(
    hasSavedId ? (localStorage.getItem('nickname') || '') : ''
  );
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleKeyPress = (num: string) => {
    if (error) setError(false);
    if (pin.length < 4) setPin(p => p + num);
  };

  const handleDelete = () => {
    if (error) setError(false);
    setPin(p => p.slice(0, -1));
  };

  const switchToRegister = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('nickname');
    window.dispatchEvent(new Event('auth_changed'));
    setIsLoginMode(false);
    setNickname('');
    setPin('');
    setError(false);
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
    setNickname('');
    setPin('');
    setError(false);
  };

  const handleAuth = () => {
    if (pin.length === 4 && nickname) {
      const payload = {
        nickname,
        code: pin,
        user_id: isLoginMode ? localStorage.getItem('user_id') : null,
      };

      const mutation = isLoginMode ? loginMutation : registerMutation;

      mutation.mutate(payload, {
        onSuccess: (data) => {
          if (data.user_id) {
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('nickname', nickname);
            sessionStorage.setItem('active_user_id', data.user_id);
          }
          // Clear guest session — user is now registered
          exitGuestMode();
          window.dispatchEvent(new Event('auth_changed'));
          navigate('/library');
        },
        onError: () => {
          setError(true);
          setPin('');
        }
      });
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return {
    state: { nickname, pin, error, isLoading, isLoginMode },
    actions: { setNickname, handleKeyPress, handleDelete, handleAuth, switchToRegister, switchToLogin }
  };
}
