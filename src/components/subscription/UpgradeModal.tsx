'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = 'Upgrade Your Plan',
  message,
}: UpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='backdrop-overlay' onClick={onClose} />
      <div className='relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
        <div className='flex items-center justify-between p-6 border-b border-slate-200'>
          <div className='flex items-center gap-2'>
            <Crown size={20} className='text-amber-500' />
            <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
          </div>
          <button
            title='Close'
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 transition-colors'
          >
            <X size={24} className='sm:w-[20px] sm:h-[20px]' />
          </button>
        </div>
        <div className='p-6'>
          <p className='text-slate-600 mb-6'>{message}</p>
          <div className='flex justify-end space-x-3'>
            <Button type='button' variant='outline' onClick={onClose}>
              Maybe Later
            </Button>
            <Button
              type='button'
              onClick={() => {
                onClose();
                router.push('/pricing');
              }}
              className='bg-blue-600 hover:bg-blue-700 text-white'
            >
              View Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
