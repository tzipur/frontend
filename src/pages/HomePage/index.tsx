import { motion } from 'framer-motion';
import { useHomePage } from './hooks/useHomePage';
import HeroSection from './components/HeroSection';
import HomePageActions from './components/HomePageActions';
import Footer from '../../components/Footer';
import IosInstallBanner from '../../components/IosInstallBanner';

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
  const { handleLogin, handleRegister, handleGuestLogin } = useHomePage();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col fixed inset-0 h-[100svh] max-h-[100svh] overflow-hidden bg-tzipur-cream"
    >
      <IosInstallBanner />
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="flex flex-col flex-1 justify-around">
          <HeroSection />
          <HomePageActions onLogin={handleLogin} onRegister={handleRegister} onGuest={handleGuestLogin} />
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
