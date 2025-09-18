import React from 'react';

interface ConfigurableTaskProps {
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function ConfigurableTask({
  label,
  isEnabled,
  onToggle,
  children,
}: ConfigurableTaskProps) {
  return (
    <div>
      <label className='flex items-center justify-between cursor-pointer'>
        <span className='text-sm font-semibold text-slate-700'>{label}</span>
        <div className='relative inline-flex items-center'>
          <input
            type='checkbox'
            checked={isEnabled}
            onChange={onToggle}
            className='sr-only peer'
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer border-2 border-blue-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </div>
      </label>
      {isEnabled && (
        <div className='pl-6 pt-3 mt-2 ml-5 space-y-3 border-l-2 border-slate-200 animate-fade-in'>
          {children}
        </div>
      )}
    </div>
  );
}
