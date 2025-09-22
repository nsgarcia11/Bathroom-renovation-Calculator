'use client';

import { useEstimate } from '@/contexts/EstimateContext';
import {
  FileText,
  Users,
  Package,
  Calculator,
  Menu,
  X,
  Settings,
  LogOut,
} from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function EstimateNavigation() {
  const { activeSection, setActiveSection } = useEstimate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSettings = useCallback(() => {
    router.push('/settings');
    setIsMenuOpen(false);
  }, [router]);

  const handleLogout = useCallback(async () => {
    await signOut();
    setIsMenuOpen(false);
  }, [signOut]);

  // Memoized navigation items
  const navigationItems = useMemo(
    () => [
      {
        id: 'design',
        icon: FileText,
        label: 'Design',
        onClick: () => setActiveSection('design'),
      },
      {
        id: 'labor',
        icon: Users,
        label: 'Labor',
        onClick: () => setActiveSection('labor'),
      },
      {
        id: 'materials',
        icon: Package,
        label: 'Materials',
        onClick: () => setActiveSection('materials'),
      },
      {
        id: 'estimate',
        icon: Calculator,
        label: 'Estimate',
        onClick: () => setActiveSection('estimate'),
      },
    ],
    [setActiveSection]
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <div className='flex justify-around py-2'>
        {navigationItems.map(({ id, icon: Icon, label, onClick }) => (
          <button
            key={id}
            onClick={onClick}
            className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
              activeSection === id
                ? 'text-blue-600'
                : 'text-gray-400 hover:text-blue-600'
            }`}
          >
            <Icon size={20} />
            <span className='text-sm sm:text-xs font-medium'>{label}</span>
          </button>
        ))}
        <button
          onClick={toggleMenu}
          className='flex flex-col items-center space-y-1 p-2 text-gray-400 hover:text-blue-600 transition-colors'
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          <span className='text-xs font-medium'>Menu</span>
        </button>
      </div>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div
          className='fixed inset-0 z-40'
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className='backdrop-overlay' />
          <div
            className='absolute bottom-16 right-0 sm:right-4 lg:right-8 bg-white rounded-lg shadow-lg min-w-[200px]'
            onClick={(e) => e.stopPropagation()}
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
        </div>
      )}
    </>
  );
}
