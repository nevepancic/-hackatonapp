/** @format */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <div className='container max-w-md mx-auto p-4 h-screen flex items-center'>
      <Card className='w-full'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl text-center'>Welcome back</CardTitle>
          <CardDescription className='text-center'>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='email' className='text-sm font-medium text-white'>
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                placeholder='m@example.com'
                required
                className='w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='text-sm font-medium text-white'
                >
                  Password
                </label>
                <Link
                  href='/auth/reset-password'
                  className='text-sm text-purple-100 hover:text-white'
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>

            {error && (
              <div className='text-red-500 text-sm bg-red-500/10 p-3 rounded-lg'>
                {error}
              </div>
            )}

            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className='text-center text-sm text-purple-100'>
              Don't have an account?{' '}
              <Link
                href='/auth/signup'
                className='text-white hover:text-purple-200 underline underline-offset-4'
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
