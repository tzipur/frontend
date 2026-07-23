import { useTranslation } from 'react-i18next';

interface NicknameInputProps {
  nickname: string;
  onChange: (val: string) => void;
}

export default function NicknameInput({ nickname, onChange }: NicknameInputProps) {
  const { t } = useTranslation();

  return (
    <div className="shrink-0 mb-1 sm:mb-4">
      <label className="block text-[clamp(0.85rem,2.5dvh,0.95rem)] mb-[clamp(0.25rem,1dvh,0.5rem)] font-medium text-tzipur-brown/80">
        {t('auth.nicknameLabel')}
      </label>
      <input 
        type="text" 
        value={nickname}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '' || /^[a-zA-Zא-ת\s]+$/.test(val)) {
            onChange(val);
          }
        }}
        className="w-full bg-white border border-tzipur-border shadow-sm rounded-xl px-4 py-[clamp(0.5rem,1.5dvh,0.75rem)] outline-none focus:border-tzipur-sky focus:ring-4 focus:ring-tzipur-sky/10 transition-all text-[clamp(0.95rem,2.5dvh,1.05rem)] font-medium placeholder:text-tzipur-brown/40 placeholder:font-normal text-tzipur-brown"
        placeholder={t('auth.nicknamePlaceholder')}
      />
      <div className="text-[clamp(0.8rem,2dvh,0.95rem)] text-tzipur-brown/70 mt-[clamp(0.75rem,2dvh,1rem)] space-y-[clamp(0.25rem,1dvh,0.5rem)]">
        <p className="font-bold text-tzipur-brown text-[clamp(0.85rem,2dvh,1rem)]">{t('auth.explainerTitle')}</p>
        <ul className="space-y-[clamp(0.25rem,1dvh,0.5rem)] leading-snug sm:leading-relaxed">
          {(t('auth.explainerBullets', { returnObjects: true }) as string[]).map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-tzipur-sky mt-0.5">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
