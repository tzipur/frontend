import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CreationHeaderProps {
  isLoggedIn: boolean;
}

export function CreationHeader({ isLoggedIn }: CreationHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="py-[clamp(0.25rem,1dvh,0.5rem)] mb-[clamp(0.5rem,2dvh,1.5rem)] shrink-0">
      <h1 className="font-serif text-[clamp(1.25rem,3dvh,1.5rem)] font-bold text-tzipur-sky">{t('creation.title')}</h1>
      <p className="text-tzipur-brown/70 mt-1 text-base">
        {t('creation.subtitle')}
      </p>
      {!isLoggedIn && (
        <div className="mt-3 bg-tzipur-cream/80 border border-tzipur-sky/20 rounded-xl p-3 shadow-sm text-center">
          <p className="text-sm text-tzipur-brown/90 leading-relaxed">
            {t('creation.signupHintPrefix')}
            <Link to="/auth" className="text-tzipur-sky font-bold hover:underline">
              {t('creation.signupHintAction')}
            </Link>
          </p>
        </div>
      )}
    </header>
  );
}
