import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { EstimatePage } from '@/components/pages/EstimatePage';

export default function Estimate() {
  return (
    <Layout showBottomNav={true}>
      <AuthGuard>
        <EstimatePage />
      </AuthGuard>
    </Layout>
  );
}
