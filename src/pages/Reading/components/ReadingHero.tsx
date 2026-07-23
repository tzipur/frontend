import heroSrc from '../../../assets/bears-story-hero.jpeg';

interface ReadingHeroProps {
  title: string;
}

export default function ReadingHero({ title }: ReadingHeroProps) {
  return (
    <div className="bg-tzipur-sand rounded-b-2xl shadow-sm relative z-10 flex flex-col items-center pb-2 mb-2">
      <div className="shrink-0 pt-[clamp(0.5rem,2dvh,1rem)] pb-2 px-6 relative z-10 text-center">
        <h1 className="font-sans font-bold tracking-tight leading-relaxed text-tzipur-sky text-center text-[clamp(1.5rem,4.5dvh,2.5rem)]">
          {title}
        </h1>
      </div>
      <div className="w-full h-[clamp(10rem,25dvh,16rem)] rounded-2xl overflow-hidden shadow-inner border border-tzipur-border shrink-0">
        <img src={heroSrc} className="w-full h-full object-cover" alt="Story Illustration" />
      </div>
    </div>
  );
}
