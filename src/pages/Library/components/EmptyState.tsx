import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';
import { LibraryHeader } from './LibraryHeader';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col">
      <LibraryHeader />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
        <BookOpen size={64} className="text-tzipur-brown/70" />
        <p className="text-base text-tzipur-brown/70">{t('library.empty.text')}</p>
        <Button variant="primary" onClick={onCreateClick}>
          {t('library.empty.create')}
        </Button>
      </div>
    </div>
  );
}
