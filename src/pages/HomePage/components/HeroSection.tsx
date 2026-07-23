import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logoSrc from '../../../assets/tzipur_logo.png';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col justify-start items-center w-full overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:p-6 text-center pb-2 sm:pb-4 pt-[clamp(1.5rem,4dvh,3rem)]">
      {/* Title */}
      <motion.h1
        variants={itemVariants}
        className="text-[clamp(3.25rem,10dvh,6rem)] font-black mb-[clamp(0.5rem,2dvh,1.5rem)] text-[#5B93B5] tracking-tight drop-shadow-sm leading-tight shrink-0"
      >
        {t('welcome.landing.title')}
      </motion.h1>

      {/* Logo / Lottie placeholder */}
      <motion.div
        variants={itemVariants}
        animate={{ y: [0, -8, 0] }}
        transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
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
  );
}
