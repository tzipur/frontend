import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { useAuthPage } from './hooks/useAuthPage';
import NicknameInput from './components/NicknameInput';
import PinPad from './components/PinPad';

export default function AuthPage() {
  const { t } = useTranslation();
  const { state, actions } = useAuthPage();
  const { nickname, pin, error, isLoading } = state;
  const { setNickname, handleKeyPress, handleDelete, handleAuth } = actions;

  return (
    <div className="flex-1 w-full flex flex-col px-4 py-2 sm:p-4 bg-tzipur-cream text-tzipur-brown overflow-y-auto custom-scrollbar">
      <NicknameInput nickname={nickname} onChange={setNickname} />

      <div className="flex-1 flex flex-col items-center justify-end min-h-0 pb-2 sm:pb-4">
        <PinPad 
          pin={pin} 
          error={error} 
          onKeyPress={handleKeyPress} 
          onDelete={handleDelete} 
          title={error ? t('auth.error') : t('auth.pinLabel')}
        />

        <div className="w-full mt-auto pt-[clamp(0.5rem,2dvh,1.5rem)] shrink-0">
          <Button variant="primary" fullWidth onClick={handleAuth} disabled={pin.length < 4 || !nickname || isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t('auth.submit')}
          </Button>
        </div>
      </div>
    </div>
  );
}
