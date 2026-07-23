import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, Edit3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStory, useEditStory } from '../../api';
import Disclaimer from '../../components/Disclaimer';
import LoaderScreen from '../Creation/components/LoaderScreen';
import { Button } from '../../components/Button';
import { ButtonGroup } from '../../components/ButtonGroup';

export default function PreviewPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: story, isLoading } = useStory(storyId || null);
  const editMutation = useEditStory();

  const [editRequest, setEditRequest] = useState('');
  const [remainingEdits, setRemainingEdits] = useState(3);
  const [isStoryExpanded, setIsStoryExpanded] = useState(true);
  const [isEditExpanded, setIsEditExpanded] = useState(false);

  if (isLoading) {
    return (
      <LoaderScreen isVisible={true} mode="edit" />
    );
  }

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

  const handleSendEdits = () => {
    if (!storyId || !editRequest.trim()) return;
    
    // Stitch chapters together for the backend payload
    const stitchedBody = (story.chapters || []).map((c: any) => c.text).join('\n\n');
    
    const payload = {
      story_title: story.title,
      story_body: stitchedBody,
      edit_instructions: editRequest,
    };

    editMutation.mutate(
      { storyId, data: payload },
      {
        onSuccess: () => {
          setEditRequest('');
          setRemainingEdits((prev) => Math.max(0, prev - 1));
        },
        onError: (e) => {
          console.error('Failed to regenerate story', e);
        }
      }
    );
  };

  return (
    <>
      <LoaderScreen
        isVisible={editMutation.isPending}
        mode="edit"
      />

    <div className="absolute inset-0 flex flex-col bg-tzipur-cream overflow-hidden">
      {/* Header */}
      <header className="py-[clamp(0.5rem,1.5dvh,1rem)] px-4 shrink-0 bg-tzipur-sand rounded-b-[40px] shadow-sm z-10 flex flex-col items-center text-center">
        <h1 className="font-serif text-2xl font-bold text-tzipur-sky">
          {t('preview.title')}
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pb-2 relative z-0 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col gap-[clamp(0.75rem,2dvh,1rem)] min-h-0 overflow-hidden">
          
          {/* Story Accordion */}
          <div className={`bg-white rounded-[24px] shadow-sm border ${isStoryExpanded ? 'border-tzipur-sky/40' : 'border-tzipur-border'} flex flex-col ${isStoryExpanded ? 'flex-1 min-h-0' : 'shrink-0'} overflow-hidden transition-colors`}>
            <button
              onClick={() => setIsStoryExpanded(prev => !prev)}
              className="w-full shrink-0 flex items-center justify-between p-[clamp(1rem,2dvh,1.5rem)] bg-white text-tzipur-sky font-bold text-lg"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={22} strokeWidth={2.5} />
                <span>{t('preview.storyContent', 'תוכן הסיפור')}</span>
              </div>
              <ChevronDown className={`transition-transform duration-300 ${isStoryExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isStoryExpanded && (
              <div className="p-[clamp(1rem,3dvh,1.5rem)] pt-0 flex flex-col gap-[clamp(1.25rem,3dvh,2rem)] border-t border-tzipur-border/30 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                {(story.chapters || []).map((chapter: any) => (
                  <div key={chapter.chapter_num} className="flex flex-col gap-2 shrink-0">
                    <h4 className="text-xl font-bold text-tzipur-sky mb-1">
                      {chapter.title || `Chapter ${chapter.chapter_num}`}
                    </h4>
                    <p className="text-tzipur-brown leading-loose whitespace-pre-wrap break-words text-[clamp(1rem,2.5dvh,1.125rem)] font-medium">
                      {chapter.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Accordion */}
          <div className={`bg-white rounded-[24px] shadow-sm border ${isEditExpanded ? 'border-tzipur-sky/40' : 'border-tzipur-border'} flex flex-col shrink-0 overflow-hidden transition-colors`}>
            <button
              onClick={() => setIsEditExpanded(prev => !prev)}
              className="w-full flex items-center justify-between p-[clamp(1rem,2dvh,1.5rem)] bg-white text-tzipur-sky font-bold text-lg"
            >
              <div className="flex items-center gap-3">
                <Edit3 size={22} strokeWidth={2.5} />
                <span>{t('preview.editStoryTitle', 'עריכת הסיפור')}</span>
              </div>
              <div className="flex items-center gap-3 pl-1 shrink-0">
                <span className="text-[clamp(0.75rem,1.5dvh,0.875rem)] font-bold text-tzipur-sky opacity-80 bg-tzipur-sky/10 px-2 py-0.5 rounded-xl shrink-0">
                    {t('preview.remainingEdits', { count: remainingEdits })}
                </span>
                <ChevronDown className={`transition-transform duration-300 ${isEditExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {isEditExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-[clamp(1rem,2dvh,1.5rem)] pb-[clamp(1rem,2dvh,1.5rem)] pt-3 border-t border-tzipur-border/30">
                    <div className="relative bg-white rounded-2xl p-[clamp(0.75rem,2dvh,1rem)] border-2 border-tzipur-sky/20 focus-within:border-tzipur-sky/60 transition-colors shadow-sm">
                      <textarea
                        id="edit-request"
                        value={editRequest}
                        onChange={(e) => setEditRequest(e.target.value)}
                        onFocus={() => !isEditExpanded && setIsEditExpanded(true)}
                        placeholder={t('preview.editPlaceholder')}
                        className="peer w-full h-[clamp(5rem,12dvh,6rem)] resize-none bg-transparent focus:outline-none focus:ring-0 text-tzipur-brown text-[clamp(1rem,2.5dvh,1.125rem)] font-medium placeholder:text-tzipur-brown/40 custom-scrollbar"
                      />
                      <label htmlFor="edit-request" className="absolute -top-[0.85rem] right-4 bg-white px-2 text-[clamp(0.75rem,1.5dvh,0.875rem)] font-medium text-tzipur-brown/70 cursor-pointer transition-colors peer-focus:text-tzipur-sky peer-focus:font-bold">
                        {t('preview.editLabel')}
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Disclaimer */}
      <Disclaimer />

      {/* Footer Actions */}
      <footer className="shrink-0 w-full bg-white/80 backdrop-blur-md border-t border-tzipur-border p-[clamp(0.5rem,2dvh,1rem)] shadow-footer-lift z-20">
        <ButtonGroup>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSendEdits}
            disabled={!hasEdits}
          >
            {t('preview.sendEdits')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerateStory}
            disabled={hasEdits}
            title={hasEdits ? t('preview.editBoxNotEmpty') : undefined}
          >
            {t('preview.generate')}
          </Button>
        </ButtonGroup>
      </footer>
    </div>
    </>
  );
}
