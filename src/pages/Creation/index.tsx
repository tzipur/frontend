import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Flame, ShieldOff, CloudLightning, Hand, Eye, Waves, Cloud, UserPlus, ChevronDown, type LucideIcon } from 'lucide-react';
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
        <header className="py-2 mb-6">
          <h1 className="font-serif text-2xl font-bold text-tzipur-sky">{t('creation.title')}</h1>
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
        <main className="flex flex-1 flex-col w-full min-h-0 space-y-4 pb-2">
          {/* Fast Tracks Grid */}
          <div className="grid grid-cols-2 gap-2.5">
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
                  className={`rounded-2xl p-3 text-right flex items-center gap-3 transition-all border-2 ${
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
          <div className="flex items-center gap-4 text-tzipur-brown/70 text-base">
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
        <footer className="pt-4 pb-4 mt-auto space-y-3">
          {/* Child Selection */}
          {!isGuest && mockChildProfiles.length > 0 && (
            <div className="mb-4">
              <label htmlFor="child-select" className="block font-bold text-tzipur-sky mb-2 text-base">
                {t('creation.forWhom')}
              </label>
              <div className="relative">
                <select
                  id="child-select"
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="w-full bg-white border border-tzipur-border rounded-2xl px-5 py-4 focus:outline-none focus:border-tzipur-sky focus:ring-2 focus:ring-tzipur-sky/20 transition text-tzipur-brown font-bold text-base appearance-none cursor-pointer shadow-sm"
                >
                  {mockChildProfiles.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.nickname}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-5 text-tzipur-sky">
                  <ChevronDown size={20} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={!selectedTrack && !freeText.trim()}
            className="w-full bg-tzipur-sky text-white py-4 rounded-2xl font-medium text-base shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('creation.submit')}
          </button>

          <Disclaimer />
        </footer>
      </motion.div>
    </>
  );
}
