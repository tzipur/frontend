import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';

interface LoaderScreenProps {
  isVisible: boolean;
}

export default function LoaderScreen({ isVisible }: LoaderScreenProps) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 bg-tzipur-cream flex flex-col items-center justify-center p-6 text-center"
        >
          {/* Top notification banner */}
          <div className="absolute top-8 w-full px-6 flex justify-center">
            <div className="bg-tzipur-sand text-tzipur-sky text-sm px-4 py-2 rounded-full shadow-sm border border-tzipur-border flex items-center gap-2">
              <Bell size={16} />
              <span>{t('creation.loader.notification')}</span>
            </div>
          </div>

          {/* Breathing animation */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-12">
            {/* Outer glow */}
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-[#D7E9F5] rounded-full blur-xl"
            />
            {/* Inner core */}
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-10 w-24 h-24 bg-tzipur-sky rounded-full shadow-lg flex items-center justify-center"
            >
              <span className="text-white text-3xl">🐦</span>
            </motion.div>
          </div>

          {/* Calming copy */}
          <h2 className="text-2xl font-medium mb-3">
            {t('creation.loader.title')}
          </h2>
          <p className="text-tzipur-muted text-lg max-w-[250px] leading-relaxed whitespace-pre-line">
            {t('creation.loader.subtitle')}
          </p>

          {/* Progress bar */}
          <div className="w-48 h-1.5 bg-tzipur-border rounded-full mt-10 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: 'linear' }}
              className="h-full bg-tzipur-sky rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
