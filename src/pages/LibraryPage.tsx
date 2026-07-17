import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen } from 'lucide-react';
import { mockStories, mockChildProfiles } from '../lib/mockData';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'היום';
  if (diffDays === 1) return 'אתמול';
  if (diffDays < 7) return `לפני ${diffDays} ימים`;

  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getChildNickname(childProfileId: string): string {
  const child = mockChildProfiles.find((c) => c.id === childProfileId);
  return child?.nickname ?? 'ילד/ה';
}

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
  const stories = mockStories;

  if (stories.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <header className="flex items-center justify-between p-6 pb-4 bg-white shadow-sm border-b border-tzipur-border sticky top-0 z-10">
          <h1 className="font-serif text-2xl font-bold">הספרייה שלנו</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
          <BookOpen size={64} className="text-tzipur-muted" />
          <p className="text-xl text-tzipur-muted">עדיין אין סיפורים</p>
          <button
            onClick={() => navigate('/create')}
            className="bg-tzipur-sky text-white py-3 px-8 rounded-2xl font-medium text-lg shadow-md hover:shadow-lg transition-shadow"
          >
            יצירת סיפור ראשון
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <header className="flex items-center justify-between p-6 pb-4 bg-white shadow-sm border-b border-tzipur-border sticky top-0 z-10">
        <h1 className="font-serif text-2xl font-bold">הספרייה שלנו</h1>
        <button
          onClick={() => navigate('/create')}
          className="w-10 h-10 bg-tzipur-sand rounded-full flex items-center justify-center text-tzipur-sky hover:bg-tzipur-border transition-colors"
        >
          <Plus size={20} />
        </button>
      </header>

      {/* Stories Grid */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 p-6"
      >
        <div className="grid grid-cols-2 gap-4">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              variants={cardVariants}
              onClick={() => navigate(`/read/${story.id}`)}
              className="flex flex-col gap-2 cursor-pointer group"
            >
              {/* Cover Card */}
              <div
                className={`aspect-[3/4] rounded-2xl shadow-md border border-tzipur-border flex items-center justify-center p-4 text-center group-hover:shadow-lg transition-shadow ${
                  index % 2 === 0
                    ? 'bg-gradient-to-br from-[#D7E9F5] to-tzipur-sand'
                    : 'bg-gradient-to-br from-tzipur-sand to-tzipur-border'
                }`}
              >
                <h3 className="font-serif font-bold text-lg text-tzipur-sky leading-relaxed">
                  {story.title}
                </h3>
              </div>

              {/* Meta */}
              <div className="px-1">
                <p className="font-medium text-sm">
                  {formatDate(story.createdAt)}
                </p>
                <p className="text-xs text-tzipur-muted">
                  עבור {getChildNickname(story.childProfileId)} •{' '}
                  {story.inputMethod === 'speak' ? 'דיבור' : 'כתיבה'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
