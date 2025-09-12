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
      className='block text-sm font-medium text-slate-600 mb-1'
    >
      {label}
    </label>
    <select
      id={id}
      name={name || id}
      value={value}
      onChange={onChange}
      className={`block w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      {children}
    </select>
  </div>
);
