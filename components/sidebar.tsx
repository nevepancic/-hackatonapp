/** @format */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  UserCircle,
  Menu,
  X,
  LogIn,
  UserPlus,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'My Profile', href: '/my-profile', icon: UserIcon },
  { name: 'Transcripts', href: '/transcripts', icon: DocumentTextIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className='flex h-full flex-col gap-y-5 p-6'>
      <div className='flex h-16 shrink-0 items-center'>
        <h1 className='text-2xl font-bold text-white'>Miyagami</h1>
      </div>
      <nav className='flex flex-1 flex-col'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='space-y-2'>
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all duration-300',
                      pathname === item.href
                        ? 'bg-white/20 text-white'
                        : 'text-purple-100 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <item.icon
                      className='h-6 w-6 shrink-0'
                      aria-hidden='true'
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className='mt-auto'>
            <Link
              href='/auth/logout'
              className='group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 text-purple-100 hover:bg-white/10 hover:text-white transition-all duration-300'
            >
              <ArrowLeftOnRectangleIcon
                className='h-6 w-6 shrink-0'
                aria-hidden='true'
              />
              Log out
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
