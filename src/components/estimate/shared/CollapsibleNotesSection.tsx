'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CollapsibleNotesSectionProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  helpers: string[];
}

export function CollapsibleNotesSection({
  title,
  value,
  onChange,
  placeholder,
  helpers,
}: CollapsibleNotesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleHelperClick = (helper: string) => {
    const currentNotes = value || '';
    const newText = `${helper}: `;
    const separator = currentNotes.trim() === '' ? '' : '\n';
    onChange(currentNotes + separator + newText);
  };

  return (
    <div className='border-t border-slate-200 pt-4'>
      <div
        className='flex justify-between items-center cursor-pointer'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className='text-blue-700 font-bold text-lg'>{title}</h3>
        <ChevronDown
          className={`h-5 w-5 text-blue-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>
      {isExpanded && (
        <div className='mt-2'>
          <Textarea
            id='notes-textarea'
            label='Notes'
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className='w-full text-sm border border-blue-300 rounded-md px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            rows={4}
          />
          <div className='flex flex-wrap gap-2 mt-2'>
            {helpers.map((helper) => (
              <button
                key={helper}
                onClick={() => handleHelperClick(helper)}
                className='text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors'
              >
                + {helper}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
