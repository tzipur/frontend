import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function IosInstallBanner() {
  const { isIos, isInstalled } = usePWAInstall();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show banner only if on iOS, not installed, and hasn't been dismissed recently
    if (isIos && !isInstalled) {
      const dismissed = localStorage.getItem('ios_install_dismissed');
      if (!dismissed) {
        // Small delay so it doesn't pop up instantly on first load
        const timer = setTimeout(() => setShow(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isIos, isInstalled]);

  if (!show) return null;

  const handleDismiss = () => {
    setShow(false);
    // Dismiss for 7 days
    localStorage.setItem('ios_install_dismissed', new Date().toISOString());
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="fixed bottom-4 left-4 right-4 bg-tzipur-surface rounded-xl shadow-lg border border-tzipur-border p-4 z-50 flex flex-col gap-2"
      >
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
          aria-label="Close banner"
        >
          <X size={16} />
        </button>
        
        <h3 className="font-bold text-tzipur-sky text-lg pl-6">
          התקינו את ציפור!
        </h3>
        <p className="text-tzipur-brown/90 text-sm leading-relaxed">
          לחוויה הטובה ביותר, התקינו את האפליקציה על המכשיר שלכם:
        </p>
        <div className="flex items-center gap-2 mt-1 text-sm text-tzipur-brown font-medium bg-tzipur-sand/50 p-2 rounded-lg">
          <span>1. לחצו על כפתור השיתוף</span>
          <Share size={18} className="text-blue-500 mb-1" />
          <span>בסרגל התחתון</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-tzipur-brown font-medium bg-tzipur-sand/50 p-2 rounded-lg">
          <span>2. בחרו באפשרות "Add to Home Screen"</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
