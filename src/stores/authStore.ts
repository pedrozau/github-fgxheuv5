import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { refreshSession, getInitialSession } from '../lib/auth/session';
import { getAuthErrorMessage } from '../lib/auth/errors';
import type { AuthState } from '../lib/auth/types';

interface AuthStore extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    try {
      // Get initial session
      const session = await getInitialSession();
      set({ 
        session, 
        user: session?.user ?? null,
        initialized: true, 
        loading: false 
      });

      // Set up auth state listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          set({ session, user: session?.user ?? null });
        } else if (event === 'SIGNED_OUT') {
          set({ session: null, user: null });
        } else if (event === 'SIGNED_IN') {
          set({ session, user: session?.user ?? null });
        }
      });

      // Set up refresh token interval
      const refreshInterval = setInterval(async () => {
        const { success, error } = await refreshSession();
        if (!success && error) {
          console.error('Token refresh failed:', error);
          // If refresh fails, sign out the user
          await supabase.auth.signOut();
          set({ session: null, user: null });
        }
      }, 10 * 60 * 1000); // Refresh every 10 minutes

      // Cleanup interval on unmount
      return () => clearInterval(refreshInterval);
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false, initialized: true });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ 
        session: data.session,
        user: data.user,
        loading: false 
      });
    } catch (error) {
      console.error('Sign in error:', error);
      set({ loading: false });
      throw new Error(getAuthErrorMessage(error));
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null, user: null });
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error(getAuthErrorMessage(error));
    } finally {
      set({ loading: false });
    }
  },
}));