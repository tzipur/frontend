import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { mockStories } from '../../lib/mockData';

import ChapterStep from './components/ChapterStep';
import SummaryStep from './components/SummaryStep';
import WarningDialog from './components/WarningDialog';
import PreviewFooter from './components/PreviewFooter';

export default function PreviewPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const story = useMemo(() => mockStories.find((s) => s.id === storyId), [storyId]);

  const [currentStep, setCurrentStep] = useState(0);
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [showWarning, setShowWarning] = useState(false);

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center">
        <h1 className="font-serif text-2xl text-tzipur-brown mb-4">{t('reading.notFound')}</h1>
        <Link to="/" className="text-tzipur-sky font-medium hover:underline">{t('reading.backHome')}</Link>
      </div>
    );
  }

  const isSummaryStep = currentStep === story.chapters.length;
  const isLastChapter = currentStep === story.chapters.length - 1;
  const currentChapter = !isSummaryStep ? story.chapters[currentStep] : null;

  const handleNextChapter = () => {
    if (!isSummaryStep) setCurrentStep(prev => prev + 1);
  };

  const handlePrevChapter = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleReviewAll = () => {
    setCurrentStep(story.chapters.length);
  };

  const handleGenerateStory = () => {
    const hasEdits = Object.values(edits).some(v => v.trim().length > 0);
    if (hasEdits) {
      setShowWarning(true);
    } else {
      navigate(`/read/${storyId}`);
    }
  };

  const confirmGenerate = () => {
    setShowWarning(false);
    navigate(`/read/${storyId}`);
  };

  const handleSendEdits = () => {
    navigate('/create');
  };

  const handleEditChange = (index: number, val: string) => {
    setEdits(prev => ({ ...prev, [index]: val }));
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-tzipur-cream overflow-hidden">
      {/* Header */}
      <header className="py-4 px-4 shrink-0 bg-tzipur-sand rounded-b-[40px] shadow-sm z-10 flex flex-col items-center text-center">
        <h1 className="font-serif text-2xl font-bold text-tzipur-brown">
          {isSummaryStep ? t('preview.summaryTitle') : t('preview.title')}
        </h1>
        <p className="text-tzipur-sky font-medium mt-2 opacity-90 max-w-[350px]">
          {t('preview.instruction')}
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-6 relative z-0">
        <AnimatePresence mode="wait">
          {!isSummaryStep && currentChapter ? (
            <ChapterStep
              key={currentStep}
              currentStep={currentStep}
              totalChapters={story.chapters.length}
              chapter={currentChapter}
              editValue={edits[currentStep] || ''}
              onEditChange={(val) => handleEditChange(currentStep, val)}
            />
          ) : (
            <SummaryStep
              key="summary"
              chapters={story.chapters}
              edits={edits}
              onEditChange={handleEditChange}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      <PreviewFooter
        currentStep={currentStep}
        isSummaryStep={isSummaryStep}
        isLastChapter={isLastChapter}
        onNextChapter={handleNextChapter}
        onPrevChapter={handlePrevChapter}
        onReviewAll={handleReviewAll}
        onSendEdits={handleSendEdits}
        onGenerateStory={handleGenerateStory}
      />

      {/* Warning Dialog */}
      <WarningDialog
        isVisible={showWarning}
        onConfirm={confirmGenerate}
        onCancel={() => setShowWarning(false)}
      />
    </div>
  );
}
