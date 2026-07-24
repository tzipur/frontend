import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export function useHomePage() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/create');
  };

  const handleAuth = () => {
    navigate('/auth');
  };

  return { handleGuestLogin, handleAuth };
}
