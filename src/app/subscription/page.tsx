import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SubscriptionPage } from '@/components/pages/SubscriptionPage';

export default function Subscription() {
  return (
    <Layout showBottomNav={false}>
      <AuthGuard>
        <SubscriptionPage />
      </AuthGuard>
    </Layout>
  );
}
