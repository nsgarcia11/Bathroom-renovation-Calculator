import React from 'react';

interface CollapsibleCardProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export function CollapsibleCard({
  title,
  isOpen,
  onToggle,
  headerContent,
  children,
}: CollapsibleCardProps) {
  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
      <div
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        role='button'
        tabIndex={0}
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-label={`Toggle ${title}`}
        className='w-full flex justify-between items-center p-6 text-left gap-4 cursor-pointer'
      >
        <div className='flex items-center gap-3 flex-grow'>
          <h2 className='text-xl font-bold text-slate-800 flex-shrink-0'>
            {title}
          </h2>
          {headerContent}
        </div>
        <svg
          className={`w-6 h-6 text-blue-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </div>
      {isOpen && <div className='p-6 pt-0 animate-fade-in'>{children}</div>}
    </div>
  );
}
