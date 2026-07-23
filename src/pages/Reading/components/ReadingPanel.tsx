import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DynamicText from '../../../components/DynamicText';
import EndPage from './EndPage';
import type { PageInfo } from '../hooks/useReadingPage';

interface ReadingPanelProps {
  currentPageIndex: number;
  direction: number;
  currentPage: PageInfo | undefined;
  isFirstPage: boolean;
  isLastPage: boolean;
  goNext: () => void;
  goPrev: () => void;
  coachingTip?: string;
}

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

export default function ReadingPanel({
  currentPageIndex,
  direction,
  currentPage,
  isFirstPage,
  isLastPage,
  goNext,
  goPrev,
  coachingTip
}: ReadingPanelProps) {
  return (
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
          <EndPage goPrev={goPrev} coachingTip={coachingTip} />
        )}
      </motion.main>
    </AnimatePresence>
  );
}
