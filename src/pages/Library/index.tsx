import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, BookOpen, AlertTriangle, X } from 'lucide-react';
import { mockStories, mockChildProfiles } from '../../lib/mockData';
import fallbackImage from '../../assets/bears-story-hero.jpeg';
import { useAuth } from '../../contexts/AuthContext';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function LibraryPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const stories = mockStories;
  const { user } = useAuth();
  
  const isGuest = user?.is_anonymous === true;
  const shouldShowWarning = Math.random() < 0.5;
  const [showGuestWarning, setShowGuestWarning] = useState(isGuest && shouldShowWarning);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('library.dates.today');
    if (diffDays === 1) return t('library.dates.yesterday');
    if (diffDays < 7) return t('library.dates.daysAgo', { count: diffDays });

    const localeStr = i18n.language === 'he' ? 'he-IL' : 'en-US';
    return date.toLocaleDateString(localeStr, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  function getChildNickname(childProfileId: string): string {
    const child = mockChildProfiles.find((c) => c.id === childProfileId);
    return child?.nickname ?? t('library.defaultChild');
  }

  if (stories.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <header className="flex items-center justify-between p-6 pb-4 bg-white shadow-sm border-b border-tzipur-border sticky top-0 z-10">
          <h1 className="font-serif text-4xl font-bold text-tzipur-sky">{t('library.title')}</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
          <BookOpen size={64} className="text-tzipur-brown/70" />
          <p className="text-base text-tzipur-brown/70">{t('library.empty.text')}</p>
          <button
            onClick={() => navigate('/create')}
            className="bg-tzipur-sky text-white py-3 px-8 rounded-2xl font-medium text-lg shadow-md hover:shadow-lg transition-shadow"
          >
            {t('library.empty.create')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <header className="flex items-center justify-between p-6 pb-4 bg-white shadow-sm border-b border-tzipur-border sticky top-0 z-10">
        <h1 className="font-serif text-4xl font-bold text-tzipur-sky">{t('library.title')}</h1>
      </header>

      {/* Create Banner */}
      <div className="px-6 pt-6 pb-2">
        <button
          onClick={() => navigate('/create')}
          className="w-full bg-tzipur-sky text-white py-4 px-6 rounded-2xl flex items-center justify-between shadow-md active:scale-[0.98] transition-all hover:shadow-lg"
        >
          <div className="flex flex-col items-start text-start">
            <span className="font-serif font-bold text-2xl mb-0.5">{t('library.createBanner.title')}</span>
            <span className="text-white/80 text-sm font-medium">{t('library.createBanner.subtitle')}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 ms-4">
            <Plus size={20} className="text-white" />
          </div>
        </button>
      </div>

      {/* Stories Grid */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 p-6"
      >
        <div className="grid grid-cols-2 gap-4">
          {stories.map((story, _index) => (
            <motion.div
              key={story.id}
              variants={cardVariants}
              onClick={() => navigate(`/read/${story.id}`)}
              className="flex flex-col gap-2 cursor-pointer group"
            >
              {/* Cover Card */}
              <div
                className="aspect-[3/4] rounded-2xl shadow-md border border-tzipur-border overflow-hidden relative group-hover:shadow-lg transition-shadow bg-tzipur-sand"
              >
                {story.coverImageUrl ? (
                  <img 
                    src={story.coverImageUrl} 
                    alt={story.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 text-center">
                    <BookOpen size={48} className="text-tzipur-sky/50" />
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="px-1 mt-1">
                <h3 className="font-serif font-bold text-lg text-tzipur-sky leading-tight mb-1">
                  {story.title}
                </h3>
                <p className="font-medium text-sm text-tzipur-brown/80 mb-0.5">
                  {t('library.meta.createdForOn', {
                    child: getChildNickname(story.childProfileId),
                    date: formatDate(story.createdAt)
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>

      {/* Guest Warning Modal */}
      <AnimatePresence>
        {showGuestWarning && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuestWarning(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, x: "-50%", y: "20%", scale: 0.9 }}
              animate={{ opacity: 1, x: "-50%", y: "30%", scale: 1 }}
              exit={{ opacity: 0, x: "-50%", y: "30%", scale: 0.9 }}
              className="fixed top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md bg-white rounded-3xl shadow-2xl z-50 p-6 border border-tzipur-border flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center justify-center text-yellow-500 shrink-0 mt-1">
                  <AlertTriangle size={32} />
                </div>
                <button
                  onClick={() => setShowGuestWarning(false)}
                  className="p-2 -m-2 text-tzipur-brown/50 hover:text-tzipur-brown transition-colors"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-tzipur-sky mb-2">
                  {t('library.guestWarning.title')}
                </h3>
                <p className="text-tzipur-brown/80">
                  {t('library.guestWarning.message')}
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full bg-tzipur-sky text-white py-3.5 rounded-2xl font-medium text-lg shadow-md hover:shadow-lg transition-all"
                >
                  {t('library.guestWarning.registerBtn')}
                </button>
                <button
                  onClick={() => setShowGuestWarning(false)}
                  className="w-full bg-tzipur-cream text-tzipur-brown py-3.5 rounded-2xl font-medium text-lg hover:bg-tzipur-sand transition-all"
                >
                  {t('library.guestWarning.dismissBtn')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
