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

export default function SignUpPage() {
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

    const { error } = await supabase.auth.signUp({
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
          <CardTitle className='text-2xl text-center'>
            Create an account
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your email below to create your account
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
              <label
                htmlFor='password'
                className='text-sm font-medium text-white'
              >
                Password
              </label>
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
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <div className='text-center text-sm text-purple-100'>
              Already have an account?{' '}
              <Link
                href='/auth/login'
                className='text-white hover:text-purple-200 underline underline-offset-4'
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
