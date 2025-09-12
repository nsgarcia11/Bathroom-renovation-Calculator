'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const toggleVariants = cva(
  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-gray-200',
        checked: 'bg-blue-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const thumbVariants = cva(
  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
  {
    variants: {
      position: {
        left: 'translate-x-1',
        right: 'translate-x-6',
      },
    },
    defaultVariants: {
      position: 'left',
    },
  }
);

interface ToggleProps extends VariantProps<typeof toggleVariants> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  title?: string;
  'aria-label'?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  title,
  'aria-label': ariaLabel,
  className,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return checked ? (
    <button
      type='button'
      role='switch'
      aria-checked='true'
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      onClick={handleClick}
      className={toggleVariants({
        variant: 'checked',
        className,
      })}
    >
      <span className={thumbVariants({ position: 'right' })} />
    </button>
  ) : (
    <button
      type='button'
      role='switch'
      aria-checked='false'
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      onClick={handleClick}
      className={toggleVariants({
        variant: 'default',
        className,
      })}
    >
      <span className={thumbVariants({ position: 'left' })} />
    </button>
  );
};
