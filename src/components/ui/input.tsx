import React from 'react';

interface InputProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  readOnly = false,
  className = '',
}) => (
  <div>
    <label
      htmlFor={id}
      className='block text-sm font-medium text-slate-600 mb-1'
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name || id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`block w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 ${className}`}
    />
  </div>
);
