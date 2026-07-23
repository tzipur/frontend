import { motion } from 'framer-motion';
import { useHomePage } from './hooks/useHomePage';
import HeroSection from './components/HeroSection';
import FooterActions from './components/FooterActions';

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

export default function HomePage() {
  const { handleAuth, handleGuestLogin } = useHomePage();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col fixed inset-0 h-[100svh] max-h-[100svh] overflow-hidden bg-tzipur-cream"
    >
      <HeroSection />
      <FooterActions onAuth={handleAuth} onGuest={handleGuestLogin} />
    </motion.div>
  );
}
