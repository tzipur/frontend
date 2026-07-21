import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Flame, ShieldOff, CloudLightning, Hand, Eye, Waves, Cloud, ChevronDown, type LucideIcon } from 'lucide-react';
import LoaderScreen from './components/LoaderScreen';
import Disclaimer from '../../components/Disclaimer';
import { useAuth } from '../../contexts/AuthContext';
import { mockChildProfiles } from '../../lib/mockData';

const fastTracks: { id: string; icon: LucideIcon; labelKey: string }[] = [
  { id: 'startle', icon: Zap, labelKey: 'creation.tracks.startle' },
  { id: 'anger', icon: Flame, labelKey: 'creation.tracks.anger' },
  { id: 'withdrawal', icon: ShieldOff, labelKey: 'creation.tracks.withdrawal' },
  { id: 'anxiety', icon: CloudLightning, labelKey: 'creation.tracks.anxiety' },
  { id: 'touch_aversion', icon: Hand, labelKey: 'creation.tracks.touch_aversion' },
  { id: 'hypervigilance', icon: Eye, labelKey: 'creation.tracks.hypervigilance' },
  { id: 'emotional_overflow', icon: Waves, labelKey: 'creation.tracks.emotional_overflow' },
  { id: 'dissociation', icon: Cloud, labelKey: 'creation.tracks.dissociation' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function CreationPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isGuest = user?.is_anonymous || !user?.email;
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [freeText, setFreeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>(mockChildProfiles[0]?.id || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);
  const childDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (childDropdownRef.current && !childDropdownRef.current.contains(event.target as Node)) {
        setIsChildDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreate = async () => {
    setIsLoading(true);

    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.warn("Notification permission error", e);
      }
    }

    // Simulate generation time
    setTimeout(() => {
      setIsLoading(false);
      navigate('/preview/story-001');
      
      // Only send a push notification when generation is complete if the app is backgrounded
      if ('Notification' in window && Notification.permission === 'granted' && document.visibilityState === 'hidden') {
        const notif = new Notification(t('creation.loader.notificationBody') || t('creation.loader.notification'));
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      }
    }, 4500);
  };

  return (
    <>
      <LoaderScreen 
        isVisible={isLoading} 
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="page-container h-full flex flex-1 flex-col p-6"
      >
        {/* Header */}
        <header className="py-[clamp(0.25rem,1dvh,0.5rem)] mb-[clamp(0.5rem,2dvh,1.5rem)] shrink-0">
          <h1 className="font-serif text-[clamp(1.25rem,3dvh,1.5rem)] font-bold text-tzipur-sky">{t('creation.title')}</h1>
          <p className="text-tzipur-brown/70 mt-1 text-base">
            {t('creation.subtitle')}
          </p>
          {isGuest && (
            <div className="mt-3 bg-tzipur-cream/80 border border-tzipur-sky/20 rounded-xl p-3 shadow-sm text-center">
              <p className="text-sm text-tzipur-brown/90 leading-relaxed">
                {t('creation.signupHintPrefix')}
                <Link to="/auth" className="text-tzipur-sky font-bold hover:underline">
                  {t('creation.signupHintAction')}
                </Link>
              </p>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col w-full min-h-0 space-y-[clamp(0.5rem,2dvh,1rem)] pb-2">
          {/* Fast Tracks Select (Small Screens / Short Screens) */}
          <div className="block sm:hidden [@media(min-height:800px)]:hidden relative z-20" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border-2 border-tzipur-border rounded-2xl px-5 py-[clamp(0.75rem,2dvh,1rem)] flex items-center justify-between text-tzipur-brown font-bold text-sm shadow-sm"
            >
              <div className="flex items-center gap-3">
                 {selectedTrack ? (
                   <>
                     {(() => {
                       const track = fastTracks.find(t => t.id === selectedTrack);
                       const Icon = track?.icon || Zap;
                       return <Icon size={18} className="text-tzipur-sky shrink-0" />;
                     })()}
                     <span>{t(fastTracks.find(t => t.id === selectedTrack)?.labelKey || '')}</span>
                   </>
                 ) : (
                   <span>{t('creation.selectTrackPlaceholder', 'בחירת רגש (אופציונלי)')}</span>
                 )}
              </div>
              <ChevronDown size={18} className={`text-tzipur-sky transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-tzipur-border rounded-2xl shadow-lg overflow-hidden flex flex-col z-30 max-h-[300px] overflow-y-auto custom-scrollbar"
                >
                  {fastTracks.map((track) => {
                     const Icon = track.icon;
                     return (
                       <button
                         key={track.id}
                         onClick={() => {
                           setSelectedTrack(selectedTrack === track.id ? null : track.id);
                           setIsDropdownOpen(false);
                         }}
                         className={`flex items-center gap-3 px-5 py-3 text-right transition-colors ${selectedTrack === track.id ? 'bg-tzipur-sky/10 text-tzipur-sky' : 'text-tzipur-brown hover:bg-tzipur-cream'}`}
                       >
                         <Icon size={18} className="shrink-0" />
                         <span className="font-medium text-sm">{t(track.labelKey)}</span>
                       </button>
                     );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fast Tracks Grid (Large Screens / Tall Screens) */}
          <div className="hidden sm:grid [@media(min-height:800px)]:grid grid-cols-2 gap-[clamp(0.5rem,1.5dvh,0.625rem)]">
            {fastTracks.map((track) => {
              const Icon = track.icon;
              return (
                <motion.button
                  key={track.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setSelectedTrack(
                      selectedTrack === track.id ? null : track.id
                    )
                  }
                  className={`rounded-2xl p-[clamp(0.5rem,1.5dvh,0.75rem)] text-right flex items-center gap-[clamp(0.25rem,1dvh,0.75rem)] transition-all border-2 ${
                    selectedTrack === track.id
                      ? 'bg-tzipur-sky/20 border-tzipur-sky text-tzipur-sky'
                      : 'bg-white border-tzipur-border text-tzipur-brown hover:border-tzipur-sky'
                  }`}
                >
                  <Icon size={20} className="shrink-0" />
                  <span className="font-medium text-sm">{t(track.labelKey)}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-[clamp(0.5rem,2dvh,1rem)] text-tzipur-brown/70 text-[clamp(0.875rem,2dvh,1rem)] shrink-0">
            <div className="flex-1 h-px bg-tzipur-border" />
            <span>{t('creation.or')}</span>
            <div className="flex-1 h-px bg-tzipur-border" />
          </div>

          <div className="relative flex-1 min-h-0">
            <textarea
              placeholder={t('creation.freeText')}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              disabled={!!selectedTrack}
              className="absolute inset-0 w-full h-full bg-white border border-tzipur-border rounded-2xl p-4 focus:outline-none focus:border-tzipur-sky focus:ring-1 focus:ring-tzipur-sky transition resize-none text-tzipur-brown placeholder:text-tzipur-brown/70/60 disabled:bg-tzipur-cream disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </main>

        {/* Footer CTA */}
        <footer className="pt-[clamp(0.5rem,2dvh,1rem)] pb-[clamp(0.25rem,1dvh,1rem)] mt-auto space-y-[clamp(0.5rem,1.5dvh,0.75rem)] shrink-0">
          {/* Child Selection */}
          {!isGuest && mockChildProfiles.length > 0 && (
            <div className="mb-[clamp(0.5rem,1.5dvh,1rem)]">
              <label className="block font-bold text-tzipur-sky mb-2 text-base">
                {t('creation.forWhom')}
              </label>
              <div className="relative z-20" ref={childDropdownRef}>
                <button
                  onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
                  className="w-full bg-white border border-tzipur-border rounded-2xl px-5 py-[clamp(0.5rem,1.5dvh,1rem)] flex items-center justify-between focus:outline-none focus:border-tzipur-sky focus:ring-2 focus:ring-tzipur-sky/20 transition text-tzipur-brown font-bold text-base shadow-sm"
                >
                  <span>
                    {mockChildProfiles.find(c => c.id === selectedChild)?.nickname || ''}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`text-tzipur-sky transition-transform ${isChildDropdownOpen ? 'rotate-180' : ''}`} 
                    strokeWidth={2.5} 
                  />
                </button>
                
                <AnimatePresence>
                  {isChildDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-tzipur-border rounded-2xl shadow-lg overflow-hidden flex flex-col z-30 max-h-[200px] overflow-y-auto custom-scrollbar"
                    >
                      {mockChildProfiles.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => {
                            setSelectedChild(child.id);
                            setIsChildDropdownOpen(false);
                          }}
                          className={`px-5 py-3 text-right transition-colors ${
                            selectedChild === child.id 
                              ? 'bg-tzipur-sky/10 text-tzipur-sky font-bold' 
                              : 'text-tzipur-brown hover:bg-tzipur-cream font-medium'
                          }`}
                        >
                          {child.nickname}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={!selectedTrack && !freeText.trim()}
            className="w-full bg-tzipur-sky text-white py-[clamp(0.75rem,2dvh,1rem)] rounded-2xl font-medium text-base shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('creation.submit')}
          </button>

          <Disclaimer />
        </footer>
      </motion.div>
    </>
  );
}
