import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import logoSrc from '../../../assets/tzipur_logo.png';

interface LoaderScreenProps {
  isVisible: boolean;
  isReady?: boolean;
  onContinue?: () => void;
  mode?: 'generate' | 'edit';
}

export default function LoaderScreen({ isVisible, isReady, onContinue, mode = 'generate' }: LoaderScreenProps) {
  const { t } = useTranslation();
  const sentenceKey = mode === 'edit' ? 'creation.loader.editSentences' : 'creation.loader.sentences';
  const sentences = t(sentenceKey, { returnObjects: true }) as string[];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (!isVisible || isReady) return;

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % sentences.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible, isReady, sentences.length]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-tzipur-cream flex flex-col items-center justify-center p-6 text-center"
        >
          {!isReady ? (
            <>
              {/* Flying Bird Progress Bar */}
              <div className="w-full max-w-xs h-16 bg-tzipur-sky/10 rounded-full relative mb-12 overflow-hidden shadow-lg shadow-tzipur-sky/20 border border-tzipur-sky/20">
                {/* The filling bar */}
                <motion.div
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-tzipur-sky/40 to-tzipur-sky rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4.5, ease: "linear" }}
                />
                {/* The flying bird */}
                <motion.div
                  className="absolute top-1/2 text-2xl drop-shadow-md z-10"
                  initial={{ left: "0%", y: "-50%", x: "-50%", rotate: 0 }}
                  animate={{ 
                    left: "100%", 
                    y: ["-50%", "-85%", "-50%", "-15%", "-50%"],
                    rotate: [0, -15, 0, 15, 0]
                  }}
                  transition={{ 
                    left: { duration: 4.5, ease: "linear" },
                    y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{ transformOrigin: "center" }}
                >
                  <img src={logoSrc} alt="Loading" className="w-12 h-12 object-contain" />
                </motion.div>
              </div>

              {/* Cycling Text */}
              <div className="h-16 relative w-full mt-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex justify-center items-center"
                  >
                    <p className="font-serif text-2xl text-tzipur-brown font-medium">
                      {sentences[currentTextIndex]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="text-2xl mb-6">🎉</div>
              <h2 className="font-serif text-2xl font-bold text-tzipur-sky mb-8">
                {t('creation.loader.notification')}
              </h2>
              <button
                onClick={onContinue}
                className="bg-tzipur-sky text-white text-base px-8 py-4 rounded-2xl font-medium shadow-md hover:shadow-lg active:scale-95 transition-all"
              >
                צפייה בסיפור
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
