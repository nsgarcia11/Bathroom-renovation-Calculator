import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageWrapperProps {
  title: string;
  onBack?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  onBack,
  children,
  className = '',
}) => (
  <div className={`bg-white h-full ${className}`}>
    <div className='p-4 border-b border-slate-200 flex items-center space-x-4 sticky top-0 bg-white z-10'>
      {onBack && (
        <button
          aria-label='Back'
          onClick={onBack}
          className='text-slate-500 hover:text-slate-900'
        >
          <ArrowLeft size={28} className='sm:w-[22px] sm:h-[22px]' />
        </button>
      )}
      <h2 className='text-xl font-bold text-slate-800'>{title}</h2>
    </div>
    <div className='p-6 text-slate-500 bg-slate-50/50'>{children}</div>
  </div>
);
