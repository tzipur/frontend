import { api } from './api';

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
    const response = await api.post<AuthResponse>('/users/login', data);
    return response.data;
  },
  register: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', data);
    return response.data;
  },
};
