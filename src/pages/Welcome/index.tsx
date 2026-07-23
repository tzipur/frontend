import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useWelcome } from './hooks/useWelcome';
import WelcomeSlide from './components/WelcomeSlide';
import WelcomePagination from './components/WelcomePagination';

export default function Welcome() {
  const { state, actions } = useWelcome();
  const { slides, activeIndex, i18n } = state;
  const { setSwiper, setActiveIndex, handleNext } = actions;

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
              <WelcomeSlide 
                image={slide.image} 
                title={slide.title} 
                text={slide.text} 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </main>

      <WelcomePagination 
        slidesLength={slides.length} 
        activeIndex={activeIndex} 
        onNext={handleNext} 
      />
    </div>
  );
}
