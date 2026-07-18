import { createClient } from '@supabase/supabase-js';

export const isOffline = import.meta.env.VITE_OFFLINE_MODE === 'true';

const supabaseUrl = isOffline ? 'http://localhost:54321' : import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = isOffline ? 'mock-key' : import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
