import type { Story, ChildProfile, ParentProfile } from '../types';
import mockStoriesData from './mockStories.json';

/**
 * Mock stories loaded from the static JSON file.
 * Cast to Story[] since the JSON structure matches our interface exactly.
 */
export const mockStories: Story[] = mockStoriesData as Story[];

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
