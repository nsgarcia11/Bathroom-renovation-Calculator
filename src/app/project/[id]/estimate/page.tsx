import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { EstimatePage } from '@/components/pages/EstimatePage';
import { EstimateProvider } from '@/contexts/EstimateContext';

interface EstimatePageProps {
  params: {
    id: string;
  };
}

export default async function Estimate({ params }: EstimatePageProps) {
  const { id } = await params;

  return (
    <EstimateProvider>
      <Layout showBottomNav={true} showHeader={true} bottomNavType='estimate'>
        <AuthGuard>
          <EstimatePage projectId={id} />
        </AuthGuard>
      </Layout>
    </EstimateProvider>
  );
}
