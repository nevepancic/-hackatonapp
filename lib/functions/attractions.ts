/** @format */

import { supabase } from '@/lib/supabase';

export interface Attraction {
  id: string;
  status: string;
}

export async function getAttractions(userId: string): Promise<Attraction[]> {
  const { data: attractions, error: attractionsError } = await supabase
    .from('attractions')
    .select('id, status')
    .eq('user_id', userId);

  if (attractionsError) {
    throw attractionsError;
  }

  console.log('attractions', attractions);

  return attractions || [];
}
