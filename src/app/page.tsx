import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { HomePage } from '@/components/pages/HomePage';

export default function Home() {
  return (
    <Layout showBottomNav={true}>
      <AuthGuard>
        <HomePage />
      </AuthGuard>
    </Layout>
  );
}
