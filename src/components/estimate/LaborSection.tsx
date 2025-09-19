'use client';

import React, { useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface LaborItem {
  id: string;
  name: string;
  hours: string;
  rate: string;
  color?: string;
}

interface FlatFeeItem {
  id: string;
  name: string;
  price: string;
}

interface LaborSectionProps {
  laborItems: LaborItem[];
  setLaborItems: (items: LaborItem[]) => void;
  flatFeeItems: FlatFeeItem[];
  setFlatFeeItems: (items: FlatFeeItem[]) => void;
  handleAddLaborItem: () => void;
  handleLaborItemChange: (
    id: string,
    field: keyof LaborItem,
    value: string
  ) => void;
  handleDeleteLaborItem: (id: string) => void;
  handleAddFlatFeeItem: () => void;
  handleFlatFeeItemChange: (
    id: string,
    field: keyof FlatFeeItem,
    value: string
  ) => void;
  handleDeleteFlatFeeItem: (id: string) => void;
  isDemolitionFlatFee: 'yes' | 'no';
}

export function LaborSection({
  laborItems,
  flatFeeItems,
  handleAddLaborItem,
  handleLaborItemChange,
  handleDeleteLaborItem,
  handleAddFlatFeeItem,
  handleFlatFeeItemChange,
  handleDeleteFlatFeeItem,
  isDemolitionFlatFee,
}: LaborSectionProps) {
  // Memoized calculations
  const labor = useMemo(() => laborItems || [], [laborItems]);
  const flatFees = useMemo(() => flatFeeItems || [], [flatFeeItems]);

  const hourlyTotal = useMemo(
    () =>
      labor.reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      ),
    [labor]
  );

  const flatFeeTotal = useMemo(
    () =>
      flatFees.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0),
    [flatFees]
  );

  const total = useMemo(
    () => (isDemolitionFlatFee === 'yes' ? flatFeeTotal : hourlyTotal),
    [isDemolitionFlatFee, flatFeeTotal, hourlyTotal]
  );

  const renderLaborItem = useCallback(
    (item: LaborItem) => {
      if (!item) return null;
      return (
        <div
          key={item.id}
          className={`p-3 rounded-lg border bg-white shadow-sm w-full ${
            item.color || 'border-slate-200'
          }`}
        >
          <div className='flex items-center gap-2 mb-2 w-full'>
            <Input
              type='text'
              value={item.name}
              onChange={(e) =>
                handleLaborItemChange(item.id, 'name', e.target.value)
              }
              placeholder='Labor Task'
              className='border-b-2 border-slate-200 focus:border-blue-500 focus:outline-none bg-transparent w-44 sm:w-full'
            />
            <Button
              onClick={() => handleDeleteLaborItem(item.id)}
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-700 p-1 h-auto flex-shrink-0'
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className='grid grid-cols-3 gap-3 w-full'>
            <div className='w-full'>
              <label className='text-xs text-slate-500'>Hours</label>
              <Input
                type='number'
                value={item.hours}
                onChange={(e) =>
                  handleLaborItemChange(item.id, 'hours', e.target.value)
                }
                placeholder='0'
                className='text-center w-full'
              />
            </div>
            <div className='w-full'>
              <label className='text-xs text-slate-500'>Rate ($/hr)</label>
              <Input
                type='number'
                value={item.rate}
                onChange={(e) =>
                  handleLaborItemChange(item.id, 'rate', e.target.value)
                }
                placeholder='0'
                className='text-center w-full'
              />
            </div>
            <div className='w-full'>
              <label className='text-xs text-slate-500'>Total</label>
              <div className='w-full p-2 text-center font-semibold text-slate-800 bg-slate-50 rounded-md'>
                $
                {(
                  (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0)
                ).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      );
    },
    [handleLaborItemChange, handleDeleteLaborItem]
  );

  const renderFlatFeeItem = (item: FlatFeeItem) => {
    const isDemoFee = item.id === 'flat-fee-demolition';
    return (
      <div
        key={item.id}
        className={`p-3 rounded-lg border shadow-sm w-full ${
          isDemoFee ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'
        }`}
      >
        <div className='flex items-center gap-2 mb-2 w-full'>
          <Input
            type='text'
            value={item.name}
            onChange={(e) =>
              handleFlatFeeItemChange(item.id, 'name', e.target.value)
            }
            placeholder='Flat Fee Task'
            className={`border-b-2 border-slate-200 focus:border-blue-500 focus:outline-none bg-transparent w-full ${
              isDemoFee ? 'bg-slate-50 cursor-not-allowed' : ''
            }`}
            readOnly={isDemoFee}
          />
          {!isDemoFee && (
            <Button
              onClick={() => handleDeleteFlatFeeItem(item.id)}
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-700 p-1 h-auto flex-shrink-0'
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
        <div className='w-full'>
          <label className='text-xs text-slate-500'>Total ($)</label>
          <Input
            type='number'
            value={item.price}
            onChange={(e) =>
              handleFlatFeeItemChange(item.id, 'price', e.target.value)
            }
            placeholder='0.00'
            className='text-center w-full'
            readOnly={isDemoFee}
          />
        </div>
      </div>
    );
  };

  const predefinedTasks = labor.filter(
    (item) => item && item.id.startsWith('lab-')
  );
  const customTasks = labor.filter(
    (item) => item && item.id.startsWith('custom-')
  );

  return (
    <div className='space-y-5'>
      <div className='flex justify-between items-baseline'>
        <h2 className='text-2xl font-bold text-slate-800'>Labor Costs</h2>
        <p className='font-bold text-blue-600 text-sm sm:text-lg'>
          ${total.toFixed(2)}
        </p>
      </div>

      <Card>
        <CardContent className='p-3 space-y-3'>
          {isDemolitionFlatFee === 'yes' ? (
            <>
              <h3 className='text-lg font-semibold text-slate-700 px-1'>
                Flat Fee Tasks
              </h3>
              {flatFees.length > 0 ? (
                flatFees.map(renderFlatFeeItem)
              ) : (
                <p className='text-sm text-slate-500 text-center py-4'>
                  No flat fee tasks added.
                </p>
              )}
              <Button
                onClick={handleAddFlatFeeItem}
                variant='outline'
                className='w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold border-blue-200'
              >
                <Plus size={16} />
                Add Custom Flat Fee Task
              </Button>
            </>
          ) : (
            <>
              <h3 className='text-lg font-semibold text-slate-700 px-1'>
                Hourly Tasks
              </h3>
              {predefinedTasks.length > 0 ? (
                <div className='space-y-2 pt-2'>
                  <p className='text-xs font-semibold uppercase text-slate-500 px-1'>
                    Predefined Tasks
                  </p>
                  {predefinedTasks.map(renderLaborItem)}
                </div>
              ) : (
                <p className='text-sm text-slate-500 text-center py-4'>
                  No predefined tasks available.
                </p>
              )}

              {customTasks.length > 0 && (
                <div className='space-y-2 pt-2'>
                  <p className='text-xs font-semibold uppercase text-slate-500 px-1'>
                    Custom Tasks
                  </p>
                  {customTasks.map(renderLaborItem)}
                </div>
              )}

              <Button
                onClick={handleAddLaborItem}
                variant='outline'
                className='w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold border-blue-200'
              >
                <Plus size={16} />
                Add Custom Hourly Task
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
