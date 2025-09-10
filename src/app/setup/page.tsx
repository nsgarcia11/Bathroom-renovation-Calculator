import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SetupPage } from '@/components/pages/SetupPage';

export default function Setup() {
  return (
    <Layout showBottomNav={false}>
      <AuthGuard>
        <SetupPage />
      </AuthGuard>
    </Layout>
  );
}
