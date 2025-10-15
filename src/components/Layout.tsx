'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Settings, Menu, X, LogOut } from 'lucide-react';
import { EstimateNavigation } from '@/components/EstimateNavigation';

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
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  const handleSettings = () => {
    router.push('/settings');
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMenuOpen && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right - window.scrollX,
      });
    }
  }, [isMenuOpen]);

  return (
    <div
      className={`bg-slate-50 ${
        allowFullHeight ? 'h-screen overflow-hidden' : 'flex flex-col h-screen'
      }`}
    >
      {/* Header */}
      {showHeader && user && (
        <header className='bg-white border-b border-slate-200 sticky top-0 z-20 flex-shrink-0'>
          <div className='max-w-7xl mx-auto px-8 py-3 flex items-center justify-between'>
            {/* Logo on the left */}
            <div className='flex-1'>
              <Image
                src='/logo.svg'
                alt='Bathroom Calculator Logo'
                width={10}
                height={10}
                className='w-auto h-14'
              />
            </div>

            {/* Menu icon on the right */}
            <div className='flex-1 flex justify-end'>
              <button
                ref={menuButtonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className='p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors'
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
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
      {showBottomNav && user && bottomNavType === 'estimate' && (
        <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30'>
          <div className='max-w-7xl mx-auto'>
            <EstimateNavigation />
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {isMenuOpen &&
        mounted &&
        createPortal(
          <div
            className='fixed inset-0 z-40'
            onClick={() => setIsMenuOpen(false)}
          >
            {/* Backdrop */}
            <div className='backdrop-overlay' />
            <div
              className='absolute bg-white rounded-lg shadow-lg min-w-[200px]'
              style={{
                top: `${menuPosition.top}px`,
                right: `${menuPosition.right}px`,
              }}
            >
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
          </div>,
          document.body
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
