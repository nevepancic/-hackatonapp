/** @format */

'use client';

import { useEffect, useState } from 'react';
import { Building2, Ticket, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  console.log('Dashboard component rendering');

  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalAttractions: 0,
    activeAttractions: 0,
    totalTickets: 0,
  });

  useEffect(() => {
    console.log('Dashboard useEffect triggered');

    async function loadUserData() {
      console.log('loadUserData function called');
      try {
        console.log('Getting user...');
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        console.log('User from auth:', user);
        console.log('User error:', userError);

        if (userError) {
          console.error('Error getting user:', userError);
          return;
        }

        if (user) {
          console.log('Fetching user data from DB...');
          // Try to get specific user
          const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          console.log('User data from DB:', userData);

          if (!userData) {
            console.log('User not found in DB, creating record...');
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                full_name: user.email,
                company_name: 'Amsterdam zoo',
                role: 'partner',
              })
              .select()
              .single();

            console.log('New user created:', newUser);
            console.log('Insert error:', insertError);

            if (newUser) {
              setUserName(newUser.company_name);
            }
          } else {
            setUserName(userData.company_name);
          }

          console.log('Fetching attractions...');
          const { data: attractions, error: attractionsError } = await supabase
            .from('attractions')
            .select('id, status')
            .eq('user_id', user.id);

          console.log('Attractions:', attractions);
          console.log('Attractions error:', attractionsError);

          if (attractionsError) {
            console.error('Error fetching attractions:', attractionsError);
            return;
          }

          if (attractions && attractions.length > 0) {
            console.log('Fetching tickets...');
            const { data: tickets, error: ticketsError } = await supabase
              .from('tickets')
              .select('id')
              .in(
                'attraction_id',
                attractions.map((a) => a.id)
              );

            console.log('Tickets:', tickets);
            console.log('Tickets error:', ticketsError);

            if (ticketsError) {
              console.error('Error fetching tickets:', ticketsError);
              return;
            }

            setStats({
              totalAttractions: attractions.length,
              activeAttractions: attractions.filter(
                (a) => a.status === 'approved'
              ).length,
              totalTickets: tickets?.length || 0,
            });
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    }

    loadUserData();
  }, []);

  console.log('Current userName:', userName);
  console.log('Current stats:', stats);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>
          Welcome back, {userName || 'Partner'}!
        </h1>
        <p className='text-muted-foreground'>
          Here&apos;s an overview of your attractions and tickets
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Attractions
            </CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalAttractions}</div>
            <p className='text-xs text-muted-foreground'>
              Attractions in your portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Attractions
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.activeAttractions}</div>
            <p className='text-xs text-muted-foreground'>
              Currently active attractions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Tickets</CardTitle>
            <Ticket className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalTickets}</div>
            <p className='text-xs text-muted-foreground'>
              Tickets across all attractions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
