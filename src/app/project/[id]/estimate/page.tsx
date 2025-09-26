import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import EstimatePage from '@/components/pages/EstimatePage';
import { EstimateProvider } from '@/contexts/EstimateContext';
import { EstimateWorkflowProvider } from '@/contexts/EstimateWorkflowContext';

interface EstimatePageProps {
  params: {
    id: string;
  };
}

export default async function Estimate({ params }: EstimatePageProps) {
  const { id } = await params;

  return (
    <EstimateProvider>
      <EstimateWorkflowProvider projectId={id}>
        <Layout showBottomNav={true} showHeader={true} bottomNavType='estimate'>
          <AuthGuard>
            <EstimatePage projectId={id} />
          </AuthGuard>
        </Layout>
      </EstimateWorkflowProvider>
    </EstimateProvider>
  );
}
