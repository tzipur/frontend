import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStories } from '../../../lib/mockData';
import { paginateChapterText } from '../../../lib/paginateChapterText';
import type { Story } from '../../../types';

export interface PageInfo {
  text: string;
  chapterTitle: string;
  isTitlePage?: boolean;
}

interface UseReadingPageResult {
  story: Story | undefined;
  pages: PageInfo[];
  currentPageIndex: number;
  direction: number;
  totalPages: number;
  currentPage: PageInfo | undefined;
  isFirstPage: boolean;
  isLastPage: boolean;
  wordsPerPage: number;
  goNext: () => void;
  goPrev: () => void;
  getFontSizeClass: (text: string) => string;
  navigate: ReturnType<typeof useNavigate>;
}

const wordsPerPage: number = 30

export function useReadingPage(): UseReadingPageResult {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = going back, 1 = going forward

  const story = useMemo(() => mockStories.find((s) => s.id === storyId), [storyId]);

  // Flatten all chapters into a single array of pages
  const pages: PageInfo[] = useMemo(() => {
    if (!story) return [];
    const result: PageInfo[] = [];
    for (const chapter of story.chapters) {
      result.push({
        text: chapter.title,
        chapterTitle: chapter.title,
        isTitlePage: true,
      });

      const pageTexts = paginateChapterText(chapter.content, wordsPerPage);
      for (const text of pageTexts) {
        result.push({
          text,
          chapterTitle: chapter.title,
        });
      }
    }
    return result;
  }, [story, wordsPerPage]);

  const totalPages = pages.length;
  const currentPage = pages[currentPageIndex];
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === totalPages - 1;

  // In RTL: dragging left = NEXT, dragging right = PREVIOUS
  const goNext = () => {
    if (!isLastPage) {
      setDirection(1);
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (!isFirstPage) {
      setDirection(-1);
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len < 25) return 'text-6xl leading-relaxed';
    if (len < 50) return 'text-5xl leading-relaxed';
    if (len < 80) return 'text-4xl leading-relaxed';
    if (len < 120) return 'text-3xl leading-relaxed';
    return 'text-3xl leading-relaxed';
  };

  return {
    story,
    pages,
    currentPageIndex,
    direction,
    totalPages,
    currentPage,
    isFirstPage,
    isLastPage,
    wordsPerPage,
    goNext,
    goPrev,
    getFontSizeClass,
    navigate,
  };
}
