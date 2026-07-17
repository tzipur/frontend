import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic } from 'lucide-react';
import LoaderScreen from './components/LoaderScreen';

const fastTracks = [
  { id: 'anger', emoji: '🌩️', label: 'כעס וצעקות' },
  { id: 'sensory', emoji: '🌀', label: 'עומס חושי' },
  { id: 'fatigue', emoji: '🌙', label: 'עייפות גדולה' },
  { id: 'separation', emoji: '🍃', label: 'קושי בפרידה' },
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
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [freeText, setFreeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = () => {
    setIsLoading(true);
    // Simulate generation time, then navigate to the first mock story
    setTimeout(() => {
      navigate('/read/story-001');
    }, 4000);
  };

  return (
    <>
      <LoaderScreen isVisible={isLoading} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="page-container h-full flex flex-1 flex-col p-6"
      >
        {/* Header */}
        <header className="py-2 mb-6">
          <h1 className="font-serif text-3xl font-bold">מה קרה היום?</h1>
          <p className="text-tzipur-muted mt-1">
            בחרו אפשרות או ספרו במילים שלכם.
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
                <span className="font-medium">{track.label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 text-tzipur-muted text-sm">
            <div className="flex-1 h-px bg-tzipur-border" />
            <span>או</span>
            <div className="flex-1 h-px bg-tzipur-border" />
          </div>

          {/* Text Input Area */}
          <div className="relative flex-1 min-h-0">
            <textarea
              placeholder="אפשר גם לכתוב כאן בכמה מילים..."
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
            יצירת סיפור
          </button>
        </footer>
      </motion.div>
    </>
  );
}
