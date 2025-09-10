'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Building2, LogOut, ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
}

export function AppHeader({
  title,
  subtitle,
  showBackButton = false,
  backButtonText = 'Back to Dashboard',
  onBackClick,
}: AppHeaderProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.push('/');
    }
  };

  return (
    <div className='bg-white border-b border-gray-200'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-3'>
            <div className='flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg'>
              <Building2 className='h-6 w-6 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>{title}</h1>
              {subtitle && <p className='mt-1 text-gray-600'>{subtitle}</p>}
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {showBackButton && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleBackClick}
                className='flex items-center space-x-2'
              >
                <ArrowLeft className='h-4 w-4' />
                <span>{backButtonText}</span>
              </Button>
            )}
            <Button
              variant='outline'
              size='sm'
              onClick={handleLogout}
              className='flex items-center space-x-2'
            >
              <LogOut className='h-4 w-4' />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
