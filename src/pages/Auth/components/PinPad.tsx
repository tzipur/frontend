import { Delete } from 'lucide-react';
import { motion } from 'framer-motion';

interface PinPadProps {
  pin: string;
  error: boolean;
  title: string;
  onKeyPress: (key: string) => void;
  onDelete: () => void;
}

export default function PinPad({ pin, error, title, onKeyPress, onDelete }: PinPadProps) {
  // By relying PURELY on height (h-full + max-h) and letting aspect-square calculate the width,
  // we completely eliminate any conflicting constraints that could squash them into ovals!
  // They will now always remain mathematically perfect circles.
  const keyBase = "h-full aspect-square max-h-[4.5rem] rounded-full flex items-center justify-center";
  const dotBase = "h-full aspect-square max-h-[4rem] rounded-full flex items-center justify-center";
  
  return (
    <div className="flex flex-col flex-1 items-center gap-4 sm:gap-6 w-full h-full max-h-[550px] min-h-0">
      {/* Label */}
      <p className={`text-sm sm:text-base font-bold text-center transition-colors duration-200 ${error ? 'text-tzipur-error' : 'text-tzipur-sky'}`}>
        {title}
      </p>

      {/* Container for the pad */}
      <div className="w-[90%] flex flex-col flex-1 justify-between min-h-0" dir="ltr">
        
        {/* Dots Row */}
        <motion.div
          className="flex w-full justify-between items-center flex-1 min-h-0 max-h-[4.5rem]"
          animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.35 }}
        >
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`${dotBase} border shadow-sm transition-colors duration-200 text-xl font-bold ${
                error
                  ? 'bg-tzipur-error/10 border-tzipur-error text-tzipur-error'
                  : pin.length > i
                    ? 'bg-tzipur-sky border-tzipur-sky text-white'
                    : 'bg-tzipur-surface border-tzipur-border'
              }`}
            />
          ))}
        </motion.div>

        {/* Numpad Rows */}
        <div className="flex flex-col flex-[4] justify-between w-full pt-4 sm:pt-6 gap-2 sm:gap-4 min-h-0">
          {/* Row 1 */}
          <div className="flex w-full justify-between items-center flex-1 min-h-0">
            {[1, 2, 3].map(key => (
              <button
                key={key}
                onClick={() => onKeyPress(String(key))}
                className={`${keyBase} bg-tzipur-surface border border-tzipur-border shadow-sm text-tzipur-brown text-xl sm:text-2xl font-semibold active:scale-95 transition-all duration-150 hover:bg-tzipur-sand hover:border-tzipur-sky/30 focus:outline-none focus:ring-2 focus:ring-tzipur-sky/20`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex w-full justify-between items-center flex-1 min-h-0">
            {[4, 5, 6].map(key => (
              <button
                key={key}
                onClick={() => onKeyPress(String(key))}
                className={`${keyBase} bg-tzipur-surface border border-tzipur-border shadow-sm text-tzipur-brown text-xl sm:text-2xl font-semibold active:scale-95 transition-all duration-150 hover:bg-tzipur-sand hover:border-tzipur-sky/30 focus:outline-none focus:ring-2 focus:ring-tzipur-sky/20`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Row 3 */}
          <div className="flex w-full justify-between items-center flex-1 min-h-0">
            {[7, 8, 9].map(key => (
              <button
                key={key}
                onClick={() => onKeyPress(String(key))}
                className={`${keyBase} bg-tzipur-surface border border-tzipur-border shadow-sm text-tzipur-brown text-xl sm:text-2xl font-semibold active:scale-95 transition-all duration-150 hover:bg-tzipur-sand hover:border-tzipur-sky/30 focus:outline-none focus:ring-2 focus:ring-tzipur-sky/20`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Row 4 */}
          <div className="flex w-full justify-between items-center flex-1 min-h-0">
            <div className={keyBase} /> {/* Empty spacer */}
            
            <button
              onClick={() => onKeyPress('0')}
              className={`${keyBase} bg-tzipur-surface border border-tzipur-border shadow-sm text-tzipur-brown text-xl sm:text-2xl font-semibold active:scale-95 transition-all duration-150 hover:bg-tzipur-sand hover:border-tzipur-sky/30 focus:outline-none focus:ring-2 focus:ring-tzipur-sky/20`}
            >
              0
            </button>
            
            <button
              onClick={onDelete}
              className={`${keyBase} text-tzipur-muted active:scale-95 transition-all duration-150 hover:bg-tzipur-sand`}
              aria-label="Delete"
            >
              <Delete size={24} />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
