import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EditStoryAccordionProps {
  editRequest: string;
  setEditRequest: (request: string) => void;
  remainingEdits: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function EditStoryAccordion({
  editRequest,
  setEditRequest,
  remainingEdits,
  isExpanded,
  onToggle
}: EditStoryAccordionProps) {
  const { t } = useTranslation();

  return (
    <div className={`bg-tzipur-surface rounded-[24px] shadow-sm border ${isExpanded ? 'border-tzipur-sky/40' : 'border-tzipur-border'} flex flex-col shrink-0 overflow-hidden transition-colors`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-[clamp(1rem,2dvh,1.5rem)] bg-tzipur-surface text-tzipur-sky font-bold text-lg"
      >
        <div className="flex items-center gap-3">
          <Edit3 size={22} strokeWidth={2.5} />
          <span>{t('preview.editStoryTitle', 'עריכת הסיפור')}</span>
        </div>
        <div className="flex items-center gap-3 pl-1 shrink-0">
          <span className="text-[clamp(0.75rem,1.5dvh,0.875rem)] font-bold text-tzipur-sky opacity-80 bg-tzipur-sky/10 px-2 py-0.5 rounded-xl shrink-0">
              {t('preview.remainingEdits', { count: remainingEdits })}
          </span>
          <ChevronDown className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-[clamp(1rem,2dvh,1.5rem)] pb-[clamp(1rem,2dvh,1.5rem)] pt-3 border-t border-tzipur-border/30">
              <div className="relative bg-tzipur-surface rounded-2xl p-[clamp(0.75rem,2dvh,1rem)] border-2 border-tzipur-sky/20 focus-within:border-tzipur-sky/60 transition-colors shadow-sm">
                <textarea
                  id="edit-request"
                  value={editRequest}
                  onChange={(e) => setEditRequest(e.target.value)}
                  onFocus={() => !isExpanded && onToggle()}
                  placeholder={t('preview.editPlaceholder')}
                  className="peer w-full h-[clamp(5rem,12dvh,6rem)] resize-none bg-transparent focus:outline-none focus:ring-0 text-tzipur-brown text-[clamp(1rem,2.5dvh,1.125rem)] font-medium placeholder:text-tzipur-brown/40 custom-scrollbar"
                />
                <label htmlFor="edit-request" className="absolute -top-[0.85rem] right-4 bg-tzipur-surface px-2 text-[clamp(0.75rem,1.5dvh,0.875rem)] font-medium text-tzipur-brown/70 cursor-pointer transition-colors peer-focus:text-tzipur-sky peer-focus:font-bold">
                  {t('preview.editLabel')}
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
