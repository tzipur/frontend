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
      <div className="flex-1 flex flex-col justify-center items-center w-full overflow-y-auto overflow-x-hidden custom-scrollbar p-6 text-center pb-4 pt-8">
        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-[clamp(4rem,12dvh,6rem)] font-black mb-[clamp(1rem,3dvh,1.5rem)] text-[#5B93B5] tracking-tight drop-shadow-sm leading-tight mt-4 shrink-0"
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
          className="w-[clamp(8rem,25dvh,16rem)] h-[clamp(8rem,25dvh,16rem)] sm:w-80 sm:h-80 mb-[clamp(1rem,4dvh,2.5rem)] flex items-center justify-center shrink-0 drop-shadow-xl"
        >
          <img src={logoSrc} alt="Tzipur Logo" className="w-full h-full object-contain" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-[clamp(1.25rem,3.5dvh,1.875rem)] text-tzipur-brown/80 mb-[clamp(1rem,4dvh,3rem)] max-w-[450px] leading-[1.6] font-medium whitespace-pre-line px-4 mx-auto shrink-0"
        >
        {t('welcome.landing.subtitle')}
      </motion.p>
      </div>

      {/* Footer Buttons (Pinned to Bottom) */}
      <footer className="w-full shrink-0 px-6 pt-2 pb-[clamp(1.5rem,4dvh,3rem)] flex flex-col items-center bg-gradient-to-t from-tzipur-cream via-tzipur-cream to-transparent z-10">
        <div className="w-full max-w-sm space-y-[clamp(0.5rem,2dvh,1rem)]">
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-[#5B93B5] text-white py-[clamp(0.75rem,2dvh,1rem)] rounded-2xl text-[clamp(1.125rem,2.5dvh,1.25rem)] font-medium shadow-md hover:bg-[#4A7A9A] active:scale-[0.98] transition-all"
          >
            {t('welcome.landing.auth')}
          </button>

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
        </div>
      </footer>
    </motion.div>
  );
}
