import { useState } from 'react';
import { motion } from 'framer-motion';
import { StoryCoverPlaceholder } from '../../../components/StoryCoverPlaceholder';
import type { StoryLibraryItem } from '../../../api/stories';

interface StoryCardProps {
  story: StoryLibraryItem;
  onClick: () => void;
  variants?: any;
  createdForOnText: string;
}

export function StoryCard({ story, onClick, variants, createdForOnText }: StoryCardProps) {
  const [coverFailed, setCoverFailed] = useState(false);
  const showCover = Boolean(story.cover_image_url) && !coverFailed;

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
        {showCover ? (
          <img
            src={story.cover_image_url}
            alt={story.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <StoryCoverPlaceholder seed={story.story_id} />
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
