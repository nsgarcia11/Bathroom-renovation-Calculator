import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  price?: number;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  price = 0,
  checked,
  onChange,
  className = '',
}) => (
  <label
    htmlFor={id}
    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
      checked
        ? 'bg-blue-50 border-blue-600 shadow-md'
        : 'border-slate-300 hover:border-slate-400'
    } ${className}`}
  >
    <div>
      <span className='font-medium text-slate-800 text-sm'>{label}</span>
    </div>
    <div className='flex items-center'>
      {price > 0 && (
        <span className='text-slate-600 mr-3 text-sm font-semibold'>
          ${price.toFixed(2)}
        </span>
      )}
      <input
        type='checkbox'
        id={id}
        checked={checked}
        onChange={onChange}
        className='form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500'
      />
    </div>
  </label>
);
