import { useTranslation } from 'react-i18next';

interface PreviewFooterProps {
  currentStep: number;
  isSummaryStep: boolean;
  isLastChapter: boolean;
  onNextChapter: () => void;
  onPrevChapter: () => void;
  onReviewAll: () => void;
  onSendEdits: () => void;
  onGenerateStory: () => void;
}

export default function PreviewFooter({
  currentStep,
  isSummaryStep,
  isLastChapter,
  onNextChapter,
  onPrevChapter,
  onReviewAll,
  onSendEdits,
  onGenerateStory,
}: PreviewFooterProps) {
  const { t } = useTranslation();

  return (
    <footer className="shrink-0 w-full bg-white/80 backdrop-blur-md border-t border-tzipur-border p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
      <div className="flex flex-col gap-3">
        {!isSummaryStep ? (
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={onPrevChapter}
                className="flex-none px-6 bg-white border border-tzipur-sky text-tzipur-sky py-3 rounded-2xl font-medium shadow-sm hover:bg-tzipur-cream transition-colors active:scale-[0.98]"
              >
                {t('preview.prevChapter')}
              </button>
            )}
            <button
              onClick={isLastChapter ? onReviewAll : onNextChapter}
              className="flex-1 bg-tzipur-sky text-white py-3 rounded-2xl font-medium shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
            >
              {isLastChapter ? t('preview.reviewAll') : t('preview.nextChapter')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={onGenerateStory}
                className="flex-1 bg-tzipur-sky text-white py-3 rounded-2xl font-medium shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
              >
                {t('preview.generate')}
              </button>
              <button
                onClick={onSendEdits}
                className="flex-1 bg-white border border-tzipur-sky text-tzipur-sky py-3 rounded-2xl font-medium shadow-sm hover:bg-tzipur-cream transition-colors active:scale-[0.98]"
              >
                {t('preview.sendEdits')}
              </button>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
