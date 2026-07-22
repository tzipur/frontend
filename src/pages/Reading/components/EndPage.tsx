import { useTranslation } from 'react-i18next';
import { ChevronRight, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button';

interface EndPageProps {
  goPrev: () => void;
  coachingTip?: string;
}

export default function EndPage({ goPrev, coachingTip }: EndPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full flex flex-col px-2 sm:px-4 pt-2 sm:pt-4 pb-4 sm:pb-6 overflow-hidden">
      {/* Top Section - Title and Back Button */}
      <div className="flex flex-row items-center justify-center gap-3 shrink-0">
        <button
          onClick={goPrev}
          className="p-1 sm:p-1.5 text-tzipur-brown/70 hover:bg-tzipur-sand hover:text-tzipur-brown rounded-full transition-colors"
        >
          <ChevronRight className="w-[clamp(1.5rem,4dvh,2rem)] h-[clamp(1.5rem,4dvh,2rem)]" strokeWidth={2.5} />
        </button>
        <h2 className="font-sans font-bold text-tzipur-sky leading-none mb-1 text-[clamp(2rem,5dvh,3rem)]">
          {t('reading.end.title')}
        </h2>
      </div>

      {/* Middle Section - Coaching Tip */}
      {coachingTip && (
        <div className="w-full bg-tzipur-sand/40 rounded-2xl p-3 sm:p-4 border border-tzipur-border/50 shadow-sm relative overflow-hidden mb-[clamp(1rem,3dvh,2.5rem)] shrink-0 mt-auto">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div className="bg-white p-1 sm:p-1.5 rounded-full text-tzipur-sky shadow-sm border border-tzipur-sky/10">
              <Lightbulb strokeWidth={2.5} className="w-[clamp(1.25rem,3dvh,1.75rem)] h-[clamp(1.25rem,3dvh,1.75rem)]" />
            </div>
            <h3 className="font-bold text-tzipur-sky text-[clamp(1rem,3dvh,1.5rem)]">
              {t('reading.end.coachingTitle')}
            </h3>
          </div>
          <p className="text-tzipur-brown/90 font-medium leading-[1.6] text-[clamp(0.875rem,2.5dvh,1.25rem)]">
            {coachingTip}
          </p>
        </div>
      )}

      {/* Bottom Section - Save Button */}
      <Button variant="primary" fullWidth onClick={() => navigate('/library')}>
        {t('reading.end.save')}
      </Button>
    </div>
  );
}
