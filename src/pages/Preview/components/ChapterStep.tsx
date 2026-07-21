import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MAX_CHAPTER_HEIGHT, EDIT_BOX_HEIGHT } from '../constants';
import type { Chapter } from '../../../types';

interface ChapterStepProps {
  currentStep: number;
  totalChapters: number;
  chapter: Chapter;
  editValue: string;
  onEditChange: (val: string) => void;
}

export default function ChapterStep({ currentStep, totalChapters, chapter, editValue, onEditChange }: ChapterStepProps) {
  const { t } = useTranslation();

  const getCleanTitle = (title: string) => {
    const parts = title.split(/[–-]/);
    return parts.length > 1 ? parts.slice(1).join('-').trim() : title;
  };

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="bg-white rounded-2xl py-6 shadow-sm border border-tzipur-border flex flex-col">
        <h2 className="font-serif text-2xl font-bold text-tzipur-sky mb-4 shrink-0 px-6">
          {t('preview.chapterCount', { current: currentStep + 1, total: totalChapters })}: {getCleanTitle(chapter.title)}
        </h2>
        <div 
          className="overflow-y-auto px-6 custom-scrollbar"
          style={{ maxHeight: MAX_CHAPTER_HEIGHT }} 
        >
          <p className="text-tzipur-brown leading-relaxed whitespace-pre-line text-2xl">
            {chapter.content}
          </p>
        </div>
      </div>

      <div className="flex flex-col shrink-0">
        <label className="block text-base font-medium text-tzipur-brown mb-2 px-2">
          {t('preview.editLabel')}
        </label>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-tzipur-border">
          <textarea
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            placeholder={t('preview.editPlaceholder')}
            className="w-full resize-none bg-transparent focus:outline-none focus:ring-0 text-tzipur-brown placeholder:text-tzipur-brown/70/50 custom-scrollbar"
            style={{ height: EDIT_BOX_HEIGHT }}
          />
        </div>
      </div>
    </motion.div>
  );
}
