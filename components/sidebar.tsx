/** @format */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  UserCircle,
  Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Attractions',
    href: '/attractions',
    icon: PlusCircle,
  },
  {
    name: 'Tickets',
    href: '/tickets',
    icon: Ticket,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden'
          >
            <Menu className='h-6 w-6' />
            <span className='sr-only'>Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='pl-1 pr-0'>
          <div className='px-7'>
            <Link href='/' className='flex items-center'>
              <span className='font-bold'>miyagami</span>
            </Link>
          </div>
          <Separator className='my-4' />
          <nav className='grid items-start px-4 text-sm font-medium'>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                      : ''
                  }`}
                >
                  <Icon className='h-4 w-4' />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <nav className='hidden lg:flex lg:w-64 lg:flex-col'>
        <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r px-6'>
          <div className='flex h-16 shrink-0 items-center'>
            <Link href='/' className='font-bold'>
              miyagami
            </Link>
          </div>
          <nav className='grid items-start gap-2'>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                      : ''
                  }`}
                >
                  <Icon className='h-4 w-4' />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </nav>
    </>
  );
}
