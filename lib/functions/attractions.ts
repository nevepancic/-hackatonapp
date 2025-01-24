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

export interface UpdateAttractionData {
  name?: string;
  short_description?: string;
  long_description?: string;
  address?: string;
  city?: string;
  country?: string;
}

export async function getAttractions(userId: string): Promise<Attraction[]> {
  const { data: attractions, error: attractionsError } = await supabase
    .from('attractions')
    .select('*')
    .eq('user_id', userId);

  if (attractionsError) {
    throw attractionsError;
  }

  return attractions || [];
}

export async function updateAttraction(
  attractionId: string,
  userId: string,
  data: UpdateAttractionData
): Promise<Attraction> {
  // First verify the attraction belongs to the user
  const { error: fetchError } = await supabase
    .from('attractions')
    .select('*')
    .eq('id', attractionId)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    throw new Error('Attraction not found or access denied');
  }

  // Update the attraction
  const { data: updatedAttraction, error: updateError } = await supabase
    .from('attractions')
    .update(data)
    .eq('id', attractionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return updatedAttraction;
}

export async function deleteAttraction(
  attractionId: string,
  userId: string
): Promise<void> {
  // First verify the attraction belongs to the user
  const { error: fetchError } = await supabase
    .from('attractions')
    .select('*')
    .eq('id', attractionId)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    throw new Error('Attraction not found or access denied');
  }

  // Delete the attraction
  const { error: deleteError } = await supabase
    .from('attractions')
    .delete()
    .eq('id', attractionId)
    .eq('user_id', userId);

  if (deleteError) {
    throw deleteError;
  }
}
