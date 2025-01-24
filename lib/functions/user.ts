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
