import { useLayoutEffect, useRef, useState, useEffect } from 'react';

interface DynamicTextProps {
  text: string;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export default function DynamicText({ text, minSize = 24, maxSize = 72, className = '' }: DynamicTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(maxSize);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Listen for container resizes
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Binary search for perfect font size
  useLayoutEffect(() => {
    if (!containerRef.current || !textRef.current || dimensions.width === 0) return;

    let min = minSize;
    let max = maxSize;
    let bestFit = min;

    const container = containerRef.current;
    const textNode = textRef.current;

    while (min <= max) {
      const mid = Math.floor((min + max) / 2);
      textNode.style.fontSize = `${mid}px`;
      
      const isOverflowing = 
        textNode.scrollHeight > container.clientHeight || 
        textNode.scrollWidth > container.clientWidth;

      if (!isOverflowing) {
        bestFit = mid;
        min = mid + 1; // Try going bigger
      } else {
        max = mid - 1; // Need to go smaller
      }
    }

    setFontSize(bestFit);
    textNode.style.fontSize = `${bestFit}px`;
  }, [text, minSize, maxSize, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <p 
        ref={textRef} 
        style={{ fontSize: `${fontSize}px` }} 
        className={`w-full ${className}`}
      >
        {text}
      </p>
    </div>
  );
}
