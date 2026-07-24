import { useNavigate } from 'react-router-dom';

export function useHomePage() {
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    // Generate a temporary session-scoped guest ID
    if (!sessionStorage.getItem('guest_user_id')) {
      sessionStorage.setItem('guest_user_id', crypto.randomUUID());
    }
    window.dispatchEvent(new Event('auth_changed'));
    navigate('/create');
  };

  const handleAuth = () => {
    navigate('/auth');
  };

  return { handleGuestLogin, handleAuth };
}
