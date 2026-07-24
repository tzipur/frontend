import type { Story } from '../types';
import type { StoryLibraryItem } from '../api/stories';
import type { ProfileData } from '../api/profile';
import { mockStories, mockParentProfile } from './mockData';

// Generate a random ID helper
const generateId = () => Math.random().toString(36).substring(2, 9);

// Convert a Story to StoryLibraryItem
export const toStoryLibraryItem = (story: Story): StoryLibraryItem => {
  return {
    id: story.id,
    status: 'completed',
    title: story.title,
    image_url: story.coverImageUrl || '',
    created_for: story.childProfileId,
    created_at: story.createdAt,
    coaching_tip: story.coachingTip,
    chapters: story.chapters.map(ch => ({ chapter_num: ch.order, title: ch.title, text: ch.content, image_url: ch.illustrationUrl })),
  };
};

class MockState {
  stories: Story[] = [...mockStories];
  drafts: Story[] = [];
  profile: ProfileData = {
    children: mockParentProfile.children.map(child => ({
      id: child.id,
      nickname: child.nickname,
      age: child.age,
      hobby: child.hobby,
      favoriteAnimal: child.favoriteAnimal,
    })),
  };

  async delay(ms: number = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Stories
  async getLibrary(): Promise<StoryLibraryItem[]> {
    await this.delay(300);
    return this.stories.map(toStoryLibraryItem);
  }

  async getStory(id: string): Promise<StoryLibraryItem> {
    await this.delay(300);
    const story = this.stories.find(s => s.id === id) || this.drafts.find(s => s.id === id);
    if (!story) throw new Error(`Story ${id} not found`);
    return toStoryLibraryItem(story);
  }

  async generateStory(brief: any): Promise<StoryLibraryItem> {
    await this.delay(3000); // simulate generation time
    const newStory: Story = {
      id: `mock-${generateId()}`,
      title: `הסיפור של ${brief.created_for || 'ילד'} (Mock)`,
      subtitle: 'סיפור חדש שנוצר אופליין',
      coverImageUrl: '',
      childProfileId: brief.created_for === 'נועם' ? 'child-001' : 'child-002',
      createdAt: new Date().toISOString(),
      inputMethod: 'write',
      parentInput: brief.incident_description || '',
      coachingTip: 'טיפ: דברו על הרגשות שעלו בסיפור.',
      chapters: [
        {
          id: 'mock-ch1',
          order: 1,
          title: 'ההתחלה',
          content: `זהו סיפור שנוצר במצב לא מקוון. ${brief.incident_description || 'משהו מעניין קרה.'}`,
          illustrationUrl: ''
        }
      ]
    };
    this.drafts.unshift(newStory);
    return toStoryLibraryItem(newStory);
  }

  async saveStory(id: string): Promise<void> {
    await this.delay(300);
    const draftIndex = this.drafts.findIndex(s => s.id === id);
    if (draftIndex !== -1) {
      const story = this.drafts.splice(draftIndex, 1)[0];
      this.stories.unshift(story);
    }
  }

  async editStory(id: string, updates: { story_title: string; story_body: string }): Promise<StoryLibraryItem> {
    await this.delay(1000);
    let index = this.stories.findIndex(s => s.id === id);
    let list = this.stories;
    
    if (index === -1) {
      index = this.drafts.findIndex(s => s.id === id);
      list = this.drafts;
    }
    
    if (index === -1) throw new Error(`Story ${id} not found`);
    
    // Simplistic mock edit
    list[index].title = updates.story_title;
    if (list[index].chapters && list[index].chapters.length > 0) {
      list[index].chapters[0].content = updates.story_body;
    }
    
    return toStoryLibraryItem(list[index]);
  }

  async deleteStory(id: string): Promise<void> {
    await this.delay(500);
    this.stories = this.stories.filter(s => s.id !== id);
  }

  // Profile
  async getProfile(): Promise<ProfileData> {
    await this.delay(300);
    return this.profile;
  }

  async updateProfile(data: ProfileData): Promise<ProfileData> {
    await this.delay(500);
    
    // Assign IDs to new children
    const newChildren = data.children.map(child => ({
      ...child,
      id: child.id || `child-${generateId()}`
    }));
    
    this.profile.children = newChildren;
    return this.profile;
  }
}

export const mockState = new MockState();
