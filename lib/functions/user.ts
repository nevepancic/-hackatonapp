/** @format */

import { supabase } from '@/lib/supabase';

export interface UserData {
  id: string;
  name: string;
  email: string;
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

export async function updateUserProfile(
  userId: string,
  data: { name: string; email: string }
): Promise<void> {
  // Update auth metadata
  const { error: authError } = await supabase.auth.updateUser({
    email: data.email,
    data: { name: data.name },
  });

  if (authError) {
    throw authError;
  }

  // Update users table
  const { error: dbError } = await supabase
    .from('users')
    .update({ name: data.name })
    .eq('id', userId);

  if (dbError) {
    throw dbError;
  }
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
