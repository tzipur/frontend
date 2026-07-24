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
  const { nickname, pin, error, isLoading, hasSavedId } = state;
  const { setNickname, handleKeyPress, handleDelete, handleAuth } = actions;

  const pinTitle = error ? t('auth.error') : t('auth.pinLabel');

  return (
    <div className="flex-1 w-full flex flex-col px-4 py-2 sm:px-6 sm:py-6" dir="rtl">
      <div className="flex-1 w-full flex flex-col justify-between">
        <div className="flex flex-col flex-1 justify-between space-y-4 sm:space-y-6 max-w-sm mx-auto w-full">
          {/* Welcome back label if hasSavedId is true and we hide the input */}
          {hasSavedId && nickname && (
            <div className="text-center pb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-tzipur-brown">
                {t('auth.title')} {nickname}
              </h1>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!hasSavedId && (
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

          <Button 
            onClick={handleAuth}
            disabled={pin.length < 4 || (!hasSavedId && !nickname.trim()) || isLoading}
            className="w-full h-12 sm:h-14 text-lg font-semibold rounded-2xl"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : t('auth.submit')}
          </Button>
        </div>
      </div>
    </div>
  );
}
