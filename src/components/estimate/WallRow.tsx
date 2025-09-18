'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Wall {
  id: string;
  name: string;
  height: { ft: number; inch: number };
  width: { ft: number; inch: number };
  sqft: number;
}

interface WallRowProps {
  wall: Wall;
  onEdit: (wallId: string, field: 'height' | 'width') => void;
  onDelete: (wallId: string) => void;
}

export function WallRow({ wall, onEdit, onDelete }: WallRowProps) {
  const heightInInches = wall.height.ft * 12 + wall.height.inch;
  const widthInInches = wall.width.ft * 12 + wall.width.inch;

  return (
    <div className='bg-white p-2 rounded-lg shadow-sm flex items-center justify-between border border-slate-200'>
      <span className='font-medium text-slate-800 w-1/3'>{wall.name}</span>
      <div className='flex items-center space-x-2'>
        <div
          className='text-center cursor-pointer hover:bg-slate-100 p-2 rounded-md border border-blue-300'
          onClick={() => onEdit(wall.id, 'height')}
        >
          <div className='text-sm text-slate-500'>H</div>
          <div className='text-lg font-medium text-slate-800'>{`${heightInInches}"`}</div>
        </div>
        <div
          className='text-center cursor-pointer hover:bg-slate-100 p-2 rounded-md border border-blue-300'
          onClick={() => onEdit(wall.id, 'width')}
        >
          <div className='text-sm text-slate-500'>W</div>
          <div className='text-lg font-medium text-slate-800'>{`${widthInInches}"`}</div>
        </div>
      </div>
      <div className='flex items-center'>
        <span className='text-slate-600 text-sm text-right w-20 mr-2'>
          {wall.sqft.toFixed(2)} sq/ft
        </span>
        <Button
          onClick={() => onDelete(wall.id)}
          variant='ghost'
          size='sm'
          className='text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100'
        >
          <Trash2 className='h-5 w-5' />
        </Button>
      </div>
    </div>
  );
}
