import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroSrc from '../../assets/bears-story-hero.jpeg';
import { useReadingPage } from './hooks/useReadingPage';

export default function ReadingPage() {
  const {
    story,
    currentPageIndex,
    direction,
    currentPage,
    isFirstPage,
    isLastPage,
    goNext,
    goPrev,
    getFontSizeClass,
    navigate,
  } = useReadingPage();

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

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: '0%',
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
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
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.main 
          key={currentPageIndex}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_e, { offset, velocity }) => {
            if (offset.x < -40 || velocity.x < -400) goNext();
            else if (offset.x > 40 || velocity.x > 400) goPrev();
          }}
          className="flex-1 bg-white rounded-[40px] mb-2 mx-2 shadow-[0_-12px_40px_-15px_rgba(74,63,53,0.15),0_12px_40px_-15px_rgba(74,63,53,0.15)] mt-[-32px] z-20 relative px-2 pt-4 pb-4 flex flex-col justify-between border border-tzipur-border touch-pan-y cursor-grab active:cursor-grabbing"
        >
          {/* Navigation + Text Container */}
          <div className="relative flex-1 flex flex-col w-full px-2 overflow-hidden pb-12">
          
          {/* INVISIBLE TAP ZONES for page turning */}
          {!isFirstPage && (
            <div 
              className="absolute inset-y-0 start-0 w-1/3 z-30 cursor-pointer" 
              onClick={goPrev} 
            />
          )}
          {!isLastPage && (
            <div 
              className="absolute inset-y-0 end-0 w-1/3 z-30 cursor-pointer" 
              onClick={goNext} 
            />
          )}

          {/* RIGHT arrow = PREVIOUS page (RTL Start edge, bottom) */}
          <button
            onClick={goPrev}
            disabled={isFirstPage}
            className={`absolute start-4 bottom-2 z-20 p-2 text-tzipur-muted/50 hover:text-tzipur-muted transition-colors ${
              isFirstPage ? 'opacity-0 cursor-default pointer-events-none' : ''
            }`}
          >
            <ChevronRight size={28} strokeWidth={2} />
          </button>

          {/* LEFT arrow = NEXT page (RTL End edge, bottom) */}
          <button
            onClick={goNext}
            disabled={isLastPage}
            className={`absolute end-4 bottom-2 z-20 p-2 text-tzipur-muted/50 hover:text-tzipur-muted transition-colors ${
              isLastPage ? 'opacity-0 cursor-default pointer-events-none' : ''
            }`}
          >
            <ChevronLeft size={28} strokeWidth={2} />
          </button>

          {/* Page Number (Centered bottom) */}
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-tzipur-muted/60 font-sans font-medium text-sm">
            {currentPageIndex + 1}
          </span>

          {/* Story Text */}
          <div className="flex-1 w-full flex items-center justify-center text-center px-4 relative z-0 pointer-events-none [perspective:1200px]">
            {currentPage?.isTitlePage ? (
              <h2 className="font-serif text-4xl font-bold text-tzipur-sky leading-[1.8]">
                {currentPage.text}
              </h2>
            ) : (
              <p className={`font-serif font-medium w-full ${getFontSizeClass(currentPage?.text || '')}`}>
                {currentPage?.text}
              </p>
            )}
          </div>
        </div>

        {/* Footer — Actions (Only on last page) */}
        <AnimatePresence>
          {isLastPage && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="flex flex-col items-center gap-3 overflow-hidden shrink-0 pb-12 z-20 relative"
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
      </motion.main>
      </AnimatePresence>
    </motion.div>
  );
}
