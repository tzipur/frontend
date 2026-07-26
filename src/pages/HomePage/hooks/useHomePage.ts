import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export function useHomePage() {
  const navigate = useNavigate();
  const { enterGuestMode } = useAuth();

  const handleGuestLogin = () => {
    enterGuestMode();
    navigate('/create');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return { handleGuestLogin, handleLogin, handleRegister };
}
