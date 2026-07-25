import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';
import { DEMO_MODE } from '../../../contexts/AuthContext';

interface HomePageActionsProps {
  onLogin: () => void;
  onRegister: () => void;
  onGuest: () => void;
}

export default function HomePageActions({ onLogin, onRegister, onGuest }: HomePageActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full shrink-0 px-6 flex flex-col items-center z-10 mb-[clamp(1rem,3dvh,2rem)]">
      <div className="w-full max-w-sm space-y-[clamp(0.5rem,2dvh,1rem)]">
        {!DEMO_MODE ? (
          <>
            <Button onClick={onLogin} variant="primary" fullWidth>
              {t('welcome.landing.login')}
            </Button>

            <Button onClick={onRegister} variant="secondary" fullWidth className="bg-transparent border-2 border-tzipur-sky text-tzipur-sky hover:bg-tzipur-sky/10">
              {t('welcome.landing.register')}
            </Button>

            <button
              onClick={onGuest}
              className="w-full bg-transparent text-tzipur-brown/70 py-[clamp(0.25rem,1dvh,0.5rem)] rounded-2xl text-[clamp(1.125rem,2.5dvh,1.25rem)] font-medium hover:text-tzipur-brown transition-colors"
            >
              {t('welcome.landing.guest')}
            </button>
          </>
        ) : (
          <Button onClick={onGuest} variant="primary" fullWidth>
            {t('welcome.landing.guest')}
          </Button>
        )}
      </div>
    </div>
  );
}
