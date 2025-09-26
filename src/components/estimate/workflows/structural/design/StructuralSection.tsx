'use client';

import React, { useState } from 'react';
import type { StructuralChoices } from '@/types/structural';
import { CheckboxOption } from '@/components/estimate/shared/CheckboxOption';
import { Dropdown } from '@/components/estimate/shared/Dropdown';

interface StructuralSectionProps {
  choices: StructuralChoices;
  onTaskToggle: (category: string, taskId: string) => void;
  onPlywoodChange: (thickness: string) => void;
  onNotesChange: (notes: string) => void;
}

export function StructuralSection({
  choices,
  onTaskToggle,
  onPlywoodChange,
  onNotesChange: _onNotesChange,
}: StructuralSectionProps) {
  const [openCard, setOpenCard] = useState<string | null>('wall');

  const wallOptions = [
    { id: 'frame_new_wall', label: 'Frame new wall(s)' },
    { id: 'remove_wall', label: 'Remove non-load bearing wall' },
    {
      id: 'install_blocking',
      label: 'Install blocking for accessories (grab bars, etc.)',
    },
    { id: 'frame_niche', label: 'Frame shower niche' },
  ];

  const floorOptions = [
    { id: 'repair_joist', label: 'Repair / sister floor joists' },
    { id: 'level_floor', label: 'Level floor with self-leveling compound' },
    { id: 'install_plywood', label: 'Install new plywood subfloor' },
    { id: 'replace_rotten_subfloor', label: 'Replace rotten subfloor' },
  ];

  const windowDoorOptions = [
    { id: 'add_new_window', label: 'Add new window' },
    { id: 'enlarge_window', label: 'Enlarging an Existing Window' },
    { id: 'change_doorway', label: 'Changing Doorway' },
    { id: 'close_off_window', label: 'Closing off window' },
  ];

  const plywoodThicknessOptions = [
    { value: '1/2', label: '1/2"' },
    { value: '5/8', label: '5/8"' },
    { value: '3/4', label: '3/4"' },
  ];

  // A reusable card component for categories
  const Card = ({
    title,
    category,
    children,
  }: {
    title: string;
    category: string;
    children: React.ReactNode;
  }) => {
    const isOpen = openCard === category;
    return (
      <div className='bg-white rounded-lg border border-slate-200 shadow-sm'>
        <button
          onClick={() => setOpenCard(isOpen ? null : category)}
          className='w-full flex justify-between items-center p-4'
        >
          <h3 className='text-lg font-bold text-slate-800'>{title}</h3>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`w-5 h-5 text-blue-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M6 9l6 6 6-6' />
          </svg>
        </button>
        {isOpen && (
          <div className='p-4 pt-0 space-y-3 animate-fade-in'>{children}</div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className='pt-2 pb-6'>
        <h2 className='text-4xl font-bold text-slate-800 text-center'>
          Structural & Other
        </h2>
      </div>
      <div className='space-y-6 bg-slate-100 p-6 rounded-xl'>
        <Card title='Wall Modifications' category='wall'>
          {wallOptions.map((opt) => (
            <CheckboxOption
              key={opt.id}
              label={opt.label}
              isChecked={(choices.wall || []).includes(opt.id)}
              onToggle={() => onTaskToggle('wall', opt.id)}
            />
          ))}
        </Card>

        <Card title='Floors' category='floor'>
          {floorOptions.map((opt) => (
            <CheckboxOption
              key={opt.id}
              label={opt.label}
              isChecked={(choices.floor || []).includes(opt.id)}
              onToggle={() => onTaskToggle('floor', opt.id)}
            >
              {opt.id === 'install_plywood' && (
                <Dropdown
                  label='Plywood Thickness'
                  options={plywoodThicknessOptions}
                  selectedOption={choices.plywoodThickness || '3/4'}
                  onSelect={onPlywoodChange}
                />
              )}
            </CheckboxOption>
          ))}
        </Card>

        <Card title='Window & Door Openings' category='windowDoor'>
          {windowDoorOptions.map((opt) => (
            <CheckboxOption
              key={opt.id}
              label={opt.label}
              isChecked={(choices.windowDoor || []).includes(opt.id)}
              onToggle={() => onTaskToggle('windowDoor', opt.id)}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}
