/** @format */

'use client';

import { useEffect, useState } from 'react';
import { Building2, Ticket, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalAttractions: 0,
    activeAttractions: 0,
    totalTickets: 0,
  });

  useEffect(() => {
    async function loadUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('company_name')
          .eq('id', user.id)
          .single();

        if (userData) {
          setUserName(userData.company_name);
        }

        const { data: attractions } = await supabase
          .from('attractions')
          .select('id, status')
          .eq('user_id', user.id);

        const { data: tickets } = await supabase
          .from('tickets')
          .select('id')
          .in('attraction_id', attractions?.map((a) => a.id) || []);

        setStats({
          totalAttractions: attractions?.length || 0,
          activeAttractions:
            attractions?.filter((a) => a.status === 'approved').length || 0,
          totalTickets: tickets?.length || 0,
        });
      }
    }

    loadUserData();
  }, []);

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
