'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useContractor } from '@/hooks/use-contractor';
import { LoginForm } from './LoginForm';
import { SetupPage } from '@/components/pages/SetupPage';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { data: contractor, isLoading: contractorLoading } = useContractor();

  const loading = authLoading || contractorLoading;

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // If user is authenticated but hasn't completed setup, show setup wizard
  if (!contractor) {
    return <SetupPage />;
  }

  return <>{children}</>;
}
