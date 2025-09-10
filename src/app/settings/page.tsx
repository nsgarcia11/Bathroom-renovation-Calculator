import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SettingsPage } from '@/components/pages/SettingsPage';

export default function Settings() {
  return (
    <Layout showBottomNav={false}>
      <AuthGuard>
        <SettingsPage />
      </AuthGuard>
    </Layout>
  );
}
