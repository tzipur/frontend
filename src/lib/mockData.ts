import type { Story, ChildProfile, ParentProfile } from '../types';
import mockStoriesData from './mockStories.json';

/**
 * Mock stories loaded from the static JSON file.
 * Cast to Story[] since the JSON structure matches our interface exactly.
 */
export const mockStories: Story[] = (mockStoriesData as any[]).map(story => ({
  id: story.id,
  title: story.title,
  subtitle: story.subtitle,
  coverImageUrl: story.image_url,
  childProfileId: story.created_for === 'נועם' ? 'child-001' : 'child-002',
  createdAt: story.created_at,
  inputMethod: story.inputMethod as 'speak' | 'write',
  parentInput: story.parentInput,
  coachingTip: story.coaching_tip,
  chapters: story.chapters.map((ch: any) => ({
    id: ch.id,
    order: ch.chapter_num,
    title: ch.title,
    content: ch.text,
    illustrationUrl: ch.image_url,
  }))
}));

/**
 * Mock child profiles referenced by stories.
 */
export const mockChildProfiles: ChildProfile[] = [
  {
    id: 'child-001',
    nickname: 'נועם',
    age: 4,
    hobby: 'ציור',
    favoriteAnimal: 'ציפור',
  },
  {
    id: 'child-002',
    nickname: 'מיכל',
    age: 6,
    hobby: 'ריקוד',
    favoriteAnimal: 'דוב',
  },
];

/**
 * Mock parent profile for the current "logged-in" user.
 */
export const mockParentProfile: ParentProfile = {
  id: 'parent-001',
  nickname: 'אבא',
  children: mockChildProfiles,
};
