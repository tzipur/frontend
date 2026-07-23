import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { useLogin, useRegister } from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId, isLoggedIn } = useAuth();
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [hasSavedId, setHasSavedId] = useState(false);
  const [error, setError] = useState(false);

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  useEffect(() => {
    if (isLoggedIn) {
      setHasSavedId(true);
    }
  }, [isLoggedIn]);

  const handleKeyPress = (num: string) => {
    if (error) setError(false);
    if (pin.length < 4) setPin(p => p + num);
  };
  const handleDelete = () => {
    if (error) setError(false);
    setPin(p => p.slice(0, -1));
  };

  const handleAuth = () => {
    if (pin.length === 4 && nickname) {
      const payload = {
        nickname,
        code: pin,
        user_id: userId,
      };

      const mutation = hasSavedId ? loginMutation : registerMutation;

      mutation.mutate(payload, {
        onSuccess: (data) => {
          if (data.user_id) {
            localStorage.setItem('user_id', data.user_id);
          }
          window.dispatchEvent(new Event('auth_changed'));
          navigate('/library');
        },
        onError: () => {
          setError(true);
          setPin('');
        }
      });
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="flex-1 w-full flex flex-col px-4 py-2 sm:p-4 bg-tzipur-cream text-tzipur-brown overflow-y-auto custom-scrollbar">

      <div className="shrink-0 mb-1 sm:mb-4">
        <label className="block text-[clamp(0.85rem,2.5dvh,0.95rem)] mb-[clamp(0.25rem,1dvh,0.5rem)] font-medium text-tzipur-brown/80">{t('auth.nicknameLabel')}</label>
        <input 
          type="text" 
          value={nickname}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '' || /^[a-zA-Zא-ת\s]+$/.test(val)) {
              setNickname(val);
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

      <div className="flex-1 flex flex-col items-center justify-end min-h-0 pb-2 sm:pb-4">
        <div className="w-full max-w-[340px] flex flex-col items-center mx-auto">
          <p className={`text-center text-[clamp(1.1rem,3dvh,1.35rem)] mb-[clamp(0.75rem,2dvh,1.25rem)] font-bold transition-colors ${error ? 'text-tzipur-error' : 'text-tzipur-sky'}`}>
            {error ? t('auth.error') : t('auth.pinLabel')}
          </p>
          <motion.div 
            className="flex justify-between w-[85%] mb-[clamp(0.75rem,2.5dvh,2rem)]" 
            dir="ltr"
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`w-[clamp(2rem,6dvh,3.5rem)] h-[clamp(2rem,6dvh,3.5rem)] rounded-full border-[3px] transition-colors ${error ? 'border-tzipur-error bg-tzipur-error-bg' : pin.length > i ? 'bg-tzipur-sky border-tzipur-sky' : 'border-tzipur-border bg-white'}`} />
            ))}
          </motion.div>

          <div className="grid grid-cols-3 place-items-center gap-y-[clamp(0.25rem,1.5dvh,1.25rem)] gap-x-[clamp(1rem,4vw,2.5rem)] w-full text-lg sm:text-2xl font-medium" dir="ltr">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button key={num} onClick={() => handleKeyPress(num.toString())} className="w-[clamp(3rem,8.5dvh,4.5rem)] h-[clamp(3rem,8.5dvh,4.5rem)] rounded-full bg-white shadow-sm border border-tzipur-border flex items-center justify-center active:scale-95 transition-transform text-tzipur-sky hover:bg-tzipur-sand">
                {num}
              </button>
            ))}
            <div />
            <button onClick={() => handleKeyPress('0')} className="w-[clamp(3rem,8.5dvh,4.5rem)] h-[clamp(3rem,8.5dvh,4.5rem)] rounded-full bg-white shadow-sm border border-tzipur-border flex items-center justify-center active:scale-95 transition-transform text-tzipur-sky hover:bg-tzipur-sand">
              0
            </button>
            <button onClick={handleDelete} className="w-[clamp(3rem,8.5dvh,4.5rem)] h-[clamp(3rem,8.5dvh,4.5rem)] rounded-full bg-transparent flex items-center justify-center active:scale-95 transition-transform text-tzipur-brown/70 hover:bg-tzipur-sand">
              <Delete size={32} />
            </button>
          </div>
        </div>

        <div className="w-full mt-auto pt-[clamp(0.5rem,2dvh,1.5rem)] shrink-0">
          <Button variant="primary" fullWidth onClick={handleAuth} disabled={pin.length < 4 || !nickname || isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t('auth.submit')}
          </Button>
        </div>
      </div>
    </div>
  );
}
