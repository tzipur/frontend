import type { Story } from '../types';
import { mockStories } from './mockData';

/**
 * Mock API: Regenerates a story with the given edit requests.
 * In production this would call the backend with the storyId and edit text.
 * For now, simulates a delay and returns the same story.
 */
export async function regenerateStoryWithEdits(
  storyId: string,
  _editRequest: string
): Promise<Story> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const story = mockStories.find((s) => s.id === storyId);
  if (!story) {
    throw new Error(`Story not found: ${storyId}`);
  }

  // Return the same story (mock) — in production, the backend
  // would return a regenerated version based on the edit request.
  return { ...story };
}
