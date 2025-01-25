/** @format */

import { supabase } from '@/lib/supabase';

export interface OpeningHours {
  open: string;
  close: string;
}

export interface WeekOpeningHours {
  monday: OpeningHours;
  tuesday: OpeningHours;
  wednesday: OpeningHours;
  thursday: OpeningHours;
  friday: OpeningHours;
  saturday: OpeningHours;
  sunday: OpeningHours;
}

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
  opening_hours: WeekOpeningHours;
  image_url?: string;
  barcode_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  validity_start: string;
  validity_end: string;
}

export interface UpdateAttractionData {
  name?: string;
  short_description?: string;
  long_description?: string;
  address?: string;
  city?: string;
  country?: string;
  opening_hours?: WeekOpeningHours;
  image_url?: string;
  barcode_url?: string;
}

export interface CreateAttractionData {
  name: string;
  short_description: string;
  long_description: string;
  address: string;
  city: string;
  country: string;
  opening_hours: WeekOpeningHours;
  image_url?: string;
  barcode_url?: string;
}

export interface CreateTicketData {
  name: string;
  description: string;
  price: string;
  currency: string;
  validity_start: string;
  validity_end: string;
}

export interface UpdateTicketData {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  validity_start?: string;
  validity_end?: string;
}

export interface AttractionWithTickets extends Attraction {
  tickets: Ticket[];
}

export async function getAttractions(
  userId: string
): Promise<AttractionWithTickets[]> {
  const { data: attractions, error: attractionsError } = await supabase
    .from('attractions')
    .select(
      `
      *,
      tickets (*)
    `
    )
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

export async function updateTicket(
  ticketId: string,
  userId: string,
  data: UpdateTicketData
): Promise<Ticket> {
  // First verify the ticket belongs to the user's attraction
  const { error: fetchError } = await supabase
    .from('tickets')
    .select('*, attractions!inner(*)')
    .eq('id', ticketId)
    .eq('attractions.user_id', userId)
    .single();

  if (fetchError) {
    throw new Error('Ticket not found or access denied');
  }

  // Update the ticket
  const { data: updatedTicket, error: updateError } = await supabase
    .from('tickets')
    .update(data)
    .eq('id', ticketId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return updatedTicket;
}

export async function deleteTicket(
  ticketId: string,
  userId: string
): Promise<void> {
  // First verify the ticket belongs to the user's attraction
  const { error: fetchError } = await supabase
    .from('tickets')
    .select('*, attractions!inner(*)')
    .eq('id', ticketId)
    .eq('attractions.user_id', userId)
    .single();

  if (fetchError) {
    throw new Error('Ticket not found or access denied');
  }

  // Delete the ticket
  const { error: deleteError } = await supabase
    .from('tickets')
    .delete()
    .eq('id', ticketId);

  if (deleteError) {
    throw deleteError;
  }
}

export async function uploadAttractionImage(
  file: File,
  userId: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('attractions')
    .upload(fileName, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('attractions').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function uploadAttractionBarcode(
  file: File,
  userId: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('barcodes')
    .upload(fileName, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('barcodes').getPublicUrl(fileName);
  return data.publicUrl;
}
