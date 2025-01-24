/** @format */

'use client';

import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen'>
      <div className='flex'>
        <Sidebar />
        <main className='flex-1 px-4 py-6 lg:px-8'>{children}</main>
      </div>
    </div>
  );
}
