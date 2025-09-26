'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  colorScheme?: 'design' | 'construction' | 'general' | 'neutral';
  summary?: React.ReactNode;
  headerAccessory?: React.ReactNode;
}

export function CollapsibleSection({
  title,
  children,
  colorScheme = 'neutral',
  summary,
  headerAccessory,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const colors = {
    design: { bg: 'bg-white', text: 'text-slate-800' },
    construction: { bg: 'bg-white', text: 'text-slate-800' },
    general: { bg: 'bg-slate-100', text: 'text-slate-800' },
    neutral: { bg: 'bg-white', text: 'text-slate-800' },
  }[colorScheme];

  return (
    <div
      className={`rounded-lg shadow-sm border border-slate-200 ${colors.bg}`}
    >
      <div
        className='p-4 cursor-pointer flex justify-between items-center'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className={`font-bold text-lg ${colors.text}`}>{title}</h3>
        <div className='flex items-center space-x-4'>
          {headerAccessory && (
            <div onClick={(e) => e.stopPropagation()}>{headerAccessory}</div>
          )}
          {summary}
          <ChevronDown
            className={`h-5 w-5 text-blue-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>
      {isExpanded && (
        <div className='p-4 border-t border-slate-200'>{children}</div>
      )}
    </div>
  );
}
