import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';
import { ButtonGroup } from '../../../components/ButtonGroup';

interface GuestWarningModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRegister: () => void;
}

export function GuestWarningModal({ isVisible, onClose, onRegister }: GuestWarningModalProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ opacity: 0, x: "-50%", y: "20%", scale: 0.9 }}
            animate={{ opacity: 1, x: "-50%", y: "30%", scale: 1 }}
            exit={{ opacity: 0, x: "-50%", y: "30%", scale: 0.9 }}
            className="fixed top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md bg-tzipur-surface rounded-3xl shadow-2xl z-50 p-6 border border-tzipur-border flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center justify-center text-yellow-500 shrink-0 mt-1">
                <AlertTriangle size={32} />
              </div>
              <button
                onClick={onClose}
                className="p-2 -m-2 text-tzipur-brown/50 hover:text-tzipur-brown transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-tzipur-sky mb-2">
                {t('library.guestWarning.title')}
              </h3>
              <p className="text-tzipur-brown/80">
                {t('library.guestWarning.message')}
              </p>
            </div>
            <ButtonGroup>
              <Button variant="secondary" onClick={onClose}>
                {t('library.guestWarning.dismissBtn')}
              </Button>
              <Button variant="primary" onClick={onRegister}>
                {t('library.guestWarning.registerBtn')}
              </Button>
            </ButtonGroup>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
