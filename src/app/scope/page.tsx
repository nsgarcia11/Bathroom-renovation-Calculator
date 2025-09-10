import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ScopePage } from '@/components/pages/ScopePage';

export default function Scope() {
  return (
    <Layout showBottomNav={true}>
      <AuthGuard>
        <ScopePage />
      </AuthGuard>
    </Layout>
  );
}
