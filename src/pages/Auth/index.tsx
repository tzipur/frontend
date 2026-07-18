import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [hasSavedNickname, setHasSavedNickname] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const savedNickname = localStorage.getItem('tzipur_nickname');
    if (savedNickname) {
      setNickname(savedNickname);
      setHasSavedNickname(true);
    }
  }, []);

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
      // Mock validation logic for offline mode
      const savedPin = localStorage.getItem('tzipur_pin');
      
      if (hasSavedNickname && savedPin && savedPin !== pin) {
        setError(true);
        setPin(''); // Reset pin on error
        return;
      }

      localStorage.setItem('tzipur_nickname', nickname);
      if (!savedPin || !hasSavedNickname) {
        localStorage.setItem('tzipur_pin', pin);
      }
      
      navigate('/library');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-tzipur-cream text-tzipur-brown" dir="rtl">
      <h1 className="font-serif text-3xl text-tzipur-sky mb-2 font-bold mt-2">{t('auth.title')}</h1>
      
      {!hasSavedNickname && (
        <p className="text-sm text-tzipur-muted leading-relaxed mb-8">
          {t('auth.explainer')}
        </p>
      )}

      <div className={`mb-8 ${hasSavedNickname ? 'mt-6' : ''}`}>
        <label className="block text-sm mb-2 font-medium">{t('auth.nicknameLabel')}</label>
        <input 
          type="text" 
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full bg-white border-2 border-tzipur-border rounded-2xl px-4 py-4 outline-none focus:border-tzipur-sky transition-colors text-lg"
          placeholder={t('auth.nicknamePlaceholder')}
        />
      </div>

      <div className="flex-1 flex flex-col items-center">
        <p className={`text-sm mb-6 font-medium transition-colors ${error ? 'text-red-500' : 'text-tzipur-sky'}`}>
          {error ? t('auth.error') : t('auth.pinLabel')}
        </p>
        <motion.div 
          className="flex gap-6 mb-8" 
          dir="ltr"
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-5 h-5 rounded-full border-2 transition-colors ${error ? 'border-red-500 bg-red-100' : pin.length > i ? 'bg-tzipur-sky border-tzipur-sky' : 'border-tzipur-border bg-white'}`} />
          ))}
        </motion.div>

        <div className="grid grid-cols-3 gap-6 max-w-[280px] w-full mt-auto mb-8 text-2xl font-medium" dir="ltr">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleKeyPress(num.toString())} className="w-16 h-16 rounded-full bg-white shadow-sm border border-tzipur-border flex items-center justify-center active:scale-95 transition-transform text-tzipur-sky hover:bg-gray-50">
              {num}
            </button>
          ))}
          <div />
          <button onClick={() => handleKeyPress('0')} className="w-16 h-16 rounded-full bg-white shadow-sm border border-tzipur-border flex items-center justify-center active:scale-95 transition-transform text-tzipur-sky hover:bg-gray-50">
            0
          </button>
          <button onClick={handleDelete} className="w-16 h-16 rounded-full bg-transparent flex items-center justify-center active:scale-95 transition-transform text-tzipur-muted hover:bg-tzipur-sand">
            <Delete size={28} />
          </button>
        </div>

        <button 
          onClick={handleAuth}
          disabled={pin.length < 4 || !nickname}
          className="w-full bg-tzipur-sky text-white py-4 rounded-2xl font-medium text-lg disabled:opacity-50 disabled:active:scale-100 active:scale-[0.98] transition-all shadow-md"
        >
          {t('auth.submit')}
        </button>
      </div>
    </div>
  );
}
