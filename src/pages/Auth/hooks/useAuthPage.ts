import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../../../api';
import { useAuth } from '../../../hooks/useAuth';

export function useAuthPage() {
  const navigate = useNavigate();
  const { hasSavedId, login } = useAuth();
  
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '');
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

  const handleAuth = () => {
    if (pin.length === 4 && nickname) {
      const payload = {
        nickname,
        code: pin,
        // When logging in, we pass the saved user_id so backend knows who it is.
        // If registering, this is null.
        user_id: hasSavedId ? localStorage.getItem('user_id') : null,
      };

      const mutation = hasSavedId ? loginMutation : registerMutation;

      mutation.mutate(payload, {
        onSuccess: (data) => {
          if (data.user_id) {
            login(data.user_id, nickname);
          } else {
            window.dispatchEvent(new Event('auth_changed'));
          }
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
    state: { nickname, pin, error, isLoading, hasSavedId },
    actions: { setNickname, handleKeyPress, handleDelete, handleAuth }
  };
}
