/** @format */

'use client';

import { Sidebar } from '@/components/sidebar';

export default function AttractionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-background'>
      <Sidebar />

      {/* Main Content */}
      <div className='lg:pl-64'>
        <main className='py-10'>
          <div className='px-4 sm:px-6 lg:px-8'>{children}</div>
        </main>
      </div>
    </div>
  );
}
