'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const authSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword !== undefined) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  );

type AuthFormData = z.infer<typeof authSchema>;

export function LoginForm() {
  const { signIn, signUp, resendVerification } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        await signUp(data.email, data.password);
        setNeedsVerification(true);
        setUserEmail(data.email);
        setMessage(
          'Account created! Please check your email to verify your account.'
        );
      } else {
        await signIn(data.email, data.password);
        setMessage('Successfully signed in!');
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Authentication failed. Please try again.';

      if (errorMessage.includes('Email not confirmed')) {
        setNeedsVerification(true);
        setUserEmail(data.email);
        setMessage(
          'Please check your email to verify your account before signing in.'
        );
      } else {
        setMessage(errorMessage);
      }
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) return;

    setIsLoading(true);
    try {
      await resendVerification(userEmail);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to resend verification email.';
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (needsVerification) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
              Verify Your Email
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600'>
              We&apos;ve sent a verification link to {userEmail}
            </p>
          </div>

          <div className='space-y-4'>
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleResendVerification}
              className='w-full'
              disabled={isLoading}
              variant='outline'
            >
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </Button>

            <Button
              onClick={() => {
                setNeedsVerification(false);
                setUserEmail('');
                setMessage('');
              }}
              className='w-full'
              variant='ghost'
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            {isSignUp
              ? 'Enter your details to create an account'
              : 'Enter your email and password to sign in'}
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <div>
              <Input
                {...register('email')}
                type='email'
                placeholder='Enter your email'
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                {...register('password')}
                type='password'
                placeholder='Enter your password'
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {isSignUp && (
              <div>
                <Input
                  {...register('confirmPassword')}
                  type='password'
                  placeholder='Confirm your password'
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading
              ? isSignUp
                ? 'Creating Account...'
                : 'Signing In...'
              : isSignUp
              ? 'Create Account'
              : 'Sign In'}
          </Button>

          <div className='text-center'>
            <button
              type='button'
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage('');
              }}
              className='text-sm text-blue-600 hover:text-blue-500'
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
