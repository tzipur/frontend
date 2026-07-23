import { useTranslation } from 'react-i18next';

export function PreviewHeader() {
  const { t } = useTranslation();

  return (
    <header className="py-[clamp(0.5rem,1.5dvh,1rem)] px-4 shrink-0 bg-tzipur-sand rounded-b-[40px] shadow-sm z-10 flex flex-col items-center text-center">
      <h1 className="font-serif text-2xl font-bold text-tzipur-sky">
        {t('preview.title')}
      </h1>
    </header>
  );
}
