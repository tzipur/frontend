import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../../api';
import { useAuth } from '../../../contexts/AuthContext';

export function useRegisterScreen() {
  const navigate = useNavigate();
  const { exitGuestMode } = useAuth();

  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const registerMutation = useRegister();

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
        user_id: null,
      };

      registerMutation.mutate(payload, {
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
    state: { nickname, pin, error, isLoading: registerMutation.isPending },
    actions: { setNickname, handleKeyPress, handleDelete, handleAuth }
  };
}
