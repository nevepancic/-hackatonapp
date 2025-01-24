/** @format */

import { supabase } from './supabase';

export type AuthError = {
  message: string;
};

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login?verified=true`,
      data: {
        full_name: email, // This will be used by our trigger to create the user profile
      },
    },
  });

  if (error) throw error;

  // Check if email confirmation was sent
  if (data?.user?.identities?.length === 0) {
    throw new Error(
      'This email is already registered. Please sign in instead.'
    );
  }

  return data;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}
