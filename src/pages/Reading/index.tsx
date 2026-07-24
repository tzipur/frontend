import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReadingPage } from './hooks/useReadingPage';
import ReadingHero from './components/ReadingHero';
import ReadingPanel from './components/ReadingPanel';

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
      <ReadingHero title={story.title} imageUrl={story.image_url} />
      <ReadingPanel 
        currentPageIndex={currentPageIndex}
        direction={direction}
        currentPage={currentPage}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        goNext={goNext}
        goPrev={goPrev}
        coachingTip={story.coaching_tip}
      />
    </motion.div>
  );
}
