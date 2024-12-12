import { supabase } from './supabase';

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
}

export async function validateResetToken(token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'recovery',
  });

  if (error) throw error;
  return data;
}

export async function resetPassword(token: string, newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}