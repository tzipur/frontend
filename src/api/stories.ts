import { api } from './api';

export interface StoryLibraryItem {
  storyId: string;
  title: string;
  coverImageLink: string;
  createdFor: string;
  createdAt: string;
}

export interface GenerateStoryPayload {
  user_id: string;
  tags?: string[];
  user_input?: string;
  child_id?: string;
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
    const response = await api.get<StoryLibraryItem[]>('/users/me/stories', {
      params: { user_id: userId },
    });
    return response.data;
  },

  getStory: async (storyId: string): Promise<any> => {
    const response = await api.get(`/users/me/story/${storyId}`);
    return response.data;
  },

  generateStory: async (data: GenerateStoryPayload): Promise<any> => {
    const response = await api.post('/users/me/story', data);
    return response.data;
  },

  editStory: async ({ storyId, data }: { storyId: string; data: EditStoryPayload }): Promise<any> => {
    const response = await api.put(`/users/me/story/${storyId}`, data);
    return response.data;
  },

  deleteStory: async (storyId: string): Promise<void> => {
    await api.delete(`/users/me/story/${storyId}`);
  },
};
