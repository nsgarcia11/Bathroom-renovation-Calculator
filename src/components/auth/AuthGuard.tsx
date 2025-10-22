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
    isFetching: contractorFetching,
    isSuccess: contractorSuccess,
  } = useContractor();

  const loading = authLoading || (user && contractorLoading);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginForm />;
  }

  // If we're still loading contractor data, show loading
  if (contractorLoading) {
    return <LoadingSpinner />;
  }

  // If we're still fetching contractor data and don't have any data yet, show loading
  if (contractorFetching && !contractor) {
    return <LoadingSpinner />;
  }

  // If user is authenticated but hasn't completed setup, show setup wizard
  // Only redirect to setup if we're sure there's no contractor data and the query has completed successfully
  // AND we're not currently fetching data
  if (
    !contractor &&
    contractorSuccess &&
    !contractorError &&
    !contractorFetching
  ) {
    return <SetupPage />;
  }

  // If there's an error loading contractor data, show setup page as fallback
  if (contractorError && !contractor) {
    return <SetupPage />;
  }

  // Check if contractor exists but is missing required fields (incomplete setup)
  if (
    contractor &&
    contractorSuccess &&
    !contractorError &&
    !contractorFetching
  ) {
    const hasRequiredFields =
      contractor.name &&
      contractor.email &&
      contractor.phone &&
      contractor.address &&
      contractor.postal_code &&
      contractor.province &&
      contractor.hourly_rate &&
      contractor.tax_rate !== undefined;

    if (!hasRequiredFields) {
      return <SetupPage />;
    }
  }

  return <>{children}</>;
}
