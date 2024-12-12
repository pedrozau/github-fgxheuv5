import { supabase } from '../supabase';
import { getAuthErrorMessage } from './errors';
import type { AuthResponse } from './types';

export async function refreshSession(): Promise<AuthResponse> {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Error refreshing session:', error);
      return {
        success: false,
        error: {
          message: getAuthErrorMessage(error),
          code: error.message
        }
      };
    }

    if (!session) {
      return {
        success: false,
        error: {
          message: 'Sessão expirada',
          code: 'SESSION_EXPIRED'
        }
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in refreshSession:', error);
    return {
      success: false,
      error: {
        message: getAuthErrorMessage(error),
        code: 'REFRESH_ERROR'
      }
    };
  }
}

export async function getInitialSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return session;
  } catch (error) {
    console.error('Error getting initial session:', error);
    throw error;
  }
}