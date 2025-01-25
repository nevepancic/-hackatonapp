/** @format */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Miyagami - Attraction Management',
  description: 'Manage your attractions and tickets efficiently',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Toaster position='top-right' richColors />
        {children}
      </body>
    </html>
  );
}
