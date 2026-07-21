import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center">
        <h1 className="font-serif text-2xl text-tzipur-brown mb-4">
          {t('reading.notFound')}
        </h1>
        <Link
          to="/"
          className="text-tzipur-sky font-medium hover:underline"
        >
          {t('reading.backHome')}
        </Link>
      </div>
    );
  }

  const pageVariants = {
    enter: (dir: number) => ({
      x: 0,
      rotateY: 0,
      z: -100,
      opacity: 0,
      scale: 0.85,
      zIndex: 0,
    }),
    center: {
      x: 0,
      rotateY: 0,
      z: 0,
      opacity: 1,
      scale: 1,
      zIndex: 10,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      rotateY: dir > 0 ? 45 : -45,
      z: 100,
      opacity: 0,
      scale: 1.05,
      zIndex: 20,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-1 flex-col relative overflow-hidden overflow-y-auto pb-4 bg-tzipur-cream [perspective:1000px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {/* First Panel: Title and Image */}
      <div className="bg-tzipur-sand rounded-b-2xl pb-10 pt-4 px-6 shadow-sm relative z-10 flex flex-col items-center shrink-0">
        <h1 className="font-serif text-2xl font-bold tracking-tight leading-relaxed mb-4 text-tzipur-sky text-center">
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
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={(_e, { offset, velocity }) => {
            if (offset.x < -30 || velocity.x < -400) goPrev();
            else if (offset.x > 30 || velocity.x > 400) goNext();
          }}
          className="flex-1 bg-white rounded-t-[36px] mb-2 mx-2 shadow-raised-panel mt-[-32px] z-20 relative px-2 pt-4 pb-4 flex flex-col justify-between border border-tzipur-border touch-pan-y cursor-grab active:cursor-grabbing"
        >
          {/* Navigation + Text Container */}
          <div className="relative flex-1 flex flex-col w-full px-2 overflow-hidden pb-12">


          {/* RIGHT arrow = PREVIOUS page (RTL Start edge, bottom) */}
          <button
            onClick={goPrev}
            disabled={isFirstPage}
            className={`absolute start-4 bottom-2 z-20 p-2 text-tzipur-brown/70/50 hover:text-tzipur-brown/70 transition-colors ${
              isFirstPage ? 'opacity-0 cursor-default pointer-events-none' : ''
            }`}
          >
            <ChevronRight size={28} strokeWidth={2} />
          </button>

          {/* LEFT arrow = NEXT page (RTL End edge, bottom) */}
          <button
            onClick={goNext}
            disabled={isLastPage}
            className={`absolute end-4 bottom-2 z-20 p-2 text-tzipur-brown/70/50 hover:text-tzipur-brown/70 transition-colors ${
              isLastPage ? 'opacity-0 cursor-default pointer-events-none' : ''
            }`}
          >
            <ChevronLeft size={28} strokeWidth={2} />
          </button>

            {/* Page Number (Centered bottom) */}
            {!isLastPage && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-tzipur-brown/70/60 font-sans font-medium text-base">
            {currentPageIndex + 1}
            </span>
            )}

          {/* Story Text */}
          <div className="flex-1 w-full flex items-center justify-center text-center px-4 relative z-0 pointer-events-none [perspective:1200px]">
            {currentPage?.isTitlePage ? (
              <h2 className="font-serif text-2xl font-bold text-tzipur-sky leading-[1.8]">
                {currentPage.text}
              </h2>
            ) : currentPage?.isEndPage ? (
              <h2 className="font-serif text-5xl font-bold text-tzipur-sky leading-[1.8]">
                {t('reading.end.title')}
              </h2>
            ) : (
              <p className={`font-serif font-medium w-full ${getFontSizeClass(currentPage?.text || '')}`}>
                {currentPage?.text}
              </p>
            )}
          </div>
        </div>

        {/* Actions (Only on last page) */}
        <AnimatePresence>
          {isLastPage && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="flex flex-col items-center gap-4 overflow-hidden shrink-0 pb-12 z-20 relative px-4"
            >
              {/* Coaching Tip */}
              {story.coachingTip && (
                <div className="w-full bg-tzipur-sand/40 rounded-3xl p-5 border border-tzipur-border/50 shadow-sm relative overflow-hidden mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white p-2 rounded-full text-tzipur-sky shadow-sm border border-tzipur-sky/10">
                      <Lightbulb size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-tzipur-sky text-lg">
                      {t('reading.end.coachingTitle')}
                    </h3>
                  </div>
                  <p className="text-tzipur-brown/90 text-base leading-relaxed font-medium">
                    {story.coachingTip}
                  </p>
                </div>
              )}
              
              <button
                onClick={() => navigate('/library')}
                className="w-full bg-tzipur-sky text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] transition-transform"
              >
                {t('reading.end.save')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
      </AnimatePresence>
    </motion.div>
  );
}
