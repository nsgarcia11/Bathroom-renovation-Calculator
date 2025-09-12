import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SettingsPage } from '@/components/pages/SettingsPage';

export default function Settings() {
  return (
    <Layout showBottomNav={true} showHeader={true}>
      <AuthGuard>
        <SettingsPage />
      </AuthGuard>
    </Layout>
  );
}
