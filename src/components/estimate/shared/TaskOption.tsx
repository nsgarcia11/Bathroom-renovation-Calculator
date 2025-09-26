import React from 'react';
import { Input } from '@/components/ui/input';

interface TaskOptionProps {
  option: {
    id: string;
    label: string;
    hasQuantity?: boolean;
  };
  selection?: {
    id: string;
    quantity: number;
  };
  onToggle: () => void;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TaskOption({
  option,
  selection,
  onToggle,
  onQuantityChange,
}: TaskOptionProps) {
  const { label, hasQuantity } = option;
  const isChecked = !!selection;

  return (
    <div className='p-4 bg-white rounded-lg border border-blue-300'>
      <label className='flex items-center justify-between cursor-pointer'>
        <span className='text-sm font-semibold text-slate-700'>{label}</span>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={onToggle}
            className='sr-only peer'
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border-2 border-blue-300 peer-checked:border-blue-600"></div>
        </div>
      </label>
      {isChecked && hasQuantity && (
        <div className='mt-3 pt-3 border-t border-slate-200 animate-fade-in flex items-center justify-between'>
          <span className='text-sm font-medium text-slate-600'>Quantity</span>
          <Input
            type='number'
            value={selection?.quantity?.toString() || '1'}
            onChange={onQuantityChange}
            className='w-24 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
            aria-label='Quantity'
          />
        </div>
      )}
    </div>
  );
}
