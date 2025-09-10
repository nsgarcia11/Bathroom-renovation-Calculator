'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CallbackHandler() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash (fragment) which contains the tokens
        const hash = window.location.hash;

        if (hash) {
          // Parse the hash parameters
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            // Set the session using the tokens
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              throw error;
            }

            // Clear the URL hash and redirect to home
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
            router.push('/');
            return;
          }
        }

        // If no tokens found, check if there's a code parameter (PKCE flow)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          // This should have been handled by the server-side callback
          // but if we're here, something went wrong
          throw new Error('Authentication code found but not processed');
        }

        throw new Error('No authentication tokens found');
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md w-full space-y-8 text-center'>
          <div>
            <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
              Authentication Error
            </h2>
            <Alert className='mt-4'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>

          <Button onClick={() => router.push('/')} className='w-full'>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
