import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { EditProjectPage } from '@/components/pages/EditProjectPage';

interface EditProjectProps {
  params: {
    id: string;
  };
}

export default function EditProject({ params }: EditProjectProps) {
  return (
    <Layout showBottomNav={true} showHeader={true}>
      <AuthGuard>
        <EditProjectPage projectId={params.id} />
      </AuthGuard>
    </Layout>
  );
}
