import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PricingPage } from '@/components/pages/PricingPage';

export default function Pricing() {
  return (
    <Layout showBottomNav={true} showHeader={true}>
      <AuthGuard>
        <PricingPage />
      </AuthGuard>
    </Layout>
  );
}
