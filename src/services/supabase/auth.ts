import { supabase } from './client';

export const authService = {
  async signInAnonymously() {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: `anonymous_${Date.now()}@example.com`,
        password: `anon_${Date.now()}`
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  },

  async initialize() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        await this.signInAnonymously();
      }
      return session;
    } catch (error) {
      console.error('Error initializing auth:', error);
      throw error;
    }
  }
}; 