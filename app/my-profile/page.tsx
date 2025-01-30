/** @format */

'use client';

import { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  async function handleUpdateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUpdating(true);
    setError('');
    setSuccess('');

    const formData = new FormData(event.currentTarget);
    const updates = {
      full_name: formData.get('fullName'),
    };

    const { error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Profile updated successfully!');
    }
    setIsUpdating(false);
  }

  async function handleUpdatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUpdating(true);
    setError('');
    setSuccess('');

    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsUpdating(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password updated successfully!');
      (event.target as HTMLFormElement).reset();
    }
    setIsUpdating(false);
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-white/70'>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className='mb-8'>
        <Heading>My Profile</Heading>
        <p className='text-purple-100 mt-2'>
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Status Messages */}
      {(error || success) && (
        <div className='mb-8'>
          {error && (
            <div className='text-red-500 text-sm bg-red-500/10 p-4 rounded-lg border border-red-500/20'>
              {error}
            </div>
          )}
          {success && (
            <div className='text-emerald-500 text-sm bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20'>
              {success}
            </div>
          )}
        </div>
      )}

      <div className='grid gap-8 md:grid-cols-2'>
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className='space-y-4'>
              <div className='space-y-2'>
                <label
                  htmlFor='email'
                  className='text-sm font-medium text-white'
                >
                  Email
                </label>
                <input
                  id='email'
                  type='email'
                  value={user?.email}
                  disabled
                  className='w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70'
                />
                <p className='text-xs text-purple-100'>
                  Your email address cannot be changed.
                </p>
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='fullName'
                  className='text-sm font-medium text-white'
                >
                  Full Name
                </label>
                <input
                  id='fullName'
                  name='fullName'
                  type='text'
                  defaultValue={user?.user_metadata?.full_name}
                  placeholder='John Doe'
                  className='w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
              </div>

              <Button type='submit' disabled={isUpdating} className='w-full'>
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className='space-y-4'>
              <div className='space-y-2'>
                <label
                  htmlFor='newPassword'
                  className='text-sm font-medium text-white'
                >
                  New Password
                </label>
                <input
                  id='newPassword'
                  name='newPassword'
                  type='password'
                  required
                  placeholder='••••••••'
                  className='w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='confirmPassword'
                  className='text-sm font-medium text-white'
                >
                  Confirm New Password
                </label>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  required
                  placeholder='••••••••'
                  className='w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
              </div>

              <Button
                type='submit'
                variant='secondary'
                disabled={isUpdating}
                className='w-full'
              >
                {isUpdating ? 'Updating...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
