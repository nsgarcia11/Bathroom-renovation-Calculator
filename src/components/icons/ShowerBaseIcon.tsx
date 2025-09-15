import React from 'react';

interface ShowerBaseIconProps {
  size?: number;
  className?: string;
}

export function ShowerBaseIcon({ size = 24, className }: ShowerBaseIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <rect width='18' height='18' x='3' y='3' rx='2' />
      <circle cx='12' cy='12' r='1' />
    </svg>
  );
}
