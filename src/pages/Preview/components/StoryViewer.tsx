import { BookOpen, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { StoryLibraryItem } from '../../../api/stories';

interface StoryViewerProps {
  story: StoryLibraryItem;
  isExpanded: boolean;
  onToggle: () => void;
}

export function StoryViewer({ story, isExpanded, onToggle }: StoryViewerProps) {
  const { t } = useTranslation();

  return (
    <div className={`bg-tzipur-surface rounded-[24px] shadow-sm border ${isExpanded ? 'border-tzipur-sky/40' : 'border-tzipur-border'} flex flex-col ${isExpanded ? 'flex-1 min-h-0' : 'shrink-0'} overflow-hidden transition-colors`}>
      <button
        onClick={onToggle}
        className="w-full shrink-0 flex items-center justify-between p-[clamp(1rem,2dvh,1.5rem)] bg-tzipur-surface text-tzipur-sky font-bold text-lg"
      >
        <div className="flex items-center gap-3">
          <BookOpen size={22} strokeWidth={2.5} />
          <span>{t('preview.storyContent', 'תוכן הסיפור')}</span>
        </div>
        <ChevronDown className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
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
  );
}
