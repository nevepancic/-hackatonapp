/** @format */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Miyagami Tickets',
  description: 'Your ticket management solution',
};

export default function LandingPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-0 left-0 w-full h-full'>
        <div className='absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
        <div className='absolute top-0 right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>
      </div>

      <div className='max-w-md w-full space-y-8 p-8 backdrop-blur-lg bg-white bg-opacity-10 rounded-2xl shadow-2xl relative z-10'>
        <div className='text-center'>
          <h1 className='text-5xl font-extrabold text-white mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200'>
            Welcome to Miyagami Audio Transcriptor
          </h1>
          <p className='text-lg text-purple-100 mb-12 font-light'>
            Your trusted tool for meetings
          </p>
        </div>

        <div className='space-y-6'>
          <Link
            href='/auth/signup'
            className='w-full flex justify-center py-4 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl'
          >
            Get Started
          </Link>

          <Link
            href='/auth/login'
            className='w-full flex justify-center py-4 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300 backdrop-blur-lg bg-white bg-opacity-20 hover:bg-opacity-30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-lg hover:shadow-xl'
          >
            Log In
          </Link>
        </div>

        <div className='mt-12 text-center'>
          <p className='text-sm text-purple-100'>
            By signing up, you agree to our{' '}
            <Link
              href='/terms'
              className='text-white hover:text-purple-200 underline decoration-2 underline-offset-2 transition-colors duration-200'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='text-white hover:text-purple-200 underline decoration-2 underline-offset-2 transition-colors duration-200'
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
