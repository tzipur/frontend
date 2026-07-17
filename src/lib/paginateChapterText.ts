/**
 * paginateChapterText — Frontend pagination for Hebrew story text.
 *
 * Splits chapter content into smaller page strings suitable for the
 * Reading Screen carousel. Respects word boundaries and attempts to
 * break at natural sentence boundaries.
 *
 * @param content The full chapter text string.
 * @param maxChars Maximum characters per page (default 120).
 * @returns An array of page strings.
 */
export function paginateChapterText(
  content: string,
  maxWords: number = 20
): string[] {
  const words = content.trim().split(/\s+/);
  if (words.length === 0) return [];

  const pages: string[] = [];
  let currentIndex = 0;

  while (currentIndex < words.length) {
    let endIndex = currentIndex + maxWords;

    if (endIndex >= words.length) {
      pages.push(words.slice(currentIndex).join(' '));
      break;
    }

    // Try to find a sentence boundary within the last 15 words of this chunk
    let splitIndex = endIndex;
    for (let i = endIndex - 1; i >= currentIndex + 15; i--) {
      const word = words[i];
      if (/[.,?!׃،؛]$/.test(word)) {
        splitIndex = i + 1;
        break;
      }
    }

    pages.push(words.slice(currentIndex, splitIndex).join(' '));
    currentIndex = splitIndex;
  }

  return pages;
}
