import axios from 'axios';
import { supabase } from '../lib/supabase';

export const API_BASE_URL = 'https://backend-gfjm.onrender.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pingServer = () => {
  api.get('/health').catch(() => {
    // Ignore errors for the wake-up ping
  });
};

api.interceptors.request.use(
  async (config) => {
    // Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();

    // If we have a token, attach it to the request
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
