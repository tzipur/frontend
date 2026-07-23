import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../../../api';
import { useAuth } from '../../../contexts/AuthContext';

export function useAuthPage() {
  const navigate = useNavigate();
  const { userId, isLoggedIn } = useAuth();
  
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [hasSavedId, setHasSavedId] = useState(false);
  const [error, setError] = useState(false);

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  useEffect(() => {
    if (isLoggedIn) {
      setHasSavedId(true);
    }
  }, [isLoggedIn]);

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
        user_id: userId,
      };

      const mutation = hasSavedId ? loginMutation : registerMutation;

      mutation.mutate(payload, {
        onSuccess: (data) => {
          if (data.user_id) {
            localStorage.setItem('user_id', data.user_id);
          }
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
    state: { nickname, pin, error, isLoading },
    actions: { setNickname, handleKeyPress, handleDelete, handleAuth }
  };
}
