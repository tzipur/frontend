import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paginateChapterText } from '../../../lib/paginateChapterText';
import { useStory } from '../../../api';
import type { StoryLibraryItem } from '../../../api/stories';

export interface PageInfo {
  text: string;
  chapterTitle: string;
  isTitlePage?: boolean;
  isEndPage?: boolean;
}

interface UseReadingPageResult {
  story: StoryLibraryItem | undefined;
  isLoading: boolean;
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
  navigate: ReturnType<typeof useNavigate>;
}

const wordsPerPage: number = 20;

export function useReadingPage(): UseReadingPageResult {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = going back, 1 = going forward

  const { data: story, isLoading } = useStory(storyId || null);

  // Flatten all chapters into a single array of pages
  const pages: PageInfo[] = useMemo(() => {
    if (!story) return [];
    const result: PageInfo[] = [];
    for (const chapter of (story.chapters || [])) {
      const chapterTitle = chapter.title || `Chapter ${chapter.chapter_num}`;
      result.push({
        text: chapterTitle,
        chapterTitle: chapterTitle,
        isTitlePage: true,
      });

      const pageTexts = paginateChapterText(chapter.text, wordsPerPage);
      for (const text of pageTexts) {
        result.push({
          text,
          chapterTitle: chapterTitle,
        });
      }
    }

    result.push({
      text: '', // Text handled by translation in component
      chapterTitle: 'end',
      isEndPage: true,
    });

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

  return {
    story,
    isLoading,
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
    navigate,
  };
}
