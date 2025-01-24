/** @format */

'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/functions/user';
import { getAttractions, type Attraction } from '@/lib/functions/attractions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type StatusType = 'all' | 'pending' | 'approved' | 'declined';

export default function ShowAttractions() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<StatusType>('all');

  useEffect(() => {
    async function loadAttractions() {
      try {
        const user = await getCurrentUser();
        const userAttractions = await getAttractions(user.id);
        setAttractions(userAttractions);
      } catch (error) {
        console.error('Error loading attractions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAttractions();
  }, []);

  const filteredAttractions = attractions.filter((attraction) => {
    if (currentStatus === 'all') return true;
    return attraction.status === currentStatus;
  });

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-red-100 text-red-800 hover:bg-red-200';
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Your Attractions</h1>
        <p className='text-muted-foreground'>
          Manage and view all your registered attractions
        </p>
      </div>

      <Tabs
        defaultValue='all'
        value={currentStatus}
        onValueChange={(value) => setCurrentStatus(value as StatusType)}
        className='w-full'
      >
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='approved'>Approved</TabsTrigger>
          <TabsTrigger value='pending'>Pending</TabsTrigger>
          <TabsTrigger value='declined'>Declined</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredAttractions.map((attraction) => (
          <Card
            key={attraction.id}
            className='hover:shadow-lg transition-shadow'
          >
            <CardHeader>
              <div className='flex justify-between items-start'>
                <CardTitle className='text-xl font-bold'>
                  {attraction.name}
                </CardTitle>
                <Badge
                  className={cn(
                    'font-medium',
                    getStatusClassName(attraction.status)
                  )}
                >
                  {attraction.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-muted-foreground line-clamp-2'>
                {attraction.short_description}
              </p>

              <div className='space-y-2'>
                <div className='flex items-center text-sm'>
                  <MapPin className='h-4 w-4 mr-2 text-muted-foreground' />
                  {attraction.address}, {attraction.city}
                </div>
                <div className='flex items-center text-sm'>
                  <Globe className='h-4 w-4 mr-2 text-muted-foreground' />
                  {attraction.country}
                </div>
              </div>

              <div className='text-xs text-muted-foreground mt-4'>
                Last updated:{' '}
                {new Date(attraction.updated_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAttractions.length === 0 && (
        <div className='text-center py-12'>
          <h3 className='text-lg font-semibold'>No attractions found</h3>
          <p className='text-muted-foreground'>
            {currentStatus === 'all'
              ? "You haven't added any attractions yet."
              : `No ${currentStatus} attractions found.`}
          </p>
        </div>
      )}
    </div>
  );
}
