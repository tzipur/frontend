import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MAX_CHAPTER_HEIGHT, EDIT_BOX_HEIGHT } from '../constants';
import type { Chapter } from '../../../types';
import { ChevronDown } from 'lucide-react';

interface SummaryStepProps {
  chapters: Chapter[];
  edits: Record<number, string>;
  onEditChange: (index: number, val: string) => void;
}

export default function SummaryStep({ chapters, edits, onEditChange }: SummaryStepProps) {
  const { t } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getCleanTitle = (title: string) => {
    const parts = title.split(/[–-]/);
    return parts.length > 1 ? parts.slice(1).join('-').trim() : title;
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <motion.div
      key="summary"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {chapters.map((chapter, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <div key={chapter.id} className="bg-tzipur-surface rounded-2xl py-6 shadow-sm border border-tzipur-border shrink-0 flex flex-col">
            
            {/* Accordion Header */}
            <div 
              className="flex items-center justify-between px-6 cursor-pointer group"
              onClick={() => toggleExpand(index)}
            >
              <h3 className="font-serif text-2xl font-bold text-tzipur-sky group-hover:text-tzipur-sky-dark transition-colors">
                {t('preview.chapterCount', { current: index + 1, total: chapters.length })}: {getCleanTitle(chapter.title)}
              </h3>
              <div className="flex items-center gap-2 text-tzipur-sky opacity-80 group-hover:opacity-100 transition-opacity">
                <span className="text-base font-medium">
                  {isExpanded ? t('preview.hideChapter') : t('preview.showChapter')}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} />
                </motion.div>
              </div>
            </div>

            {/* Accordion Content */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div 
                    className="overflow-y-auto px-6 custom-scrollbar mt-4 mb-4"
                    style={{ maxHeight: MAX_CHAPTER_HEIGHT }} 
                  >
                    <p className="text-tzipur-brown leading-relaxed whitespace-pre-line text-2xl opacity-80">
                      {chapter.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Box */}
            <div className="px-6 mt-4">
              <label className="block text-base font-medium text-tzipur-brown mb-2 px-1">
                {t('preview.editLabel')}
              </label>
              <textarea
                value={edits[index] || ''}
                onChange={(e) => onEditChange(index, e.target.value)}
                className="w-full resize-none bg-tzipur-cream rounded-xl p-3 border border-tzipur-border focus:outline-none focus:border-tzipur-sky text-tzipur-brown custom-scrollbar"
                style={{ height: EDIT_BOX_HEIGHT }}
              />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
