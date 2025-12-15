'use client';

import React from 'react';

type WarningVariant = 'info' | 'warning' | 'error';

interface WarningNoteProps {
  children: React.ReactNode;
  variant?: WarningVariant;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const variantStyles: Record<WarningVariant, { container: string; text: string }> = {
  info: {
    container: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
  },
  error: {
    container: 'bg-red-50 border-red-200',
    text: 'text-red-800',
  },
};

export default function WarningNote({
  children,
  variant = 'info',
  className = '',
  dismissible = false,
  onDismiss,
}: WarningNoteProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`mb-4 p-3 border rounded-md ${styles.container} ${className}`}
    >
      <div className='flex items-start justify-between'>
        <p className={`text-xs font-medium ${styles.text}`}>
          {children}
        </p>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={`ml-2 ${styles.text} hover:opacity-70`}
            title='Dismiss'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
