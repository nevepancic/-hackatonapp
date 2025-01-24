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

export interface CreateAttractionData {
  name: string;
  short_description: string;
  long_description: string;
  address: string;
  city: string;
  country: string;
}

export interface CreateTicketData {
  name: string;
  description: string;
  price: string;
  currency: string;
  validity_start: string;
  validity_end: string;
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

export async function insertAttractionAndTickets(
  userId: string,
  attractionData: CreateAttractionData,
  ticketsData: CreateTicketData[]
): Promise<void> {
  // First insert the attraction
  const { data: attraction, error: attractionError } = await supabase
    .from('attractions')
    .insert({
      ...attractionData,
      user_id: userId,
      status: 'pending',
    })
    .select()
    .single();

  if (attractionError) throw attractionError;

  // Then insert all tickets
  const ticketsToInsert = ticketsData.map((ticket) => ({
    attraction_id: attraction.id,
    name: ticket.name,
    description: ticket.description,
    price: parseFloat(ticket.price),
    currency: ticket.currency,
    validity_start: ticket.validity_start,
    validity_end: ticket.validity_end,
  }));

  const { error: ticketsError } = await supabase
    .from('tickets')
    .insert(ticketsToInsert);

  if (ticketsError) throw ticketsError;
}

export async function deleteAttraction(
  attractionId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('attractions')
    .delete()
    .eq('id', attractionId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}
