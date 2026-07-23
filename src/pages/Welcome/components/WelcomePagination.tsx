import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';

interface WelcomePaginationProps {
  slidesLength: number;
  activeIndex: number;
  onNext: () => void;
}

export default function WelcomePagination({ slidesLength, activeIndex, onNext }: WelcomePaginationProps) {
  const { t } = useTranslation();

  return (
    <footer className="px-6 pb-[clamp(1.5rem,4dvh,2.5rem)] shrink-0 flex flex-col items-center gap-[clamp(1rem,3dvh,1.5rem)] z-10">
      <div className="flex gap-2.5 mb-1 sm:mb-4">
        {Array.from({ length: slidesLength }).map((_, index) => (
          <div
            key={index}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index ? 'w-8 bg-tzipur-sky' : 'w-2.5 bg-tzipur-border'
            }`}
          />
        ))}
      </div>

      <div className="w-full flex flex-col gap-3">
        <Button fullWidth onClick={onNext}>
          {activeIndex === slidesLength - 1 ? t('welcome.start') : t('welcome.next')}
        </Button>
      </div>
    </footer>
  );
}
