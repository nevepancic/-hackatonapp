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

const publicNavigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Sign Up', href: '/signup', icon: UserPlus },
  { name: 'Log In', href: '/login', icon: LogIn },
];

const privateNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Add Attraction',
    href: '/attractions/add',
    icon: PlusCircle,
  },
  { name: 'My Attractions', href: '/attractions/show', icon: Ticket },
  { name: 'My Profile', href: '/dashboard/profile', icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    }
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navigation = isAuthenticated ? privateNavigation : publicNavigation;

  return (
    <>
      {/* Mobile Sheet Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className='lg:hidden'>
          <Button variant='ghost' size='icon' className='fixed top-4 left-4'>
            <Menu className='h-6 w-6' />
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='w-[240px] p-0'>
          <MobileNav
            pathname={pathname}
            setIsOpen={setIsOpen}
            navigation={navigation}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className='hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col'>
        <DesktopNav pathname={pathname} navigation={navigation} />
      </div>
    </>
  );
}

function DesktopNav({
  pathname,
  navigation,
}: {
  pathname: string;
  navigation: typeof publicNavigation;
}) {
  return (
    <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4'>
      <div className='flex h-16 shrink-0 items-center'>
        <Link href='/' className='text-xl font-bold text-primary'>
          Miyagami
        </Link>
      </div>
      <nav className='flex flex-1 flex-col'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='-mx-2 space-y-1'>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold
                        ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-primary'
                        }
                      `}
                    >
                      <item.icon className='h-5 w-5 shrink-0' />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function MobileNav({
  pathname,
  setIsOpen,
  navigation,
}: {
  pathname: string;
  setIsOpen: (open: boolean) => void;
  navigation: typeof publicNavigation;
}) {
  return (
    <div className='flex h-full flex-col overflow-y-auto bg-card'>
      <div className='flex h-16 shrink-0 items-center justify-between px-6'>
        <Link
          href='/'
          className='text-xl font-bold text-primary'
          onClick={() => setIsOpen(false)}
        >
          Miyagami
        </Link>
        <Button variant='ghost' size='icon' onClick={() => setIsOpen(false)}>
          <X className='h-6 w-6' />
        </Button>
      </div>
      <Separator />
      <nav className='flex-1 px-4 pt-4'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='-mx-2 space-y-1'>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold
                        ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-primary'
                        }
                      `}
                    >
                      <item.icon className='h-5 w-5 shrink-0' />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
