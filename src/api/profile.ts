import { api } from './api';
import type { ChildProfile } from '../types';
import { isOffline } from '../lib/supabase';
import { mockState } from '../lib/mockState';
import { getUserId } from '../contexts/AuthContext';

export interface ChildProfilePayload extends Omit<ChildProfile, 'id'> {
  id: string | null;
}

export interface ProfileData {
  children: ChildProfilePayload[];
  // Include other user preferences if any
}

export const profileRequests = {
  getProfile: async (): Promise<ProfileData> => {
    if (isOffline) return mockState.getProfile();
    const userId = getUserId() || 'guest';
    const response = await api.get<ProfileData>('/users/profile', {
      params: { user_id: userId }
    });
    return response.data;
  },

  updateProfile: async (data: ProfileData): Promise<ProfileData> => {
    if (isOffline) return mockState.updateProfile(data);
    
    const userId = getUserId() || 'guest';
    
    const backendPayload = {
      user_id: userId,
      children: data.children.map(c => ({
        child_nickname: c.nickname,
        child_user_id: c.id,
        age: c.age,
        gender: c.gender,
        favorite_animal: c.favoriteAnimal,
        interests: c.hobby ? [c.hobby] : [],
        action: "save"
      }))
    };

    await api.post('/users/profile', backendPayload);
    return data;
  },
};
