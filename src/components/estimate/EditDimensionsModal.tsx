'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface EditDimensionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dimension: { ft: number; inch: number };
  setDimension: (dimension: { ft: number; inch: number }) => void;
}

export function EditDimensionsModal({
  isOpen,
  onClose,
  dimension,
  setDimension,
}: EditDimensionsModalProps) {
  const [localDimension, setLocalDimension] = useState(dimension);

  const handleTotalInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const totalInches = parseInt(e.target.value, 10);
    if (isNaN(totalInches)) {
      setLocalDimension({ ft: 0, inch: 0 });
      return;
    }
    const ft = Math.floor(totalInches / 12);
    const inch = totalInches % 12;
    setLocalDimension({ ft, inch });
  };

  const handleDone = () => {
    setDimension(localDimension);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40'
      onClick={handleDone}
    >
      <div
        className='bg-white rounded-lg shadow-xl p-6 w-80'
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className='text-xl font-bold mb-6 text-center text-slate-800'>
          Edit Dimension
        </h3>
        <div className='mb-6'>
          <Label className='block text-center text-sm font-medium text-slate-500 mb-2'>
            Inches
          </Label>
          <input
            type='number'
            value={String(localDimension.ft * 12 + localDimension.inch)}
            onChange={handleTotalInchesChange}
            className='w-full p-2 border border-slate-300 rounded-md text-center text-2xl font-semibold'
            autoFocus
            aria-label='Total inches'
          />
        </div>
        <Button
          onClick={handleDone}
          className='w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors'
        >
          Done
        </Button>
      </div>
    </div>
  );
}
