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
      className="flex flex-col items-center justify-between h-full p-6 text-center pb-12 pt-8"
    >
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
        className="w-40 h-40 mb-8 bg-tzipur-sand rounded-full flex items-center justify-center shadow-inner border border-tzipur-border p-4"
      >
        <img src={logoSrc} alt="Tzipur Logo" className="w-full h-full object-contain" />
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={itemVariants}
        className="font-serif text-4xl font-bold mb-4 text-tzipur-sky leading-relaxed"
      >
        {t('welcome.landing.title')}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        className="text-lg text-tzipur-muted mb-12 max-w-xs leading-relaxed whitespace-pre-line"
      >
        {t('welcome.landing.subtitle')}
      </motion.p>

      {/* Buttons */}
      <motion.div variants={itemVariants} className="w-full max-w-sm space-y-4 mt-auto">
        <button
          onClick={() => navigate('/profile')}
          className="w-full bg-tzipur-sky text-white py-4 rounded-2xl font-medium text-lg shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] transition-transform"
        >
          {t('welcome.landing.personalize')}
        </button>

        <button
          onClick={() => navigate('/create')}
          className="w-full bg-transparent border-2 border-tzipur-sky text-tzipur-sky py-4 rounded-2xl font-medium text-lg hover:bg-tzipur-sand transition-colors active:scale-[0.98] transition-transform"
        >
          {t('welcome.landing.guest')}
        </button>
      </motion.div>
    </motion.div>
  );
}
