import { BookOpen, Sparkles } from 'lucide-react';

const getSeededRandom = (seed: number) => {
  return () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
};

const generateUniqueGradient = (id: string | undefined) => {
  let hash = 0;
  for (let i = 0; i < (id?.length ?? 0); i++) {
    hash = id!.charCodeAt(i) + ((hash << 5) - hash);
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

interface StoryCoverPlaceholderProps {
  /**
   * Seeds the gradient, so one story keeps the same colors across screens.
   * Optional because GET /users/me/stories/{id} returns no story_id -- those
   * stories all share the one zero-seed gradient rather than crashing.
   */
  seed?: string;
  iconSize?: number;
}

/**
 * Stands in for a story cover when the backend gave us no URL, or the one it
 * gave us failed to load. Deliberately generated rather than a bundled image:
 * the cover art is the backend's to serve, and a per-story gradient degrades
 * more gracefully than shipping one picture for every story.
 */
export function StoryCoverPlaceholder({ seed, iconSize = 48 }: StoryCoverPlaceholderProps) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
      style={{ backgroundImage: generateUniqueGradient(seed) }}
    >
      <Sparkles size={Math.round(iconSize * 0.75)} className="text-white/80 mb-2 drop-shadow-sm" />
      <BookOpen size={iconSize} className="text-white/60 drop-shadow-sm" />
    </div>
  );
}
