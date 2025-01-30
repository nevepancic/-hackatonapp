/** @format */

import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className='space-y-8'>
      <Heading>Dashboard</Heading>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card>
          <div className='space-y-2'>
            <Heading variant='h3'>Recent Transcripts</Heading>
            <p className='text-purple-100'>Your latest audio transcriptions</p>
          </div>
        </Card>

        <Card>
          <div className='space-y-2'>
            <Heading variant='h3'>Storage Usage</Heading>
            <p className='text-purple-100'>2.1 GB of 10 GB used</p>
          </div>
        </Card>

        <Card>
          <div className='space-y-2'>
            <Heading variant='h3'>Quick Actions</Heading>
            <p className='text-purple-100'>Common tasks and shortcuts</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
