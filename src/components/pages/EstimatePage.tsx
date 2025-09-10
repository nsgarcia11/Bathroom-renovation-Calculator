'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Contractor, Project, EstimateTotals } from '@/types';
import { AppHeader } from '@/components/AppHeader';
import { WorkflowNavigation } from '@/components/WorkflowNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Download, CreditCard } from 'lucide-react';

export function EstimatePage() {
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');
  const [loading, setLoading] = useState(true);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [totals, setTotals] = useState<EstimateTotals>({
    labor_total: 0,
    material_total: 0,
    subtotal: 0,
    tax: 0,
    grand_total: 0,
  });

  const loadEstimateData = useCallback(async () => {
    // Load contractor info
    const { data: contractorData } = await supabase
      .from('contractors')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    setContractor(contractorData);

    // Mock project data
    setProject({
      id: '1',
      user_id: user?.id || '',
      contractor_id: contractorData?.id || '',
      client_name: 'John Smith',
      client_email: 'john@example.com',
      client_phone: '(555) 123-4567',
      project_name: 'Master Bathroom Renovation',
      project_address: '123 Main St, Toronto, ON',
      notes: 'Complete bathroom renovation with walk-in shower',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Mock totals data
    setTotals({
      labor_total: 2816.33,
      material_total: 475.0,
      subtotal: 3291.33,
      tax: 427.87,
      grand_total: 3719.2,
    });

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadEstimateData();
    }
  }, [user, loadEstimateData]);

  const handleExportPDF = () => {
    if (!hasActiveSubscription) {
      // Redirect to subscription page
      router.push('/subscription');
      return;
    }

    // In a real app, this would generate and download the PDF
    console.log('Exporting PDF...');
    alert('PDF export functionality would be implemented here');
  };

  const handleSubscribe = () => {
    router.push('/subscription');
  };

  const handleBack = () => {
    if (projectId) {
      router.push(`/project/${projectId}`);
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader
        title='Estimate'
        subtitle={
          project
            ? `Project: ${project.project_name}`
            : 'Bathroom Renovation Estimate'
        }
        showBackButton={true}
        backButtonText={projectId ? 'Back to Project' : 'Back to Dashboard'}
        onBackClick={handleBack}
      />

      {/* Workflow Navigation - Top Icons */}
      <WorkflowNavigation />

      {/* Main Content */}
      <div className='py-6 px-4 pb-20'>
        <div className='max-w-4xl mx-auto'>
          {/* Project Info */}
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-2'>Client</h3>
                  <p className='text-gray-600'>{project?.client_name}</p>
                  <p className='text-gray-600'>{project?.client_email}</p>
                  <p className='text-gray-600'>{project?.client_phone}</p>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-2'>Project</h3>
                  <p className='text-gray-600'>{project?.project_name}</p>
                  <p className='text-gray-600'>{project?.project_address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contractor Info */}
          {contractor && (
            <Card className='mb-6'>
              <CardHeader>
                <CardTitle>Contractor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Company
                    </h3>
                    <p className='text-gray-600'>{contractor.name}</p>
                    <p className='text-gray-600'>{contractor.address}</p>
                    <p className='text-gray-600'>{contractor.postal_code}</p>
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Contact
                    </h3>
                    <p className='text-gray-600'>{contractor.phone}</p>
                    <p className='text-gray-600'>{contractor.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estimate Summary */}
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Estimate Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Labor</span>
                  <span className='font-medium'>
                    {formatCurrency(totals.labor_total)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Materials</span>
                  <span className='font-medium'>
                    {formatCurrency(totals.material_total)}
                  </span>
                </div>
                <div className='flex justify-between border-t pt-4'>
                  <span className='font-semibold text-gray-900'>Subtotal</span>
                  <span className='font-semibold'>
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>
                    Tax ({(contractor?.tax_rate || 0.13) * 100}%)
                  </span>
                  <span className='font-medium'>
                    {formatCurrency(totals.tax)}
                  </span>
                </div>
                <div className='flex justify-between border-t pt-4 text-lg'>
                  <span className='font-bold text-gray-900'>Total</span>
                  <span className='font-bold text-blue-600'>
                    {formatCurrency(totals.grand_total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className='flex justify-center'>
            {hasActiveSubscription ? (
              <Button onClick={handleExportPDF} className='px-8'>
                <Download className='h-4 w-4 mr-2' />
                Export PDF
              </Button>
            ) : (
              <div className='space-y-4 text-center'>
                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                  <div className='flex items-center justify-center'>
                    <CreditCard className='h-5 w-5 text-yellow-600 mr-2' />
                    <span className='text-yellow-800 font-medium'>
                      Subscription Required
                    </span>
                  </div>
                  <p className='text-yellow-700 text-sm mt-1'>
                    You need an active subscription to export PDF estimates.
                  </p>
                </div>
                <Button onClick={handleSubscribe} className='px-8'>
                  <CreditCard className='h-4 w-4 mr-2' />
                  Subscribe to Export PDFs
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
