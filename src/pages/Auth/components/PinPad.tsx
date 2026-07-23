import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';

interface PinPadProps {
  pin: string;
  error: boolean;
  onKeyPress: (num: string) => void;
  onDelete: () => void;
  title: string;
}

export default function PinPad({ pin, error, onKeyPress, onDelete, title }: PinPadProps) {
  return (
    <div className="w-full max-w-[340px] flex flex-col items-center mx-auto">
      <p className={`text-center text-[clamp(1.1rem,3dvh,1.35rem)] mb-[clamp(0.75rem,2dvh,1.25rem)] font-bold transition-colors ${error ? 'text-tzipur-error' : 'text-tzipur-sky'}`}>
        {title}
      </p>
      
      <motion.div 
        className="flex justify-between w-[85%] mb-[clamp(0.75rem,2.5dvh,2rem)]" 
        dir="ltr"
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`w-[clamp(2rem,6dvh,3.5rem)] h-[clamp(2rem,6dvh,3.5rem)] rounded-full border-[3px] transition-colors ${error ? 'border-tzipur-error bg-tzipur-error-bg' : pin.length > i ? 'bg-tzipur-sky border-tzipur-sky' : 'border-tzipur-border bg-white'}`} />
        ))}
      </motion.div>

      <div className="grid grid-cols-3 place-items-center gap-y-[clamp(0.25rem,1.5dvh,1.25rem)] gap-x-[clamp(1rem,4vw,2.5rem)] w-full text-lg sm:text-2xl font-medium" dir="ltr">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} onClick={() => onKeyPress(num.toString())} className="w-[clamp(3rem,8.5dvh,4.5rem)] h-[clamp(3rem,8.5dvh,4.5rem)] rounded-full bg-white shadow-sm border border-tzipur-border flex items-center justify-center active:scale-95 transition-transform text-tzipur-sky hover:bg-tzipur-sand">
            {num}
          </button>
        ))}
        <div />
        <button onClick={() => onKeyPress('0')} className="w-[clamp(3rem,8.5dvh,4.5rem)] h-[clamp(3rem,8.5dvh,4.5rem)] rounded-full bg-white shadow-sm border border-tzipur-border flex items-center justify-center active:scale-95 transition-transform text-tzipur-sky hover:bg-tzipur-sand">
          0
        </button>
        <button onClick={onDelete} className="w-[clamp(3rem,8.5dvh,4.5rem)] h-[clamp(3rem,8.5dvh,4.5rem)] rounded-full bg-transparent flex items-center justify-center active:scale-95 transition-transform text-tzipur-brown/70 hover:bg-tzipur-sand">
          <Delete size={32} />
        </button>
      </div>
    </div>
  );
}
