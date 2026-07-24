import { api } from './api';
import type { ChildProfile } from '../types';
import { isOffline } from '../lib/supabase';
import { mockState } from '../lib/mockState';

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
    const response = await api.get<ProfileData>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileData): Promise<ProfileData> => {
    if (isOffline) return mockState.updateProfile(data);
    const response = await api.put<ProfileData>('/users/me/profile', data);
    return response.data;
  },
};
