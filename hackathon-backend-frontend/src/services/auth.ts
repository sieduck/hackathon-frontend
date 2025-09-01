import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export const authService = {
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async signOut() {
    return supabase.auth.signOut();
  }
};