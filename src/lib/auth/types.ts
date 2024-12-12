import type { Session, User } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

export interface AuthResponse {
  success: boolean;
  error?: AuthError;
}