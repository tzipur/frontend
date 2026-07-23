import { useNavigate } from 'react-router-dom';

export function useHomePage() {
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    localStorage.setItem('user_id', 'null');
    window.dispatchEvent(new Event('auth_changed'));
    navigate('/create');
  };

  const handleAuth = () => {
    navigate('/auth');
  };

  return { handleGuestLogin, handleAuth };
}
