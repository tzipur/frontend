import { useRouteError, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function GlobalError() {
  const error = useRouteError() as Error;
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto min-h-[100dvh] flex flex-col items-center justify-center bg-tzipur-cream text-tzipur-brown p-6 text-center" dir="rtl">
      <div className="w-24 h-24 bg-tzipur-error-bg text-tzipur-error rounded-full flex items-center justify-center mb-6 shadow-sm border border-tzipur-error/20">
        <AlertTriangle size={48} />
      </div>
      
      <h1 className="font-serif text-2xl font-bold text-tzipur-sky mb-4">
        {t('components.error.title')}
      </h1>
      
      <p className="text-tzipur-brown/70 text-base mb-8 max-w-[300px]">
        {error?.message || t('components.error.message')}
      </p>

      <div className="flex flex-col gap-4 w-full max-w-[280px]">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 w-full bg-tzipur-sky text-white py-4 rounded-2xl font-medium text-base shadow-md hover:bg-tzipur-sky/90 transition"
        >
          <RefreshCw size={20} />
          <span>{t('components.error.retry')}</span>
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 w-full bg-white text-tzipur-sky border-2 border-tzipur-sky py-4 rounded-2xl font-medium text-base shadow-sm hover:bg-tzipur-sand transition"
        >
          <Home size={20} />
          <span>{t('components.error.home')}</span>
        </button>
      </div>
    </div>
  );
}
