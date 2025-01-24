/** @format */

import { supabase } from '@/lib/supabase';

export async function getTickets(attractionIds: string[]): Promise<number> {
  if (attractionIds.length === 0) {
    return 0;
  }

  const { data: tickets, error: ticketsError } = await supabase
    .from('tickets')
    .select('id')
    .in('attraction_id', attractionIds);

  if (ticketsError) {
    throw ticketsError;
  }

  console.log('tickets', tickets);

  return tickets?.length || 0;
}
