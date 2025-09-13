import React from 'react';

interface SelectProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  children,
  className = '',
}) => (
  <div>
    <label
      htmlFor={id}
      className='block text-lg sm:text-sm font-medium text-slate-600 mb-1'
    >
      {label}
    </label>
    <select
      id={id}
      name={name || id}
      value={value}
      onChange={onChange}
      className={`w-full h-12 sm:h-10 text-lg sm:text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {children}
    </select>
  </div>
);
