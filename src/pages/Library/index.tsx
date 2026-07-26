import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { useLibrary } from './hooks/useLibrary';
import { LibraryHeader } from './components/LibraryHeader';
import { CreateBanner } from './components/CreateBanner';
import { EmptyState } from './components/EmptyState';
import { StoryCard } from './components/StoryCard';
import { GuestWarningModal } from './components/GuestWarningModal';
import { DemoThankYouModal } from './components/DemoThankYouModal';
import { DEMO_MODE } from '../../contexts/AuthContext';

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
  const {
    state,
    actions,
    t
  } = useLibrary();

  const handleCreate = () => actions.navigate('/create');
  
  if (state.isLoading) {
    return (
      <div className="h-full flex flex-col">
        <LibraryHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-tzipur-sky w-12 h-12" />
        </div>
      </div>
    );
  }

  if (state.safeStories.length === 0) {
    return <EmptyState onCreateClick={handleCreate} />;
  }

  return (
    <div className="h-full flex flex-col">
      <LibraryHeader />
      
      <CreateBanner onCreateClick={handleCreate} />

      {/* Stories Grid */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 p-6"
      >
        <div className="grid grid-cols-2 gap-4">
          {state.safeStories.map((story) => (
            <StoryCard
              key={story.story_id}
              story={story}
              onClick={() => actions.navigate(`/read/${story.story_id}`)}
              variants={cardVariants}
              createdForOnText={
                actions.getChildNickname(story.created_for) === t('library.defaultChild')
                  ? t('library.meta.createdOn', {
                      date: actions.formatDate(story.created_at)
                    })
                  : t('library.meta.createdForOn', {
                      child: actions.getChildNickname(story.created_for),
                      date: actions.formatDate(story.created_at)
                    })
              }
            />
          ))}
        </div>
      </motion.main>

      {!DEMO_MODE && (
        <GuestWarningModal
          isVisible={state.showGuestWarning}
          onClose={() => actions.setShowGuestWarning(false)}
          onRegister={() => actions.navigate('/register')}
        />
      )}

      {DEMO_MODE && <DemoThankYouModal />}
    </div>
  );
}
