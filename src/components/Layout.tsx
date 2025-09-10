'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { BottomNavigation } from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export function Layout({ children, showBottomNav = true }: LayoutProps) {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <div className='min-h-screen bg-gray-50'>
          <main className={showBottomNav ? 'pb-20' : ''}>{children}</main>
          {showBottomNav && <BottomNavigation />}
        </div>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
