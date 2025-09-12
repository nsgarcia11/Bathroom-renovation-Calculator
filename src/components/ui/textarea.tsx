import React from 'react';

interface TextareaProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  helperText?: string;
  rows?: number;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  helperText,
  rows = 4,
  className = '',
}) => (
  <div>
    <label
      htmlFor={id}
      className='block text-sm font-medium text-slate-600 mb-1'
    >
      {label}
    </label>
    <textarea
      id={id}
      name={name || id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 ${className}`}
    />
    {helperText && <p className='mt-2 text-xs text-slate-500'>{helperText}</p>}
  </div>
);
