import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowRight, Menu, X, Home, PlusCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoSrc from '../assets/tzipur_logo.png';

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide back button on the root page
  const showBack = location.pathname !== '/';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { path: '/', label: 'דף הבית', icon: Home },
    { path: '/create', label: 'יצירת סיפור', icon: PlusCircle },
    { path: '/library', label: 'הספרייה שלנו', icon: BookOpen },
  ];

  return (
    <>
      <header className="w-full bg-tzipur-cream text-tzipur-brown h-16 px-4 flex items-center justify-between z-40 relative shadow-sm border-b border-tzipur-border shrink-0">
        {/* Right side (RTL Start) */}
        <div className="flex items-center z-10 w-12">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -m-2 text-tzipur-muted hover:text-tzipur-brown transition-colors"
              aria-label="Back"
            >
              <ArrowRight size={24} />
            </button>
          )}
        </div>

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Link to="/" className="flex items-center gap-2 pointer-events-auto" onClick={closeMenu}>
            <img src={logoSrc} alt="Tzipur Logo" className="w-8 h-8 object-contain" />
            <span className="font-serif font-bold text-2xl text-tzipur-sky">
              ציפור
            </span>
          </Link>
        </div>

        {/* Left side (RTL End) */}
        <div className="flex items-center justify-end z-10 w-12">
          <button
            onClick={toggleMenu}
            className="p-2 -m-2 text-tzipur-muted hover:text-tzipur-brown transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black z-30"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-0 right-0 bg-white shadow-lg border-b border-tzipur-border z-40"
            >
              <nav className="flex flex-col p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-tzipur-sand transition-colors font-medium text-tzipur-brown"
                  >
                    <item.icon size={20} className="text-tzipur-sky" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
