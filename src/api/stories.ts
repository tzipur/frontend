import { api } from './api';
import { isOffline } from '../lib/supabase';
import { mockState } from '../lib/mockState';

export interface StoryChapter {
  chapter_num: number;
  title: string;
  text: string;
  image_url: string;
}

export interface StoryLibraryItem {
  id: string; // Used to be storyId
  status: string;
  title: string;
  image_url: string; // Used to be coverImageLink
  created_for: string; // Used to be createdFor
  created_at: string; // Used to be createdAt
  coaching_tip?: string;
  chapters?: StoryChapter[];
}

export interface GenerateStoryPayload {
  user_id: string | null;
  story_brief: {
    selected_tags: string[];
    incident_description: string | null;
    created_for: string | null;
  };
}

export interface EditStoryPayload {
  story_title: string;
  story_body: string;
  edit_instructions: string;
  selected_animal?: string;
  animal_emoji?: string;
}

export const storyRequests = {
  getLibrary: async (userId: string): Promise<StoryLibraryItem[]> => {
    if (isOffline) return mockState.getLibrary();
    const response = await api.get<StoryLibraryItem[]>('/users/me/stories', {
      params: { user_id: userId },
    });
    return response.data;
  },

  getStory: async (storyId: string): Promise<any> => {
    if (isOffline) return mockState.getStory(storyId);
    const response = await api.get(`/users/me/story/${storyId}`);
    return response.data;
  },

  generateStory: async (data: GenerateStoryPayload): Promise<any> => {
    if (isOffline) return mockState.generateStory(data.story_brief);
    const response = await api.post('/users/me/story', data);
    return response.data;
  },

  editStory: async ({ storyId, data }: { storyId: string; data: EditStoryPayload }): Promise<any> => {
    if (isOffline) return mockState.editStory(storyId, data);
    const response = await api.put(`/users/me/story/${storyId}`, data);
    return response.data;
  },

  saveStory: async (storyId: string): Promise<void> => {
    if (isOffline) return mockState.saveStory(storyId);
    // Real implementation would go here when backend is ready
    // e.g. await api.put(`/users/me/story/${storyId}/save`);
  },

  deleteStory: async (storyId: string): Promise<void> => {
    if (isOffline) return mockState.deleteStory(storyId);
    await api.delete(`/users/me/story/${storyId}`);
  },
};
