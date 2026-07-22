import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import heroSrc from '../../assets/bears-story-hero.jpeg';
import { useReadingPage } from './hooks/useReadingPage';
import DynamicText from '../../components/DynamicText';
import EndPage from './components/EndPage';

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
  } = useReadingPage();
  const { t } = useTranslation();

  const pageVariants = {
    enter: (_dir: number) => ({
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col overflow-hidden bg-tzipur-cream [perspective:1000px]"
    >
      {/* First Panel: Title and Image */}
      <div className="bg-tzipur-sand rounded-b-2xl shadow-sm relative z-10 flex flex-col items-center pb-2 mb-2">
        <div className="shrink-0 pt-[clamp(0.5rem,2dvh,1rem)] pb-2 px-6 relative z-10 text-center">
          <h1 className="font-sans font-bold tracking-tight leading-relaxed text-tzipur-sky text-center text-[clamp(1.5rem,4.5dvh,2.5rem)]">
            {story.title}
          </h1>
        </div>
        <div className="w-full h-[clamp(10rem,25dvh,16rem)] rounded-2xl overflow-hidden shadow-inner border border-tzipur-border shrink-0">
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
            if (offset.x < -30 || velocity.x < -400) setTimeout(goPrev, 50);
            else if (offset.x > 30 || velocity.x > 400) setTimeout(goNext, 50);
          }}
          className="flex-1 min-h-0 overflow-hidden bg-white rounded-t-[36px] mb-2 mx-2 shadow-raised-panel z-20 relative px-2 py-4 flex flex-col justify-between border border-tzipur-border touch-pan-y"
        >
          {/* Navigation + Text Container (For Normal Pages) */}
          {!currentPage?.isEndPage ? (
            <div className="relative flex-1 min-h-0 flex flex-col w-full px-2 overflow-hidden pb-12">
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
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-tzipur-brown/70/60 font-sans font-medium text-base">
                {currentPageIndex + 1}
              </span>

              {/* Story Text */}
              <div className="flex-1 w-full flex items-center justify-center text-center px-4 relative z-0 pointer-events-none [perspective:1200px] min-h-0 overflow-hidden">
                {currentPage?.isTitlePage ? (
                  <h2 className="font-sans text-4xl sm:text-5xl font-bold text-tzipur-sky leading-[1.8] pointer-events-auto">
                    {currentPage.text}
                  </h2>
                ) : (
                  <DynamicText 
                    text={currentPage?.text || ''} 
                    minSize={18}
                    maxSize={26}
                    className="font-sans font-medium text-tzipur-brown/90 leading-[1.8]"
                  />
                )}
              </div>
            </div>
          ) : (
            /* End Page Component */
            <EndPage goPrev={goPrev} coachingTip={story.coachingTip} />
          )}
      </motion.main>
      </AnimatePresence>
    </motion.div>
  );
}
