import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { EstimatePage } from '@/components/pages/EstimatePage';

interface EstimatePageProps {
  params: {
    id: string;
  };
}

export default function Estimate({ params }: EstimatePageProps) {
  return (
    <Layout showBottomNav={true} showHeader={true} bottomNavType='estimate'>
      <AuthGuard>
        <EstimatePage projectId={params.id} />
      </AuthGuard>
    </Layout>
  );
}
