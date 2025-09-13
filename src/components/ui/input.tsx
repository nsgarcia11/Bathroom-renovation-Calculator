import React from 'react';

interface InputProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
  className?: string;
  // React Hook Form compatibility
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}

export const Input: React.FC<InputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  ref,
  placeholder,
  type = 'text',
  readOnly = false,
  className = '',
}) => (
  <div>
    {label && (
      <label
        htmlFor={id}
        className='block text-lg sm:text-sm font-medium text-slate-600 mb-1'
      >
        {label}
      </label>
    )}
    <input
      type={type}
      id={id}
      name={name || id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full h-12 sm:h-10 text-lg sm:text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 ${className}`}
    />
  </div>
);
