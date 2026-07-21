import { useTranslation } from 'react-i18next';

export default function Disclaimer() {
  const { t } = useTranslation();
  return (
    <p className="text-xs text-tzipur-muted text-center leading-relaxed px-4 py-2">
      {t('common.disclaimer')}
    </p>
  );
}
