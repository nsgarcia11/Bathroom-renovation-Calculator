'use client';

import { Hammer, ShowerHead, Square, Layers, Paintbrush2 } from 'lucide-react';

export function WorkflowNavigation() {
  return (
    <div className='bg-white border-b border-gray-200'>
      <div className='max-w-4xl mx-auto px-4 py-3'>
        <div className='flex justify-center space-x-8 overflow-x-auto'>
          <div className='flex items-center space-x-1 px-3 py-2 rounded-lg whitespace-nowrap text-gray-400 cursor-not-allowed'>
            <Hammer className='h-4 w-4' />
            <span className='text-sm font-medium'>Demolition</span>
          </div>
          <div className='flex items-center space-x-1 px-3 py-2 rounded-lg whitespace-nowrap text-gray-400 cursor-not-allowed'>
            <ShowerHead className='h-4 w-4' />
            <span className='text-sm font-medium'>Shower Walls</span>
          </div>
          <div className='flex items-center space-x-1 px-3 py-2 rounded-lg whitespace-nowrap text-gray-400 cursor-not-allowed'>
            <Square className='h-4 w-4' />
            <span className='text-sm font-medium'>Shower Base</span>
          </div>
          <div className='flex items-center space-x-1 px-3 py-2 rounded-lg whitespace-nowrap text-gray-400 cursor-not-allowed'>
            <Layers className='h-4 w-4' />
            <span className='text-sm font-medium'>Floors</span>
          </div>
          <div className='flex items-center space-x-1 px-3 py-2 rounded-lg whitespace-nowrap text-gray-400 cursor-not-allowed'>
            <Paintbrush2 className='h-4 w-4' />
            <span className='text-sm font-medium'>Finishings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
