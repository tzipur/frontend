import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mockStories } from '../../lib/mockData';
import { regenerateStoryWithEdits } from '../../lib/api';
import Disclaimer from '../../components/Disclaimer';
import LoaderScreen from '../Creation/components/LoaderScreen';

export default function PreviewPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const story = useMemo(() => mockStories.find((s) => s.id === storyId), [storyId]);

  const [editRequest, setEditRequest] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [remainingEdits, setRemainingEdits] = useState(3);

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center">
        <h1 className="font-serif text-2xl text-tzipur-brown mb-4">{t('reading.notFound')}</h1>
        <Link to="/" className="text-tzipur-sky font-medium hover:underline">{t('reading.backHome')}</Link>
      </div>
    );
  }

  const getCleanTitle = (title: string) => {
    const parts = title.split(/[–-]/);
    return parts.length > 1 ? parts.slice(1).join('-').trim() : title;
  };

  const hasEdits = editRequest.trim().length > 0;

  const handleGenerateStory = () => {
    navigate(`/read/${storyId}`);
  };

  const handleSendEdits = async () => {
    if (!storyId || !editRequest.trim()) return;
    setIsRegenerating(true);
    try {
      await regenerateStoryWithEdits(storyId, editRequest);
      setEditRequest('');
      setRemainingEdits((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error('Failed to regenerate story', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <>
      <LoaderScreen
        isVisible={isRegenerating}
        mode="edit"
      />

    <div className="absolute inset-0 flex flex-col bg-tzipur-cream overflow-hidden">
      {/* Header */}
      <header className="py-[clamp(0.5rem,1.5dvh,1rem)] px-4 shrink-0 bg-tzipur-sand rounded-b-[40px] shadow-sm z-10 flex flex-col items-center text-center">
        <h1 className="font-serif text-2xl font-bold text-tzipur-sky">
          {t('preview.title')}
        </h1>
        <p className="text-tzipur-sky font-medium mt-2 opacity-90 max-w-[350px]">
          {t('preview.instruction')}
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 pt-[clamp(0.75rem,2dvh,1.5rem)] pb-[clamp(0.5rem,2dvh,1.5rem)] relative z-0 flex flex-col gap-[clamp(0.75rem,2dvh,1.5rem)] min-h-0">
        {/* Story Content */}
        <div className="bg-white rounded-2xl py-[clamp(1rem,3dvh,1.5rem)] px-[clamp(1rem,3dvh,1.5rem)] shadow-sm border border-tzipur-border flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-[clamp(0.75rem,2dvh,1.5rem)]">
          {story.chapters.map((chapter) => (
            <div key={chapter.id} className="flex flex-col gap-1 shrink-0">
              <h4 className="text-base font-bold text-tzipur-sky/80 mb-1">
                {getCleanTitle(chapter.title)}
              </h4>
              <p className="text-tzipur-brown leading-relaxed whitespace-pre-wrap break-words text-[clamp(0.875rem,2dvh,1rem)] opacity-80">
                {chapter.content}
              </p>
            </div>
          ))}
        </div>

        {/* Global Edit Box */}
        <div className="flex flex-col shrink-0">
          <div className="flex flex-col min-[400px]:flex-row justify-between items-start min-[400px]:items-center gap-2 min-[400px]:gap-0 mb-[clamp(0.25rem,1dvh,0.5rem)] sm:mb-2 px-2">
            <label className="text-[clamp(0.875rem,2dvh,1rem)] sm:text-base font-medium text-tzipur-brown leading-tight sm:leading-normal">
              {t('preview.editLabel')}
            </label>
            <span className="text-[clamp(0.75rem,1.5dvh,0.875rem)] sm:text-base font-bold text-tzipur-sky opacity-80 bg-tzipur-sky/10 px-2 py-0.5 rounded-xl shrink-0">
                {t('preview.remainingEdits', { count: remainingEdits })}
            </span>
          </div>
          <div className="bg-white rounded-2xl p-[clamp(0.5rem,2dvh,1rem)] shadow-sm border border-tzipur-border">
            <textarea
              value={editRequest}
              onChange={(e) => setEditRequest(e.target.value)}
              placeholder={t('preview.editPlaceholder')}
              className="w-full h-[clamp(4rem,10dvh,6rem)] resize-none bg-transparent focus:outline-none focus:ring-0 text-tzipur-brown placeholder:text-tzipur-brown/70/50 custom-scrollbar"
            />
          </div>
        </div>
      </main>

      {/* Disclaimer */}
      <div className="shrink-0 px-4 pt-2 pb-1 bg-tzipur-cream">
        <Disclaimer />
      </div>

      {/* Footer Actions */}
      <footer className="shrink-0 w-full bg-white/80 backdrop-blur-md border-t border-tzipur-border p-[clamp(0.5rem,2dvh,1rem)] shadow-footer-lift z-20">
        <div className="flex gap-3">
          <div
            className="flex-1"
            title={hasEdits ? t('preview.editBoxNotEmpty') : undefined}
          >
            <button
              onClick={handleGenerateStory}
              disabled={hasEdits}
              className="w-full bg-tzipur-sky text-white py-[clamp(0.5rem,2dvh,0.75rem)] rounded-2xl font-medium shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
            >
              {t('preview.generate')}
            </button>
          </div>
          <button
            onClick={handleSendEdits}
            disabled={!hasEdits}
            className="flex-1 bg-white border border-tzipur-sky text-tzipur-sky py-[clamp(0.5rem,2dvh,0.75rem)] rounded-2xl font-medium shadow-sm hover:bg-tzipur-cream transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white"
          >
            {t('preview.sendEdits')}
          </button>
        </div>
      </footer>
    </div>
    </>
  );
}
