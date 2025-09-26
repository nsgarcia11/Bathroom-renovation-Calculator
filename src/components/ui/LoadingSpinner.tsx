'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = 'lg',
  className = '',
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-32 w-32',
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${className}`}
    >
      <div className='text-center'>
        <div
          className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600 mx-auto`}
        ></div>
        {text && <p className='mt-4 text-gray-600 font-medium'>{text}</p>}
      </div>
    </div>
  );
}

export default LoadingSpinner;
