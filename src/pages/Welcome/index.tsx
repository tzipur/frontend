import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';


import img1 from '../../assets/onboarding/1.jpeg';
import img2 from '../../assets/onboarding/2.jpeg';
import img3 from '../../assets/onboarding/3.jpeg';

const AUTOPLAY_DELAY_MS = 10000;

const slideImages = [img1, img2, img3];

import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';

export default function Welcome() {
  const { t, i18n } = useTranslation();
  const tSlides = t('welcome.slides', { returnObjects: true }) as Array<{title: string, text: string}>;
  const slides = tSlides.map((slide, i) => ({ ...slide, image: slideImages[i] }));

  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    let timeoutId: number;
    if (swiper && activeIndex < slides.length - 1) {
      timeoutId = window.setTimeout(() => {
        swiper.slideNext();
      }, AUTOPLAY_DELAY_MS);
    }
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [swiper, activeIndex]);

  const handleFinish = () => {
    try {
      localStorage.setItem('tzipur_has_seen_onboarding', 'true');
    } catch (e) {
      console.warn('Failed to save onboarding state', e);
    }
    navigate('/', { replace: true });
  };

  const handleNext = () => {
    if (activeIndex === slides.length - 1) {
      handleFinish();
    } else {
      swiper?.slideNext();
    }
  };

  return (
    <div className="flex-1 flex flex-col relative bg-white text-tzipur-brown overflow-hidden w-full h-full">
      <main className="flex-1 relative flex flex-col mt-2 sm:mt-6 mb-2 overflow-hidden">
        <Swiper
          className="w-full h-full flex"
          onSwiper={setSwiper}
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
          dir={i18n.dir()}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="flex flex-col">
              <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fade-in overflow-y-auto overflow-x-hidden custom-scrollbar">
                <div className="w-[clamp(12rem,40dvh,21rem)] aspect-square mb-[clamp(1rem,4dvh,3.5rem)] rounded-[32px] shadow-xl shadow-tzipur-sky/10 border-4 border-white bg-white p-2 flex items-center justify-center overflow-hidden shrink-0 mx-auto">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover rounded-[24px]" />
                </div>
                
                <div className="shrink-0 w-full px-2 sm:px-4">
                  <h2 className="text-[clamp(1.5rem,3.5dvh,2.25rem)] sm:text-4xl font-black text-tzipur-sky mb-[clamp(0.5rem,2dvh,1rem)] drop-shadow-sm leading-tight">{slide.title}</h2>
                  <p className="text-tzipur-brown/80 text-[clamp(1.1rem,2.8dvh,1.5rem)] sm:text-3xl leading-[1.3] sm:leading-[1.6] max-w-[420px] mx-auto font-medium">
                    {slide.text}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </main>

      <footer className="px-6 pb-[clamp(1.5rem,4dvh,2.5rem)] shrink-0 flex flex-col items-center gap-[clamp(1rem,3dvh,1.5rem)] z-10">
        <div className="flex gap-2.5 mb-1 sm:mb-4">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index ? 'w-8 bg-tzipur-sky' : 'w-2.5 bg-tzipur-border'
              }`}
            />
          ))}
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button fullWidth onClick={handleNext}>
            {activeIndex === slides.length - 1 ? t('welcome.start') : t('welcome.next')}
          </Button>
        </div>
      </footer>
    </div>
  );
}
