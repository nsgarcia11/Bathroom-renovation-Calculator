import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  ref,
  placeholder,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className='w-full'>
      {label && (
        <label
          htmlFor={id}
          className='block text-lg sm:text-sm font-medium text-slate-600 mb-1'
        >
          {label}
        </label>
      )}
      <div className='relative'>
        <input
          type={visible ? 'text' : 'password'}
          id={id}
          name={name || id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          placeholder={placeholder}
          className={`w-full h-12 sm:h-10 text-lg sm:text-sm border rounded-md px-3 py-2 pr-10 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 ${className}`}
        />
        <button
          type='button'
          onClick={() => setVisible(!visible)}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
          tabIndex={-1}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};
