import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mic } from 'lucide-react';
import LoaderScreen from './components/LoaderScreen';

const fastTracks = [
  { id: 'anger', emoji: '🌩️', labelKey: 'creation.tracks.anger' },
  { id: 'sensory', emoji: '🌀', labelKey: 'creation.tracks.sensory' },
  { id: 'fatigue', emoji: '🌙', labelKey: 'creation.tracks.fatigue' },
  { id: 'separation', emoji: '🍃', labelKey: 'creation.tracks.separation' },
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
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [freeText, setFreeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      
      // Always send a push notification when generation is complete
      if ('Notification' in window && Notification.permission === 'granted') {
        const notif = new Notification(t('creation.loader.notification'));
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
          <h1 className="font-serif text-3xl font-bold">{t('creation.title')}</h1>
          <p className="text-tzipur-muted mt-1">
            {t('creation.subtitle')}
          </p>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col w-full min-h-0 space-y-4 pb-2">
          {/* Fast Tracks Grid */}
          <div className="grid grid-cols-2 gap-3">
            {fastTracks.map((track) => (
              <button
                key={track.id}
                onClick={() =>
                  setSelectedTrack(
                    selectedTrack === track.id ? null : track.id
                  )
                }
                className={`rounded-2xl p-4 text-right flex flex-col gap-2 transition-all border-2 ${
                  selectedTrack === track.id
                    ? 'bg-[#D7E9F5] border-tzipur-sky text-tzipur-sky'
                    : 'bg-white border-tzipur-border text-tzipur-brown hover:border-tzipur-sky'
                }`}
              >
                <span className="text-2xl">{track.emoji}</span>
                <span className="font-medium">{t(track.labelKey)}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 text-tzipur-muted text-sm">
            <div className="flex-1 h-px bg-tzipur-border" />
            <span>{t('creation.or')}</span>
            <div className="flex-1 h-px bg-tzipur-border" />
          </div>

          {/* Text Input Area */}
          <div className="relative flex-1 min-h-0">
            <textarea
              placeholder={t('creation.freeText')}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              className="absolute inset-0 w-full h-full bg-white border border-tzipur-border rounded-2xl p-4 focus:outline-none focus:border-tzipur-sky focus:ring-1 focus:ring-tzipur-sky transition resize-none text-tzipur-brown placeholder:text-tzipur-muted/60"
            />

            {/* Mic button (disabled for MVP) */}
            <button
              disabled
              className="absolute bottom-3 left-3 w-10 h-10 bg-tzipur-sand rounded-full flex items-center justify-center text-tzipur-muted opacity-50 cursor-not-allowed border border-tzipur-border"
            >
              <Mic size={18} />
            </button>
          </div>
        </main>

        {/* Footer CTA */}
        <footer className="pt-6 pb-4 mt-auto">
          <button
            onClick={handleCreate}
            disabled={!selectedTrack && !freeText.trim()}
            className="w-full bg-tzipur-sky text-white py-4 rounded-2xl font-medium text-lg shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('creation.submit')}
          </button>
        </footer>
      </motion.div>
    </>
  );
}
