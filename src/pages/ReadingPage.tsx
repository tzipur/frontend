import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockStories } from '../lib/mockData';
import { paginateChapterText } from '../lib/paginateChapterText';
import heroSrc from '../assets/bears-story-hero.jpeg';

interface PageInfo {
  text: string;
  chapterTitle: string;
  isTitlePage?: boolean;
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
      result.push({
        text: chapter.title,
        chapterTitle: chapter.title,
        isTitlePage: true,
      });

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

  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len < 25) return 'text-4xl';
    if (len < 50) return 'text-3xl leading-relaxed';
    if (len < 80) return 'text-2xl leading-relaxed';
    if (len < 120) return 'text-xl leading-loose';
    return 'text-lg leading-loose';
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
      className="h-full flex flex-1 flex-col relative overflow-hidden overflow-y-auto pb-4 bg-tzipur-cream"
    >
      {/* First Panel: Title and Image */}
      <div className="bg-tzipur-sand rounded-b-[40px] pb-10 pt-4 px-6 shadow-sm relative z-10 flex flex-col items-center shrink-0">
        <h1 className="font-serif text-3xl font-bold tracking-tight leading-relaxed mb-4 text-tzipur-brown text-center">
          {story.title}
        </h1>
        <div className="w-full h-56 rounded-2xl overflow-hidden shadow-inner border border-tzipur-border">
          <img src={heroSrc} className="w-full h-full object-cover" alt="Story Illustration" />
        </div>
      </div>

      {/* Second Panel: Raised Text Area */}
      <main className="flex-1 bg-white rounded-[40px] mb-2 mx-2 shadow-[0_-12px_40px_-15px_rgba(74,63,53,0.15),0_12px_40px_-15px_rgba(74,63,53,0.15)] mt-[-32px] z-20 relative px-4 pt-10 pb-8 flex flex-col justify-between border border-tzipur-border">
        {/* Navigation + Text */}
        <div className="flex items-center justify-between flex-1">
          {/* RIGHT arrow = PREVIOUS page (RTL) - First in DOM goes to Right */}
          <button
            onClick={goPrev}
            disabled={isFirstPage}
            className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-tzipur-cream text-tzipur-brown shadow-sm border border-tzipur-border hover:bg-tzipur-sand transition ${
              isFirstPage ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRight size={24} />
          </button>

          {/* Story Text */}
          <div className="flex-1 px-4 text-center overflow-hidden min-h-[160px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPageIndex}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                {currentPage?.isTitlePage ? (
                  <h2 className="font-serif text-3xl font-bold text-tzipur-sky">
                    {currentPage.text}
                  </h2>
                ) : (
                  <p className={`font-serif font-medium ${getFontSizeClass(currentPage?.text || '')}`}>
                    {currentPage?.text}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* LEFT arrow = NEXT page (RTL) - Last in DOM goes to Left */}
          <button
            onClick={goNext}
            disabled={isLastPage}
            className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-tzipur-cream text-tzipur-brown shadow-sm border border-tzipur-border hover:bg-tzipur-sand transition ${
              isLastPage ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Footer — Actions & Page Counter */}
        <div className="mt-8 flex flex-col items-center shrink-0 min-h-[48px] justify-end">
          {/* Page Number (RTL: Bottom Right, LTR: Bottom Left) */}
          <span className="absolute bottom-6 start-8 text-tzipur-muted font-sans font-medium text-lg">
            {currentPageIndex + 1}
          </span>
          
          <AnimatePresence>
            {isLastPage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col items-center gap-3 overflow-hidden"
              >
                <p className="text-tzipur-sky font-medium">מקווים שנהניתם מהסיפור!</p>
                <button
                  onClick={() => navigate('/library')}
                  className="bg-tzipur-sky text-white py-3 px-8 rounded-2xl font-medium text-lg shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] transition-transform"
                >
                  שמירת הסיפור לאוסף
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}
