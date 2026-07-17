import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockStories } from '../lib/mockData';
import { paginateChapterText } from '../lib/paginateChapterText';

interface PageInfo {
  text: string;
  chapterTitle: string;
}

export default function ReadingPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = going back, 1 = going forward

  const story = mockStories.find((s) => s.id === storyId);

  // Flatten all chapters into a single array of pages
  const pages: PageInfo[] = useMemo(() => {
    if (!story) return [];
    const result: PageInfo[] = [];
    for (const chapter of story.chapters) {
      const pageTexts = paginateChapterText(chapter.content);
      for (const text of pageTexts) {
        result.push({
          text,
          chapterTitle: chapter.title,
        });
      }
    }
    return result;
  }, [story]);

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center">
        <h1 className="font-serif text-2xl text-tzipur-brown mb-4">
          הסיפור לא נמצא
        </h1>
        <Link
          to="/"
          className="text-tzipur-sky font-medium hover:underline"
        >
          חזרה לדף הבית
        </Link>
      </div>
    );
  }

  const totalPages = pages.length;
  const currentPage = pages[currentPageIndex];
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === totalPages - 1;

  // In RTL: ChevronLeft = NEXT, ChevronRight = PREVIOUS
  const goNext = () => {
    if (!isLastPage) {
      setDirection(1);
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (!isFirstPage) {
      setDirection(-1);
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? -80 : 80, // RTL: next slides from left, prev from right
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100dvh] flex flex-col relative overflow-hidden"
    >
      {/* Header — Story Title */}
      <header className="w-full text-center py-5 z-10 shrink-0">
        <h1 className="font-serif text-3xl font-bold tracking-tight leading-relaxed">
          {story.title}
        </h1>
        <p className="text-sm text-tzipur-muted mt-1">
          {currentPage?.chapterTitle}
        </p>
      </header>

      {/* Illustration Placeholder */}
      <div className="w-full h-56 px-4 z-0 -mt-2 shrink-0">
        <div className="w-full h-full bg-tzipur-sand rounded-2xl shadow-inner border border-tzipur-border flex items-center justify-center overflow-hidden">
          <span className="text-tzipur-muted text-sm font-medium">
            איור הסיפור
          </span>
        </div>
      </div>

      {/* Raised Text Panel */}
      <main className="flex-1 bg-white rounded-t-[36px] shadow-[0_-12px_40px_-15px_rgba(74,63,53,0.15)] mt-[-24px] z-20 relative px-4 pt-10 pb-8 flex flex-col justify-between border-t border-tzipur-border">
        {/* Navigation + Text */}
        <div className="flex items-center justify-between flex-1">
          {/* LEFT arrow = NEXT page (RTL) */}
          <button
            onClick={goNext}
            disabled={isLastPage}
            className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-tzipur-cream text-tzipur-brown shadow-sm border border-tzipur-border hover:bg-tzipur-sand transition ${
              isLastPage ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Story Text */}
          <div className="flex-1 px-4 text-center overflow-hidden min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.p
                key={currentPageIndex}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="font-serif text-xl leading-loose font-medium"
              >
                {currentPage?.text}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* RIGHT arrow = PREVIOUS page (RTL) */}
          <button
            onClick={goPrev}
            disabled={isFirstPage}
            className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-tzipur-cream text-tzipur-brown shadow-sm border border-tzipur-border hover:bg-tzipur-sand transition ${
              isFirstPage ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Footer — Actions & Page Counter */}
        <div className="mt-8 px-2 flex justify-between items-end shrink-0">
          <button
            onClick={() => navigate('/library')}
            className="text-sm font-medium text-tzipur-sky hover:underline bg-transparent border-0 p-0 cursor-pointer min-h-0"
          >
            שמירת הסיפור לאוסף
          </button>

          <span
            className="text-tzipur-muted font-medium text-lg font-sans"
            dir="ltr"
          >
            {currentPageIndex + 1} / {totalPages}
          </span>
        </div>
      </main>
    </motion.div>
  );
}
