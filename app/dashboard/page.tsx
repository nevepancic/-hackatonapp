/** @format */

'use client';

import { useEffect, useState } from 'react';
import { Building2, Ticket, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser, getUserData } from '@/lib/functions/user';
import { getAttractions } from '@/lib/functions/attractions';
import { getTickets } from '@/lib/functions/tickets';

interface DashboardStats {
  totalAttractions: number;
  activeAttractions: number;
  totalTickets: number;
}

export default function Dashboard() {
  const [companyName, setCompanyName] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalAttractions: 0,
    activeAttractions: 0,
    totalTickets: 0,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const user = await getCurrentUser();
        console.log('user from page debug', user);
        const userId = user.id;
        console.log('userId debug', userId);

        const userData = await getUserData(userId);
        setCompanyName(userData.company_name);

        const attractions = await getAttractions(user.id);

        const tickets = await getTickets(attractions.map((a) => a.id));

        setStats({
          totalAttractions: attractions.length,
          activeAttractions: attractions.filter((a) => a.status === 'approved')
            .length,
          totalTickets: tickets,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>
          Welcome back, {companyName}!
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
