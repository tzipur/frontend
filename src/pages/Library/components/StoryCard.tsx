import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import fallbackImage from '../../../assets/bears-story-hero.jpeg';
import type { StoryLibraryItem } from '../../../api/stories';

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
          <div className="w-full h-full flex items-center justify-center p-4 text-center">
            <BookOpen size={48} className="text-tzipur-sky/50" />
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
