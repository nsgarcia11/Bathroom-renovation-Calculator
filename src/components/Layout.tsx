'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { AuthProvider } from '@/contexts/AuthContext';
import {
  Settings,
  Menu,
  X,
  LogOut,
  FileText,
  Users,
  Package,
  Calculator,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  showHeader?: boolean;
  bottomNavType?: 'default' | 'estimate';
  allowFullHeight?: boolean;
}

function LayoutContent({
  children,
  showBottomNav = true,
  showHeader = true,
  bottomNavType = 'default',
  allowFullHeight = false,
}: LayoutProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSettings = () => {
    router.push('/settings');
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`bg-slate-50 ${
        allowFullHeight ? 'h-screen overflow-hidden' : 'flex flex-col h-screen'
      }`}
    >
      {/* Header */}
      {showHeader && user && (
        <header className='bg-white border-b border-slate-200 sticky top-0 z-20 flex-shrink-0 flex items-center justify-center py-3'>
          <Image
            src='/logo.svg'
            alt='Bathroom Calculator Logo'
            width={10}
            height={10}
            className='w-auto h-14'
          />
        </header>
      )}

      {/* Main Content */}
      {allowFullHeight ? (
        <div className='h-full'>{children}</div>
      ) : (
        <main
          className={`flex-1 overflow-y-auto ${showBottomNav ? 'pb-20' : ''}`}
        >
          {children}
        </main>
      )}

      {/* Bottom Navigation */}
      {showBottomNav && user && (
        <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30'>
          <div className='max-w-7xl mx-auto'>
            {bottomNavType === 'estimate' ? (
              <div className='flex justify-around py-2'>
                <button className='flex flex-col items-center space-y-1 p-2 text-blue-600'>
                  <FileText size={20} />
                  <span className='text-sm sm:text-xs font-medium'>Scope</span>
                </button>
                <button className='flex flex-col items-center space-y-1 p-2 text-gray-400'>
                  <Users size={20} />
                  <span className='text-sm sm:text-xs font-medium'>Labor</span>
                </button>
                <button className='flex flex-col items-center space-y-1 p-2 text-gray-400'>
                  <Package size={20} />
                  <span className='text-sm sm:text-xs font-medium'>
                    Materials
                  </span>
                </button>
                <button className='flex flex-col items-center space-y-1 p-2 text-gray-400'>
                  <Calculator size={20} />
                  <span className='text-sm sm:text-xs font-medium'>
                    Estimate
                  </span>
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className='flex flex-col items-center space-y-1 p-2 text-gray-400'
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  <span className='text-xs font-medium'>Menu</span>
                </button>
              </div>
            ) : (
              <div className='p-4'>
                <div className='flex justify-end'>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className='p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors'
                  >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div
          className='fixed inset-0 z-40'
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className='backdrop-overlay' />
          <div className='absolute bottom-18 right-0 bg-white rounded-lg shadow-lg min-w-[200px]'>
            <div className='py-2'>
              <button
                onClick={handleSettings}
                className='w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center space-x-3'
              >
                <Settings size={20} className='text-slate-600' />
                <span className='text-slate-800'>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className='w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center space-x-3'
              >
                <LogOut size={20} className='text-slate-600' />
                <span className='text-slate-800 text-base sm:text-sm'>
                  Exit
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Layout({
  children,
  showBottomNav = true,
  showHeader = true,
  bottomNavType = 'default',
  allowFullHeight = false,
}: LayoutProps) {
  return (
    <AuthProvider>
      <LayoutContent
        showBottomNav={showBottomNav}
        showHeader={showHeader}
        bottomNavType={bottomNavType}
        allowFullHeight={allowFullHeight}
      >
        {children}
      </LayoutContent>
    </AuthProvider>
  );
}
