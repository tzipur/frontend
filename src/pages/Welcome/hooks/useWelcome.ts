import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Swiper as SwiperType } from 'swiper';
import { useTranslation } from 'react-i18next';

import img1 from '../../../assets/onboarding/1.jpeg';
import img2 from '../../../assets/onboarding/2.jpeg';
import img3 from '../../../assets/onboarding/3.jpeg';

const AUTOPLAY_DELAY_MS = 10000;
const slideImages = [img1, img2, img3];

export function useWelcome() {
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
  }, [swiper, activeIndex, slides.length]);

  const handleFinish = () => {
    try {
      localStorage.setItem('has_seen_onboarding', 'true');
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

  return {
    state: { slides, activeIndex, i18n },
    actions: { setSwiper, setActiveIndex, handleNext }
  };
}
