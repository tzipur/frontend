import { Trash2, Sun, Moon, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../../../hooks/useDarkMode';

interface ProfileHeaderProps {
  onDeleteProfileClick: () => void;
  onLogOutClick: () => void;
}

export function ProfileHeader({ onDeleteProfileClick, onLogOutClick }: ProfileHeaderProps) {
  const { t } = useTranslation();
  const { isDark, toggle } = useDarkMode();

  return (
    <header className="flex items-start justify-between gap-4 pb-[clamp(0.5rem,2dvh,1.5rem)] shrink-0">
      <div className="flex-1 min-w-0 pt-1">
        <h1 className="font-serif text-3xl font-bold text-tzipur-sky leading-tight mb-1">
          {t('profile.title')}
        </h1>
        <p className="text-tzipur-brown/70 font-medium leading-snug">
          {t('profile.subtitle', 'ספרו לנו על הילדים כדי שנתאים להם את הסיפורים')}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0 pt-1">
        <button
          type="button"
          onClick={toggle}
          className="p-2 text-tzipur-sky hover:text-tzipur-sky-dark hover:bg-tzipur-sky/10 rounded-full transition-colors"
          title="Toggle dark mode"
        >
          {isDark ? <Sun size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
        </button>
        <button
          type="button"
          onClick={onLogOutClick}
          className="p-2 text-tzipur-brown/70 hover:text-tzipur-brown hover:bg-tzipur-brown/10 rounded-full transition-colors"
          title="Log out"
        >
          <LogOut size={24} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={onDeleteProfileClick}
          className="p-2 text-tzipur-error/80 hover:text-tzipur-error hover:bg-tzipur-error/10 rounded-full transition-colors"
          title={t('profile.deleteProfile', 'מחיקת פרופיל')}
        >
          <Trash2 size={24} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}
