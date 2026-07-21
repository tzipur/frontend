import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

interface WarningDialogProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function WarningDialog({ isVisible, onConfirm, onCancel }: WarningDialogProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-[32px] p-6 shadow-xl max-w-sm w-full flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 bg-tzipur-error-bg text-tzipur-error rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-tzipur-brown mb-2">
              {t('preview.warningTitle')}
            </h3>
            <p className="text-base text-tzipur-brown/70 mb-6">
              {t('preview.warningMessage')}
            </p>
            
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className="w-full bg-tzipur-error text-white py-3 rounded-2xl font-medium shadow-sm hover:bg-tzipur-error/90 transition-colors active:scale-[0.98]"
              >
                {t('preview.warningConfirm')}
              </button>
              <button
                onClick={onCancel}
                className="w-full bg-tzipur-cream text-tzipur-brown py-3 rounded-2xl font-medium hover:bg-tzipur-border transition-colors active:scale-[0.98]"
              >
                {t('preview.warningCancel')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
