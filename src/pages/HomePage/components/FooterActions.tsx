import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';

interface FooterActionsProps {
  onAuth: () => void;
  onGuest: () => void;
}

export default function FooterActions({ onAuth, onGuest }: FooterActionsProps) {
  const { t } = useTranslation();

  return (
    <footer className="w-full shrink-0 px-6 pb-[clamp(0.5rem,2dvh,1.5rem)] flex flex-col items-center bg-gradient-to-t from-tzipur-cream via-tzipur-cream to-transparent z-10">
      <div className="w-full max-w-sm space-y-[clamp(0.5rem,2dvh,1rem)]">
        <Button onClick={onAuth} variant="primary" fullWidth>
          {t('welcome.landing.auth')}
        </Button>

        <button
          onClick={onGuest}
          className="w-full bg-transparent text-tzipur-brown/70 py-[clamp(0.25rem,1dvh,0.5rem)] rounded-2xl text-[clamp(1.125rem,2.5dvh,1.25rem)] font-medium hover:text-tzipur-brown transition-colors"
        >
          {t('welcome.landing.guest')}
        </button>
        
        <div className="flex flex-col gap-[clamp(0.25rem,1dvh,0.5rem)] text-center text-[clamp(0.75rem,2dvh,0.85rem)] font-medium text-tzipur-brown/70 leading-snug max-w-[360px] mx-auto">
          <p>{t('common.disclaimer')}</p>
          <p dir="auto" className="text-[clamp(0.65rem,1.5dvh,0.75rem)] font-normal opacity-80">
            {t('common.rights', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
