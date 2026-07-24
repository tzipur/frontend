import { api } from './api';
import { isOffline } from '../lib/supabase';
import { getUserId } from '../contexts/AuthContext';

export interface AuthRequest {
  nickname: string;
  code?: string;
  user_id: string | null;
}

export interface AuthResponse {
  user_id: string;
  // include any other response fields if necessary
}

export const authRequests = {
  login: async (data: AuthRequest): Promise<AuthResponse> => {
    if (isOffline) {
      return { user_id: getUserId() || crypto.randomUUID() };
    }
    const response = await api.post<AuthResponse>('/users/login', data);
    return response.data;
  },
  register: async (data: AuthRequest): Promise<AuthResponse> => {
    if (isOffline) {
      return { user_id: getUserId() || crypto.randomUUID() };
    }
    const response = await api.post<AuthResponse>('/users/register', data);
    return response.data;
  },
};
