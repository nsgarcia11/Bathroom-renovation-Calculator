'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useContractor } from '@/hooks/use-contractor';
import { LoginForm } from './LoginForm';
import { SetupPage } from '@/components/pages/SetupPage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { data: contractor, isLoading: contractorLoading } = useContractor();

  const loading = authLoading || contractorLoading;

  if (loading) {
    return <LoadingSpinner />;
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
