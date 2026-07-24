import { Trash2, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../../../hooks/useDarkMode';

interface ProfileHeaderProps {
  onDeleteProfileClick: () => void;
}

export function ProfileHeader({ onDeleteProfileClick }: ProfileHeaderProps) {
  const { t } = useTranslation();
  const { isDark, toggle } = useDarkMode();

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
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex items-center justify-center w-10 h-10 rounded-full text-tzipur-sky bg-tzipur-surface shadow-sm border border-tzipur-border hover:bg-tzipur-sky/10 transition-all shrink-0"
        >
          {isDark ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
        </button>
        <button
          type="button"
          onClick={onDeleteProfileClick}
          className="flex items-center justify-center w-10 h-10 rounded-full text-tzipur-error bg-tzipur-error-bg shadow-sm border border-tzipur-error/30 hover:bg-tzipur-error/10 transition-all shrink-0"
          title={t('profile.deleteProfile', 'מחיקת פרופיל')}
        >
          <Trash2 size={20} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}
