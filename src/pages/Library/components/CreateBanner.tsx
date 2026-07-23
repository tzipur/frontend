import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CreateBannerProps {
  onCreateClick: () => void;
}

export function CreateBanner({ onCreateClick }: CreateBannerProps) {
  const { t } = useTranslation();

  return (
    <div className="px-6 pt-6 pb-2">
      <button
        onClick={onCreateClick}
        className="w-full bg-tzipur-sky text-white py-4 px-6 rounded-2xl flex items-center justify-between shadow-md active:scale-[0.98] transition-all hover:shadow-lg"
      >
        <div className="flex flex-col items-start text-start">
          <span className="font-serif font-bold text-2xl mb-0.5">{t('library.createBanner.title')}</span>
          <span className="text-white/80 text-sm font-medium">{t('library.createBanner.subtitle')}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 ms-4">
          <Plus size={20} className="text-white" />
        </div>
      </button>
    </div>
  );
}
