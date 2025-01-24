/** @format */

import { supabase } from '@/lib/supabase';

export interface Attraction {
  id: string;
  user_id: string;
  name: string;
  short_description: string;
  long_description: string;
  address: string;
  city: string;
  country: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function getAttractions(userId: string): Promise<Attraction[]> {
  const { data: attractions, error: attractionsError } = await supabase
    .from('attractions')
    .select('*')
    .eq('user_id', userId);

  if (attractionsError) {
    throw attractionsError;
  }

  console.log('attractions', attractions);

  return attractions || [];
}
