/** @format */

import { supabase } from '@/lib/supabase';

export interface UserData {
  id: string;
  full_name: string;
  company_name: string;
  role: string;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('No user found');
  }

  return user;
}

export async function getUserData(userId: string): Promise<UserData> {
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (dbError) {
    throw dbError;
  }

  return userData;
}

export async function updateCompanyName(
  userId: string,
  companyName: string
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ company_name: companyName })
    .eq('id', userId);

  if (error) {
    throw error;
  }
}

export async function deleteUserProfile(userId: string): Promise<void> {
  // First, delete all user's attractions and related data
  const { error: attractionsError } = await supabase
    .from('attractions')
    .delete()
    .eq('user_id', userId);

  if (attractionsError) {
    throw attractionsError;
  }

  // Delete user data from users table
  const { error: userError } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (userError) {
    throw userError;
  }

  // Sign out the user from auth
  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) {
    throw signOutError;
  }
}
