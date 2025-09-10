import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { LaborPage } from '@/components/pages/LaborPage';

export default function Labor() {
  return (
    <Layout showBottomNav={true}>
      <AuthGuard>
        <LaborPage />
      </AuthGuard>
    </Layout>
  );
}
