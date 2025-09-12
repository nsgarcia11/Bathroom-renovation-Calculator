import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { NewProjectPage } from '@/components/pages/NewProjectPage';

export default function NewProject() {
  return (
    <Layout showBottomNav={true} showHeader={true}>
      <AuthGuard>
        <NewProjectPage />
      </AuthGuard>
    </Layout>
  );
}
