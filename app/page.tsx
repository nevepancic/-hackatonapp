/** @format */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Miyagami Tickets',
  description: 'Your ticket management solution',
};

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold mb-4'>Hello Miyagami Tickets</h1>
        <p className='text-xl text-gray-600 dark:text-gray-400'>
          Your ticket management solution
        </p>
      </div>
    </main>
  );
}
