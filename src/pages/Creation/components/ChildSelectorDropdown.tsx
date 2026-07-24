import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';


interface ChildSelectorDropdownProps {
  childrenList: any[];
  selectedChild: string;
  setSelectedChild: (childId: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function ChildSelectorDropdown({
  childrenList,
  selectedChild,
  setSelectedChild,
  isDropdownOpen,
  setIsDropdownOpen,
  dropdownRef
}: ChildSelectorDropdownProps) {
  const { t } = useTranslation();

  if (childrenList.length === 0) return null;

  return (
    <div className="mb-[clamp(0.5rem,1.5dvh,1rem)]">
      <label className="block font-bold text-tzipur-sky mb-2 text-base">
        {t('creation.forWhom')}
      </label>
      <div className="relative z-20" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-tzipur-surface border border-tzipur-border rounded-2xl px-5 py-[clamp(0.5rem,1.5dvh,1rem)] flex items-center justify-between focus:outline-none focus:border-tzipur-sky focus:ring-2 focus:ring-tzipur-sky/20 transition text-tzipur-brown font-bold text-base shadow-sm"
        >
          <span>
            {selectedChild === '' 
              ? t('creation.selectChildPlaceholder', 'ללא שיוך לילד ספציפי') 
              : (childrenList.find(c => c.id === selectedChild)?.nickname || '')}
          </span>
          <ChevronDown 
            size={20} 
            className={`text-tzipur-sky transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
            strokeWidth={2.5} 
          />
        </button>
        
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-tzipur-surface border border-tzipur-border rounded-2xl shadow-lg overflow-hidden flex flex-col z-30 max-h-[200px] overflow-y-auto custom-scrollbar"
            >
              <button
                onClick={() => {
                  setSelectedChild('');
                  setIsDropdownOpen(false);
                }}
                className={`px-5 py-3 text-right w-full transition-colors ${
                  selectedChild === '' 
                    ? 'bg-tzipur-sky/10 text-tzipur-sky font-bold' 
                    : 'text-tzipur-brown hover:bg-tzipur-cream font-medium'
                }`}
              >
                {t('creation.selectChildPlaceholder', 'ללא שיוך לילד ספציפי')}
              </button>
              {childrenList.map((child) => (
                <button
                  key={child.id}
                  onClick={() => {
                    setSelectedChild(child.id!);
                    setIsDropdownOpen(false);
                  }}
                  className={`px-5 py-3 text-right w-full transition-colors ${
                    selectedChild === child.id 
                      ? 'bg-tzipur-sky/10 text-tzipur-sky font-bold' 
                      : 'text-tzipur-brown hover:bg-tzipur-cream font-medium'
                  }`}
                >
                  {child.nickname}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
