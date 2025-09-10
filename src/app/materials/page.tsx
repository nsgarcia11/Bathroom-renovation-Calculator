import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { MaterialsPage } from '@/components/pages/MaterialsPage';

export default function Materials() {
  return (
    <Layout showBottomNav={true}>
      <AuthGuard>
        <MaterialsPage />
      </AuthGuard>
    </Layout>
  );
}
