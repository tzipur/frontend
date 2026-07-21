import { motion } from 'framer-motion';
import logoSrc from '../assets/tzipur_logo.png';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 overflow-hidden" dir="rtl">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-48 h-48 flex items-center justify-center"
      >
        <img src={logoSrc} alt="Tzipur Logo" className="w-full h-full object-contain filter drop-shadow-2xl" />
      </motion.div>
    </div>
  );
}
