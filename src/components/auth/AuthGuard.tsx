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
    error: contractorError,
    isSuccess: contractorSuccess,
    refetch: refetchContractor,
  } = useContractor();

  // Show loading while auth is resolving
  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginForm />;
  }

  // Wait until the contractor query has a definitive result (success or error).
  // This covers: initial loading, background refetching, AND the idle→fetching
  // transition that happens when `enabled` flips from false to true after sign-in.
  if (!contractorSuccess && !contractorError) {
    return <LoadingSpinner />;
  }

  // If there's an error loading contractor data, show error with retry — NOT setup page
  if (contractorError && !contractor) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
        <div className='text-center max-w-md'>
          <h2 className='text-xl font-bold text-slate-800 mb-2'>
            Unable to load your data
          </h2>
          <p className='text-slate-600 mb-4'>
            There was a problem connecting to the server. Please check your
            connection and try again.
          </p>
          <button
            onClick={() => refetchContractor()}
            className='bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If user is authenticated but has no contractor record, show setup wizard
  if (!contractor && contractorSuccess) {
    return <SetupPage />;
  }

  // If contractor exists but is missing required fields (incomplete setup)
  if (contractor) {
    const stringHasValue = (value: string | null | undefined) =>
      typeof value === 'string' && value.trim().length > 0;
    const numberHasValue = (value: number | null | undefined) =>
      typeof value === 'number' && !Number.isNaN(value);

    const hasRequiredFields =
      stringHasValue(contractor.name) &&
      stringHasValue(contractor.email) &&
      stringHasValue(contractor.phone) &&
      stringHasValue(contractor.address) &&
      stringHasValue(contractor.postal_code) &&
      stringHasValue(contractor.province) &&
      numberHasValue(contractor.hourly_rate) &&
      numberHasValue(contractor.tax_rate);

    if (!hasRequiredFields) {
      return <SetupPage />;
    }
  }

  return <>{children}</>;
}
