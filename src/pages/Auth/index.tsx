import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/Button';
import { useAuthPage } from './hooks/useAuthPage';
import NicknameInput from './components/NicknameInput';
import PinPad from './components/PinPad';

export default function AuthPage() {
  const { t } = useTranslation();
  const { state, actions } = useAuthPage();
  const { nickname, pin, error, isLoading, isLoginMode } = state;
  const { setNickname, handleKeyPress, handleDelete, handleAuth, switchToRegister, switchToLogin } = actions;

  const pinTitle = error ? t('auth.error') : t('auth.pinLabel');

  return (
    <div className="flex-1 w-full flex flex-col px-4 py-2 sm:px-6 sm:py-6" dir="rtl">
      <div className="flex-1 w-full flex flex-col justify-between">
        <div className="flex flex-col flex-1 justify-between space-y-4 sm:space-y-6 max-w-sm mx-auto w-full">
          {/* Welcome back label for login mode */}
          <AnimatePresence mode="wait">
            {isLoginMode && nickname ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden text-center pb-1"
              >
                <h1 className="text-xl sm:text-2xl font-bold text-tzipur-brown">
                  {t('auth.title')} {nickname}
                </h1>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Nickname input — shown in register mode, or in login mode when no saved nickname */}
          <AnimatePresence mode="wait">
            {(!isLoginMode || !nickname) && (
              <motion.div
                key="nickname"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <NicknameInput nickname={nickname} onChange={setNickname} />
              </motion.div>
            )}
          </AnimatePresence>

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
              disabled={pin.length < 4 || (!isLoginMode && !nickname.trim()) || isLoading}
              className="w-full h-12 sm:h-14 text-lg font-semibold rounded-2xl"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : t('auth.submit')}
            </Button>

            {/* Mode switch link */}
            <button
              type="button"
              onClick={isLoginMode ? switchToRegister : switchToLogin}
              className="w-full text-center text-sm text-tzipur-sky font-medium hover:underline transition-all duration-200"
            >
              {isLoginMode ? t('auth.notYou') : t('auth.haveAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
