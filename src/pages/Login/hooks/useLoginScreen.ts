import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../../api';
import { useAuth } from '../../../contexts/AuthContext';

export function useLoginScreen() {
  const navigate = useNavigate();
  const { hasSavedId, exitGuestMode } = useAuth();

  const [nickname, setNickname] = useState(
    hasSavedId ? (localStorage.getItem('nickname') || '') : ''
  );
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const loginMutation = useLogin();

  const handleKeyPress = (num: string) => {
    if (error) setError(false);
    if (pin.length < 4) setPin(p => p + num);
  };

  const handleDelete = () => {
    if (error) setError(false);
    setPin(p => p.slice(0, -1));
  };

  const handleAuth = () => {
    if (pin.length === 4 && nickname.trim()) {
      const payload = {
        nickname: nickname.trim(),
        code: pin,
        user_id: localStorage.getItem('user_id'),
      };

      loginMutation.mutate(payload, {
        onSuccess: (data) => {
          if (data.user_id) {
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('nickname', nickname.trim());
            sessionStorage.setItem('active_user_id', data.user_id);
          }
          // Clear guest session
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

  return {
    state: { nickname, pin, error, isLoading: loginMutation.isPending },
    actions: { setNickname, handleKeyPress, handleDelete, handleAuth }
  };
}
