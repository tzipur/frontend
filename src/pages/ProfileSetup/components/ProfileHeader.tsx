import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProfileHeaderProps {
  onDeleteProfileClick: () => void;
}

export function ProfileHeader({ onDeleteProfileClick }: ProfileHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between pb-[clamp(0.5rem,2dvh,1.5rem)] shrink-0">
      <div>
        <h1 className="font-serif text-3xl font-bold text-tzipur-sky leading-tight mb-1">
          {t('profile.title')}
        </h1>
        <p className="text-tzipur-brown/70 font-medium">
          {t('profile.subtitle', 'ספרו לנו על הילדים כדי שנתאים להם את הסיפורים')}
        </p>
      </div>
      <button
        type="button"
        onClick={onDeleteProfileClick}
        className="flex items-center justify-center w-10 h-10 rounded-full text-red-500/80 bg-red-50 hover:text-red-500 hover:bg-red-100 shadow-sm border border-red-100 transition-all shrink-0"
        title={t('profile.deleteProfile', 'מחיקת פרופיל')}
      >
        <Trash2 size={20} strokeWidth={2.5} />
      </button>
    </header>
  );
}
