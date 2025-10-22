'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the current session to check if user is verified
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session?.user?.email_confirmed_at) {
          setStatus('success');
          setMessage(
            'Your email has been successfully verified! You can now sign in.'
          );
        } else {
          setStatus('error');
          setMessage(
            'Email verification failed. Please try again or request a new verification email.'
          );
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          error instanceof Error
            ? error.message
            : 'An error occurred during email verification.'
        );
      }
    };

    handleEmailVerification();
  }, []);

  const handleGoToLogin = () => {
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <h2 className='mt-4 text-2xl font-bold text-gray-900'>
              Verifying your email...
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <div
            className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
              status === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {status === 'success' ? (
              <svg
                className='h-6 w-6 text-green-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            ) : (
              <svg
                className='h-6 w-6 text-red-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            )}
          </div>

          <h2 className='mt-4 text-2xl font-bold text-gray-900'>
            {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </h2>
        </div>

        <div className='space-y-4'>
          <Alert
            className={
              status === 'success'
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }
          >
            <AlertDescription
              className={
                status === 'success' ? 'text-green-800' : 'text-red-800'
              }
            >
              {message}
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleGoToLogin}
            className='w-full'
            variant={status === 'success' ? 'default' : 'outline'}
          >
            {status === 'success' ? 'Continue to App' : 'Back to Login'}
          </Button>
        </div>
      </div>
    </div>
  );
}
