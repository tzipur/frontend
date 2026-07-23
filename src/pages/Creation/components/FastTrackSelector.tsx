import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fastTracks } from '../constants';

interface FastTrackSelectorProps {
  selectedTrack: string | null;
  setSelectedTrack: (track: string | null) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function FastTrackSelector({
  selectedTrack,
  setSelectedTrack,
  isDropdownOpen,
  setIsDropdownOpen,
  dropdownRef
}: FastTrackSelectorProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Fast Tracks Select (Small Screens / Short Screens) */}
      <div className="block sm:hidden [@media(min-height:800px)]:hidden relative z-20" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-white border-2 border-tzipur-border rounded-2xl px-5 py-[clamp(0.75rem,2dvh,1rem)] flex items-center justify-between text-tzipur-brown font-bold text-sm shadow-sm"
        >
          <div className="flex items-center gap-3">
             {selectedTrack ? (
               <>
                 {(() => {
                   const track = fastTracks.find(t => t.id === selectedTrack);
                   const Icon = track?.icon || Zap;
                   return <Icon size={18} className="text-tzipur-sky shrink-0" />;
                 })()}
                 <span>{t(fastTracks.find(t => t.id === selectedTrack)?.labelKey || '')}</span>
               </>
             ) : (
               <span>{t('creation.selectTrackPlaceholder', 'בחירת רגש (אופציונלי)')}</span>
             )}
          </div>
          <ChevronDown size={18} className={`text-tzipur-sky transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
        </button>
        
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-tzipur-border rounded-2xl shadow-lg overflow-hidden flex flex-col z-30 max-h-[300px] overflow-y-auto custom-scrollbar"
            >
              {fastTracks.map((track) => {
                 const Icon = track.icon;
                 return (
                   <button
                     key={track.id}
                     onClick={() => {
                       setSelectedTrack(selectedTrack === track.id ? null : track.id);
                       setIsDropdownOpen(false);
                     }}
                     className={`flex items-center gap-3 px-5 py-3 text-right transition-colors ${selectedTrack === track.id ? 'bg-tzipur-sky/10 text-tzipur-sky' : 'text-tzipur-brown hover:bg-tzipur-cream'}`}
                   >
                     <Icon size={18} className="shrink-0" />
                     <span className="font-medium text-sm">{t(track.labelKey)}</span>
                   </button>
                 );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fast Tracks Grid (Large Screens / Tall Screens) */}
      <div className="hidden sm:grid [@media(min-height:800px)]:grid grid-cols-2 gap-[clamp(0.5rem,1.5dvh,0.625rem)]">
        {fastTracks.map((track) => {
          const Icon = track.icon;
          return (
            <motion.button
              key={track.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                setSelectedTrack(
                  selectedTrack === track.id ? null : track.id
                )
              }
              className={`rounded-2xl p-[clamp(0.5rem,1.5dvh,0.75rem)] text-right flex items-center gap-[clamp(0.25rem,1dvh,0.75rem)] transition-all border-2 ${
                selectedTrack === track.id
                  ? 'bg-tzipur-sky/20 border-tzipur-sky text-tzipur-sky'
                  : 'bg-white border-tzipur-border text-tzipur-brown hover:border-tzipur-sky'
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="font-medium text-sm">{t(track.labelKey)}</span>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
