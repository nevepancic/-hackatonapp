/** @format */

'use client';

import { Sidebar } from '@/components/sidebar';
import { Card } from '@/components/ui/card';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <div className='w-64 fixed inset-y-0'>
        <Card className='h-full rounded-r-none border-r border-white/10'>
          <Sidebar />
        </Card>
      </div>

      {/* Main content */}
      <div className='flex-1 ml-64'>
        <main className='p-8'>
          <Card>{children}</Card>
        </main>
      </div>
    </div>
  );
}
