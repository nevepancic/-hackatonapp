/** @format */

import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Miyagami Audio Transcriptor',
  description: 'Your trusted tool for meetings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500`}
      >
        <div className='relative min-h-screen overflow-hidden'>
          {/* Global background decorative elements */}
          <div className='fixed top-0 left-0 w-full h-full pointer-events-none'>
            <div className='absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
            <div className='absolute top-0 right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
            <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>
          </div>

          {/* Main content */}
          <div className='relative z-10'>{children}</div>
        </div>
      </body>
    </html>
  );
}
