import { useTranslation } from 'react-i18next';

export function LibraryHeader() {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between p-6 pb-4 bg-white shadow-sm border-b border-tzipur-border sticky top-0 z-10">
      <h1 className="font-serif text-4xl font-bold text-tzipur-sky">{t('library.title')}</h1>
    </header>
  );
}
