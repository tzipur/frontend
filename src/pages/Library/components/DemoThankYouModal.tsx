import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import logoSrc from '../../../assets/tzipur_logo.png';

export function DemoThankYouModal() {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[100] bg-black/33 flex justify-center">
      <div
        className="bg-tzipur-surface rounded-3xl px-4 py-2 shadow-xl border border-white/40 text-center w-[95%] max-w-sm"
        style={{ opacity: 1, transform: 'none', position: 'absolute', bottom: '10px' }}
      >
        <div className="flex items-center justify-center mx-auto">
          <img src={logoSrc} alt="Tzipur Logo" className="w-12 h-12 object-contain" />
        </div>
        <h2 className="font-serif text-xl font-bold text-tzipur-sky mb-2">
          {t('library.demoModal.title')}
        </h2>
        <p className="text-tzipur-brown/80 text-sm leading-relaxed">
          {t('library.demoModal.description')}
        </p>
        <div className="pt-2">
          <Link to="/" className="text-tzipur-sky font-bold text-sm hover:text-tzipur-sky/80 underline underline-offset-4 decoration-tzipur-sky/30 hover:decoration-tzipur-sky/80 transition-colors">
            {t('library.demoModal.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
