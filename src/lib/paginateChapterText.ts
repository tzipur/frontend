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
  maxChars: number = 120
): string[] {
  const trimmed = content.trim();
  if (trimmed.length === 0) return [];
  if (trimmed.length <= maxChars) return [trimmed];

  const pages: string[] = [];
  let remaining = trimmed;

  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      pages.push(remaining.trim());
      break;
    }

    const window = remaining.slice(0, maxChars);

    // Try to find the last sentence boundary within the window
    const sentenceBoundaries = /[.,?!׃،؛]/g;
    let lastBoundaryIndex = -1;
    let match: RegExpExecArray | null;

    while ((match = sentenceBoundaries.exec(window)) !== null) {
      lastBoundaryIndex = match.index;
    }

    let splitIndex: number;

    if (lastBoundaryIndex > 0) {
      // Split after the sentence boundary character
      splitIndex = lastBoundaryIndex + 1;
    } else {
      // No sentence boundary found — split at the last space
      const lastSpaceIndex = window.lastIndexOf(' ');
      if (lastSpaceIndex > 0) {
        splitIndex = lastSpaceIndex;
      } else {
        // No space found at all — force split at maxChars (shouldn't happen with real text)
        splitIndex = maxChars;
      }
    }

    const page = remaining.slice(0, splitIndex).trim();
    if (page.length > 0) {
      pages.push(page);
    }
    remaining = remaining.slice(splitIndex).trim();
  }

  return pages;
}
