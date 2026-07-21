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

export default function Welcome() {
  const { t } = useTranslation();
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
    <div className="flex-1 flex flex-col relative bg-tzipur-cream text-tzipur-brown overflow-hidden w-full h-full">
      <main className="flex-1 relative flex flex-col mt-6">
        <Swiper
          className="w-full flex-1 flex"
          onSwiper={setSwiper}
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
          dir="rtl"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center p-6 pt-2 text-center animate-fade-in">
                <div className="w-64 h-64 sm:w-72 sm:h-72 mb-8 rounded-2xl shadow-lg border border-tzipur-border flex items-center justify-center overflow-hidden bg-tzipur-sand">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                </div>
                
                <h2 className="font-serif text-2xl font-bold text-tzipur-sky mb-4">{slide.title}</h2>
                <p className="text-tzipur-brown/70 text-base leading-relaxed max-w-[320px]">
                  {slide.text}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </main>

      <footer className="p-6 pb-10 flex flex-col items-center gap-6">
        <div className="flex gap-2.5">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index ? 'w-8 bg-tzipur-sky' : 'w-2.5 bg-tzipur-border'
              }`}
            />
          ))}
        </div>

        <div className="w-full flex flex-col gap-3 mt-4">
          <button
            onClick={handleNext}
            className="w-full bg-tzipur-sky text-white py-4 rounded-2xl font-medium text-base shadow-md hover:bg-tzipur-sky/90 transition"
          >
            {activeIndex === slides.length - 1 ? t('welcome.start') : t('welcome.next')}
          </button>
        </div>
      </footer>
    </div>
  );
}
