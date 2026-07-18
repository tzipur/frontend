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
      {/* Title */}
      <motion.h1
        variants={itemVariants}
        className="font-serif text-4xl font-bold mb-6 text-tzipur-sky leading-relaxed"
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
        className="w-48 h-48 mb-6 flex items-center justify-center"
      >
        <img src={logoSrc} alt="Tzipur Logo" className="w-full h-full object-contain" />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        className="text-lg text-tzipur-muted mb-8 max-w-xs leading-relaxed whitespace-pre-line"
      >
        {t('welcome.landing.subtitle')}
      </motion.p>

      {/* Buttons */}
      <motion.div variants={itemVariants} className="w-full max-w-sm space-y-4 mt-auto">
        <button
          onClick={() => navigate('/auth')}
          className="w-full bg-tzipur-sky text-white py-4 rounded-2xl font-medium text-lg shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] transition-transform"
        >
          {t('welcome.landing.auth')}
        </button>

        <button
          onClick={() => navigate('/create')}
          className="w-full bg-transparent text-tzipur-muted py-2 rounded-2xl font-medium hover:text-tzipur-brown transition-colors"
        >
          {t('welcome.landing.guest')}
        </button>
      </motion.div>
    </motion.div>
  );
}
