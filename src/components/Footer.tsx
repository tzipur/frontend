import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full shrink-0 px-6 pb-[clamp(0.5rem,2dvh,1.5rem)] flex flex-col items-center bg-gradient-to-t from-tzipur-cream via-tzipur-cream to-transparent z-10">
      <div className="flex flex-col gap-[clamp(0.25rem,1dvh,0.5rem)] text-center text-[clamp(0.75rem,2dvh,0.85rem)] font-medium text-tzipur-brown/70 leading-snug max-w-[360px] mx-auto">
        <p>{t('common.disclaimer')}</p>
        <p dir="auto" className="text-[clamp(0.65rem,1.5dvh,0.75rem)] font-normal opacity-80">
          {t('common.rights', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
