import { api } from './api';
import type { ChildProfile } from '../types';

export interface ChildProfilePayload extends Omit<ChildProfile, 'id'> {
  id: string | null;
}

export interface ProfileData {
  children: ChildProfilePayload[];
  // Include other user preferences if any
}

export const profileRequests = {
  getProfile: async (): Promise<ProfileData> => {
    const response = await api.get<ProfileData>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileData): Promise<ProfileData> => {
    const response = await api.put<ProfileData>('/users/me/profile', data);
    return response.data;
  },
};
