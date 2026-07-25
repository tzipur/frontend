import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { DEMO_MODE } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { useLoginScreen } from './hooks/useLoginScreen';
import NicknameInput from '../../components/Auth/NicknameInput';
import PinPad from '../../components/Auth/PinPad';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { state, actions } = useLoginScreen();
  const { nickname, pin, error, isLoading } = state;
  const { setNickname, handleKeyPress, handleDelete, handleAuth } = actions;

  if (DEMO_MODE) return <Navigate to="/" replace />;

  const pinTitle = error ? t('auth.error') : t('auth.pinLabel');

  return (
    <div className="flex-1 w-full flex flex-col px-4 py-2 sm:px-6 sm:py-6" dir="rtl">
      <div className="flex-1 w-full flex flex-col justify-between">
        <div className="flex flex-col flex-1 justify-between space-y-4 sm:space-y-6 max-w-sm mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pb-1"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-tzipur-brown">
              {t('auth.loginTitle')}
            </h1>
          </motion.div>

          <NicknameInput nickname={nickname} label={t('auth.nicknameLoginLabel')} onChange={setNickname} />

          <PinPad 
            pin={pin} 
            error={error} 
            title={pinTitle}
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
          />

          <div className="space-y-3">
            <Button 
              onClick={handleAuth}
              disabled={pin.length < 4 || !nickname.trim() || isLoading}
              className="w-full h-12 sm:h-14 text-lg font-semibold rounded-2xl"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : t('auth.submit')}
            </Button>

            <Link
              to="/register"
              className="block w-full text-center text-sm text-tzipur-sky font-medium hover:underline transition-all duration-200"
            >
              {t('auth.noAccount')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
