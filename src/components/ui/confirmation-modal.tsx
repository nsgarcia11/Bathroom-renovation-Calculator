import React from 'react';
import { Button } from './button';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-500',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
        };
      case 'warning':
        return {
          icon: 'text-yellow-500',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        };
      case 'info':
        return {
          icon: 'text-blue-500',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
      default:
        return {
          icon: 'text-red-500',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='backdrop-overlay' onClick={onClose} />

      {/* Modal */}
      <div className='relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-slate-200'>
          <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
          <button
            title='Close'
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 transition-colors'
            disabled={isLoading}
          >
            <X size={24} className='sm:w-[20px] sm:h-[20px]' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          <p className='text-slate-600 mb-6'>{message}</p>

          {/* Actions */}
          <div className='flex justify-end space-x-3'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              type='button'
              onClick={onConfirm}
              disabled={isLoading}
              className={styles.confirmButton}
            >
              {isLoading ? 'Processing...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
