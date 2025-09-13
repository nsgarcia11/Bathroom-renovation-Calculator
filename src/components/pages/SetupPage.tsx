'use client';

import { useRouter } from 'next/navigation';
import { useUpdateContractor } from '@/hooks/use-contractor';
import { SetupWizard } from '@/components/setup/SetupWizard';

export function SetupPage() {
  const router = useRouter();
  const updateContractor = useUpdateContractor();

  const handleFinish = async (settings: {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    address: string;
    postalCode: string;
    province: string;
    hourlyRate: string;
    taxRate: string;
    currency: string;
  }) => {
    try {
      // Transform settings to match the expected format
      const contractorData = {
        name: settings.companyName,
        address: settings.address,
        postal_code: settings.postalCode,
        phone: settings.companyPhone,
        email: settings.companyEmail,
        province: settings.province,
        tax_rate: parseFloat(settings.taxRate) / 100, // Convert percentage to decimal
        hourly_rate: parseFloat(settings.hourlyRate),
        currency: settings.currency,
      };

      await updateContractor.mutateAsync(contractorData);

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('❌ Setup error:', error);

      // If it's an auth error, redirect to home (which will show login form)
      if (
        error instanceof Error &&
        (error.message?.includes('JWT') ||
          error.message?.includes('User from sub claim'))
      ) {
        router.push('/');
        return;
      }

      // For other errors, redirect to home as well
      router.push('/');
    }
  };

  return <SetupWizard onFinish={handleFinish} />;
}
