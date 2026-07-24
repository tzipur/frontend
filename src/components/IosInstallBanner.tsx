import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useTranslation } from 'react-i18next';

export default function IosInstallBanner() {
  const { isIos, isInstalled } = usePWAInstall();
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isIos && !isInstalled && !sessionStorage.getItem('pwa_banner_seen')) {
      const id = setTimeout(() => setShow(true), 1500);
      const autoDismiss = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('pwa_banner_seen', '1');
      }, 6500);
      return () => { clearTimeout(id); clearTimeout(autoDismiss); };
    }
  }, [isIos, isInstalled]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 inset-x-0 z-50 bg-tzipur-cream/90 text-[14px] text-tzipur-brown/70 py-1 flex items-center justify-center gap-x-1.5 leading-none shadow-sm"
          dir="rtl"
        >
          {t('components.installBanner.text')}
          <Share size={14} className="text-blue-500 mb-0.5" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
