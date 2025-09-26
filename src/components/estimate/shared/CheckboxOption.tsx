import React from 'react';

interface CheckboxOptionProps {
  label: string;
  isChecked: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export function CheckboxOption({
  label,
  isChecked,
  onToggle,
  children,
}: CheckboxOptionProps) {
  return (
    <div className='p-4 bg-white rounded-lg border border-slate-200 shadow-sm'>
      <label className='flex items-center justify-between cursor-pointer'>
        <span className='text-sm font-semibold text-slate-700'>{label}</span>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={onToggle}
            className='sr-only peer'
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full border-2 border-blue-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </div>
      </label>
      {isChecked && children && (
        <div className='mt-3 pt-3 border-t border-slate-200 animate-fade-in'>
          {children}
        </div>
      )}
    </div>
  );
}
