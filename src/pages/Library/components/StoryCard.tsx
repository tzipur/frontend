import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import fallbackImage from '../../../assets/bears-story-hero.jpeg';
import type { StoryLibraryItem } from '../../../api/stories';

const getSeededRandom = (seed: number) => {
  return () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
};

const generateUniqueGradient = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const random = getSeededRandom(hash);
  
  const hue1 = Math.floor(random() * 360);
  const hue2 = (hue1 + 30 + Math.floor(random() * 60)) % 360;
  
  // Pastel, relaxing colors: high lightness, medium saturation
  const s1 = 60 + Math.floor(random() * 30); 
  const s2 = 60 + Math.floor(random() * 30);
  const l1 = 80 + Math.floor(random() * 10); 
  const l2 = 80 + Math.floor(random() * 10);
  
  const angle = 100 + Math.floor(random() * 80); 
  
  return `linear-gradient(${angle}deg, hsl(${hue1}, ${s1}%, ${l1}%), hsl(${hue2}, ${s2}%, ${l2}%))`;
};

interface StoryCardProps {
  story: StoryLibraryItem;
  onClick: () => void;
  variants?: any;
  createdForOnText: string;
}

export function StoryCard({ story, onClick, variants, createdForOnText }: StoryCardProps) {
  return (
    <motion.div
      variants={variants}
      onClick={onClick}
      className="flex flex-col gap-2 cursor-pointer group"
    >
      {/* Cover Card */}
      <div
        className="aspect-[3/4] rounded-2xl shadow-md border border-tzipur-border overflow-hidden relative group-hover:shadow-lg transition-shadow bg-tzipur-sand"
      >
        {story.image_url ? (
          <img 
            src={story.image_url} 
            alt={story.title} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
            style={{ backgroundImage: generateUniqueGradient(story.id) }}
          >
            <Sparkles size={36} className="text-white/80 mb-2 drop-shadow-sm" />
            <BookOpen size={48} className="text-white/60 drop-shadow-sm" />
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="px-1 mt-1">
        <h3 className="font-serif font-bold text-lg text-tzipur-sky leading-tight mb-1">
          {story.title}
        </h3>
        <p className="font-medium text-sm text-tzipur-brown/80 mb-0.5">
          {createdForOnText}
        </p>
      </div>
    </motion.div>
  );
}
