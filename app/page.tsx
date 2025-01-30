/** @format */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Miyagami Tickets',
  description: 'Your ticket management solution',
};

export default function LandingPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Welcome to Miyagami
          </h1>
          <p className='text-lg text-gray-600 mb-8'>
            Your trusted platform for managing attractions
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            href='/auth/signup'
            className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Sign Up
          </Link>

          <Link
            href='/auth/login'
            className='w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Log In
          </Link>
        </div>

        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-500'>
            By signing up, you agree to our{' '}
            <Link
              href='/terms'
              className='text-indigo-600 hover:text-indigo-500'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='text-indigo-600 hover:text-indigo-500'
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
