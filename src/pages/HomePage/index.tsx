import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logoSrc from '../../assets/tzipur_logo.png';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col fixed inset-0 h-[100svh] max-h-[100svh] overflow-hidden bg-tzipur-cream"
    >
      <div className="flex-1 flex flex-col justify-start items-center w-full overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:p-6 text-center pb-2 sm:pb-4 pt-[clamp(1.5rem,4dvh,3rem)]">
        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-[clamp(3.25rem,10dvh,6rem)] font-black mb-[clamp(0.5rem,2dvh,1.5rem)] text-[#5B93B5] tracking-tight drop-shadow-sm leading-tight mt-2 sm:mt-4 shrink-0"
        >
          {t('welcome.landing.title')}
        </motion.h1>

        {/* Logo / Lottie placeholder */}
        <motion.div
          variants={itemVariants}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          className="w-[clamp(7rem,22dvh,16rem)] h-[clamp(7rem,22dvh,16rem)] sm:w-80 sm:h-80 mb-[clamp(0.5rem,3dvh,2.5rem)] flex items-center justify-center shrink-0 drop-shadow-xl"
        >
          <img src={logoSrc} alt="Tzipur Logo" className="w-full h-full object-contain" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-[clamp(1.1rem,3dvh,1.875rem)] text-tzipur-brown/80 mb-[clamp(0.5rem,2dvh,3rem)] max-w-[450px] leading-[1.3] sm:leading-[1.6] font-medium whitespace-pre-line px-2 sm:px-4 mx-auto shrink-0"
        >
        {t('welcome.landing.subtitle')}
      </motion.p>
      </div>

      {/* Footer Buttons (Pinned to Bottom) */}
      <footer className="w-full shrink-0 px-6 pt-2 pb-[clamp(0.5rem,2dvh,1.5rem)] flex flex-col items-center bg-gradient-to-t from-tzipur-cream via-tzipur-cream to-transparent z-10">
        <div className="w-full max-w-sm space-y-[clamp(0.5rem,2dvh,1rem)]">
          <Button
            onClick={() => navigate('/auth')}
            variant="primary"
            fullWidth
          >
            {t('welcome.landing.auth')}
          </Button>

          <button
            onClick={() => {
              localStorage.removeItem('tzipur_pin');
              window.dispatchEvent(new Event('tzipur_auth_changed'));
              navigate('/create');
            }}
            className="w-full bg-transparent text-tzipur-brown/70 py-[clamp(0.25rem,1dvh,0.5rem)] rounded-2xl text-[clamp(1.125rem,2.5dvh,1.25rem)] font-medium hover:text-tzipur-brown transition-colors"
          >
            {t('welcome.landing.guest')}
          </button>
          
          <div className="flex flex-col gap-[clamp(0.25rem,1dvh,0.5rem)] text-center text-[clamp(0.75rem,2dvh,0.85rem)] font-medium text-tzipur-brown/70 pt-[clamp(0.5rem,2dvh,1rem)] leading-snug max-w-[360px] mx-auto">
            <p>{t('common.disclaimer')}</p>
            <p dir="auto" className="text-[clamp(0.65rem,1.5dvh,0.75rem)] font-normal opacity-80">{t('common.rights', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
