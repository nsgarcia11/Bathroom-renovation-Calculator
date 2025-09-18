'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { TradeItem } from '@/types/trades';

interface LaborItemEditorProps {
  item: TradeItem;
  onUpdateItem: (id: string, updatedValues: Partial<TradeItem>) => void;
  onDeleteItem: (item: TradeItem) => void;
  onPriceChange: (taskId: string, price: string) => void;
  onModelChange: (taskId: string, model: 'hourly' | 'flat') => void;
  onHoursChange: (taskId: string, hours: string) => void;
  onRateChange: (rateKey: string, rate: string) => void;
  onQuantityChange: (taskId: string, quantity: string) => void;
}

export function LaborItemEditor({
  item,
  onUpdateItem,
  onDeleteItem,
  onPriceChange,
  onModelChange,
  onHoursChange,
  onRateChange,
  onQuantityChange,
}: LaborItemEditorProps) {
  const isCustom = item.id.startsWith('custom-');

  const handleModelToggle = () => {
    const newModel = item.pricingModel === 'hourly' ? 'flat' : 'hourly';
    onModelChange(item.parentTaskId || '', newModel);
  };

  return (
    <div className='p-4 bg-white rounded-lg border border-slate-300'>
      <div className='flex justify-between items-start mb-2'>
        <Input
          type='text'
          value={item.name}
          onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
          readOnly={!isCustom}
          className={`w-full font-semibold text-slate-800 p-1 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 ${
            !isCustom && 'bg-slate-50 cursor-default'
          }`}
        />
        <Button
          onClick={() => onDeleteItem(item)}
          className='p-1 text-red-400 hover:text-red-600 ml-2 flex-shrink-0'
          variant='ghost'
          size='sm'
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </div>

      <div className='flex justify-center items-center my-3'>
        <div className='flex items-center bg-blue-100 rounded-lg p-1'>
          <button
            onClick={
              item.pricingModel !== 'flat' ? handleModelToggle : undefined
            }
            className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${
              item.pricingModel === 'flat'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-blue-800'
            }`}
          >
            Flat Rate
          </button>
          <button
            onClick={
              item.pricingModel !== 'hourly' ? handleModelToggle : undefined
            }
            className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${
              item.pricingModel === 'hourly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-blue-800'
            }`}
          >
            Hourly
          </button>
        </div>
      </div>

      {item.pricingModel === 'hourly' ? (
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-xs text-slate-500'>Hours</label>
            <Input
              type='number'
              value={item.hours?.toString() || '0'}
              onChange={(e) =>
                onHoursChange(item.parentTaskId || '', e.target.value)
              }
              className='w-full p-2 text-center border rounded-lg'
            />
          </div>
          <div>
            <label className='text-xs text-slate-500'>Rate ($/hr)</label>
            <Input
              type='number'
              value={item.rate?.toString() || '0'}
              onChange={(e) => onRateChange(item.rateKey || '', e.target.value)}
              className='w-full p-2 text-center border rounded-lg'
            />
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-xs text-slate-500'>Price per Item</label>
            <div className='flex items-center'>
              <span className='text-slate-500 mr-2'>$</span>
              <Input
                type='number'
                value={item.price?.toString() || '0'}
                onChange={(e) =>
                  onPriceChange(item.parentTaskId || '', e.target.value)
                }
                className='w-full p-2 text-right font-semibold border border-slate-300 rounded-lg'
              />
            </div>
          </div>
          <div>
            <label className='text-xs text-slate-500'>Quantity</label>
            <Input
              type='number'
              value={item.quantity?.toString() || '1'}
              onChange={(e) =>
                onQuantityChange(item.parentTaskId || '', e.target.value)
              }
              className='w-full p-2 text-center border rounded-lg'
            />
          </div>
        </div>
      )}
      <div className='border-t border-slate-200 mt-4 pt-2 flex justify-between items-center'>
        <span className='font-semibold text-slate-600'>Total</span>
        <span className='font-bold text-blue-600 text-lg'>
          ${item.totalCost.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
