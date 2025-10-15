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
  const {
    data: contractor,
    isLoading: contractorLoading,
    error: contractorError,
  } = useContractor();

  const loading = authLoading || (user && contractorLoading);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginForm />;
  }

  // If user is authenticated but hasn't completed setup, show setup wizard
  // Only redirect to setup if we're sure there's no contractor data (not just loading)
  if (!contractor && !contractorLoading && !contractorError) {
    return <SetupPage />;
  }

  // If there's an error loading contractor data, show setup page as fallback
  if (contractorError && !contractor) {
    return <SetupPage />;
  }

  return <>{children}</>;
}
