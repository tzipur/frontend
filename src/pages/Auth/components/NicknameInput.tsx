import { useTranslation } from 'react-i18next';

interface NicknameInputProps {
  nickname: string;
  onChange: (val: string) => void;
}

export default function NicknameInput({ nickname, onChange }: NicknameInputProps) {
  const { t } = useTranslation();
  const bullets = t('auth.explainerBullets', { returnObjects: true }) as string[];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-tzipur-brown/80 mb-2">
          {t('auth.nicknameLabel')}
        </label>
        <input
          type="text"
          value={nickname}
          autoFocus
          onChange={(e) => {
            const val = e.target.value;
            if (/^[a-zA-Zא-ת\s]*$/.test(val)) onChange(val);
          }}
          placeholder={t('auth.nicknamePlaceholder')}
          className="w-full bg-tzipur-surface/50 border border-tzipur-border shadow-sm rounded-xl px-4 py-3 outline-none focus:border-tzipur-sky focus:ring-2 focus:ring-tzipur-sky/20 transition-all duration-200 text-base font-medium placeholder:text-tzipur-brown/40 text-tzipur-brown"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold text-tzipur-brown">{t('auth.explainerTitle')}</p>
        <ul className="space-y-1">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-tzipur-brown/70">
              <span className="text-tzipur-sky mt-0.5 shrink-0">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
