import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';


import img1 from '../assets/onboarding/1.jpeg';
import img2 from '../assets/onboarding/2.jpeg';
import img3 from '../assets/onboarding/3.jpeg';

const AUTOPLAY_DELAY_MS = 5000;

const slides = [
  {
    image: img1,
    title: 'שיתוף בטוח',
    text: 'ברגעים מאתגרים, רגישים, ואפילו בשינויים כמו מעבר דירה - ציפור נותנת לך מרחב בטוח לשתף מה קורה. בלי שיפוטיות. בלי בושה. רק אתם.',
  },
  {
    image: img2,
    title: 'צִיפּוּר הופכת את זה לסיפור',
    text: 'בעזרת בינה מלאכותית, השיתוף שלך הופך לסיפור מטאפורי, מותאם בדיוק לגיל ולעולם הרגשי של הילד שלך.',
  },
  {
    image: img3,
    title: 'קוראים יחד ומתחברים',
    text: 'אתם והילד יחד קוראים את הסיפור - רגע של הבנה הדדית שמחזק את הקשר ביניכם.',
  },
];

export default function Welcome() {
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
    <div className="flex-1 flex flex-col relative bg-[#FDFBF7] text-[#4A3F35] overflow-hidden w-full h-full">
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
                <div className="w-64 h-64 sm:w-72 sm:h-72 mb-8 rounded-[40px] shadow-lg border border-[#E8DED1] flex items-center justify-center overflow-hidden bg-[#F4EBE1]">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                </div>
                
                <h2 className="font-serif text-4xl font-bold text-[#5B93B5] mb-4">{slide.title}</h2>
                <p className="text-[#A39B90] text-2xl leading-relaxed max-w-[320px]">
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
                activeIndex === index ? 'w-8 bg-[#5B93B5]' : 'w-2.5 bg-[#E8DED1]'
              }`}
            />
          ))}
        </div>

        <div className="w-full flex flex-col gap-3 mt-4">
          <button
            onClick={handleNext}
            className="w-full bg-[#5B93B5] text-white py-4 rounded-2xl font-medium text-lg shadow-md hover:bg-opacity-90 transition"
          >
            {activeIndex === slides.length - 1 ? 'התחלה' : 'הבא'}
          </button>
        </div>
      </footer>
    </div>
  );
}
