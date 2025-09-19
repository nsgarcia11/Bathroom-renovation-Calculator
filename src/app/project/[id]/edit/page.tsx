import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { EditProjectPage } from '@/components/pages/EditProjectPage';

interface EditProjectProps {
  params: {
    id: string;
  };
}

export default async function EditProject({ params }: EditProjectProps) {
  const { id } = await params;

  return (
    <Layout showBottomNav={true} showHeader={true}>
      <AuthGuard>
        <EditProjectPage projectId={id} />
      </AuthGuard>
    </Layout>
  );
}
