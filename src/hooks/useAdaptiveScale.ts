import { useLayoutEffect, useState } from 'react';

/**
 * Calculates a linear scale factor based on the physical height of a container element.
 * Perfect for smoothly scaling UI elements up or down to fit tightly constrained vertical spaces (e.g. mobile screens).
 * 
 * @param ref - React ref pointing to the container element to measure
 * @param baseHeight - The optimal "1.0x scale" height in pixels (e.g., the height of an iPhone XR container)
 * @param minScale - The absolute minimum scale factor (default: 0.65)
 * @param maxScale - The absolute maximum scale factor (default: 1.3)
 * @returns The calculated scale factor to be used in inline styles
 */
export function useAdaptiveScale(
  ref: React.RefObject<HTMLElement | null>,
  baseHeight: number = 350,
  minScale: number = 0.65,
  maxScale: number = 1.3
) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      if (height > 0) {
        // Linearly calculate scale, but clamp it between minScale and maxScale
        const calculatedScale = Math.min(Math.max(height / baseHeight, minScale), maxScale);
        setScale(calculatedScale);
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, baseHeight, minScale, maxScale]);

  return scale;
}
