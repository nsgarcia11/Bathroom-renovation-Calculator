'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface LaborItem {
  id: string;
  name: string;
  hours: string;
  rate: string;
  color?: string;
  scope?: string;
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
  const [isDemolitionOpen, setIsDemolitionOpen] = useState(true);
  const [isCustomTasksOpen, setIsCustomTasksOpen] = useState(true);

  // Memoized calculations
  const labor = useMemo(() => laborItems || [], [laborItems]);
  const flatFees = useMemo(() => flatFeeItems || [], [flatFeeItems]);

  // Filter demolition tasks only
  const demolitionTasks = useMemo(
    () => labor.filter((item) => item && item.id.startsWith('lab-')),
    [labor]
  );

  // Filter custom tasks
  const customTasks = useMemo(
    () => labor.filter((item) => item && item.id.startsWith('custom-')),
    [labor]
  );

  // Calculate totals
  const demolitionTotal = useMemo(
    () =>
      demolitionTasks.reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      ),
    [demolitionTasks]
  );

  const customTasksTotal = useMemo(
    () =>
      customTasks.reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      ),
    [customTasks]
  );

  const hourlyTotal = useMemo(
    () => demolitionTotal + customTasksTotal,
    [demolitionTotal, customTasksTotal]
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

  // Calculate total hours
  const totalHours = useMemo(() => {
    if (isDemolitionFlatFee === 'yes') return 0;
    return (
      demolitionTasks.reduce(
        (sum, item) => sum + (parseFloat(item.hours) || 0),
        0
      ) +
      customTasks.reduce((sum, item) => sum + (parseFloat(item.hours) || 0), 0)
    );
  }, [isDemolitionFlatFee, demolitionTasks, customTasks]);

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

  return (
    <div className='space-y-5'>
      <div className='flex justify-between items-baseline'>
        <h2 className='text-2xl font-bold text-slate-800'>Labor</h2>
        <p className='font-bold text-blue-600 text-sm sm:text-lg'>
          ${total.toFixed(2)}
        </p>
      </div>

      <div className='space-y-4'>
        {isDemolitionFlatFee === 'yes' ? (
          /* Flat Fee Mode */
          <Card>
            <CardContent className='p-3 space-y-3'>
              <div
                className='flex justify-between items-center cursor-pointer'
                onClick={() => setIsDemolitionOpen(!isDemolitionOpen)}
              >
                <div className='flex items-center gap-2'>
                  {isDemolitionOpen ? (
                    <ChevronDown className='h-4 w-4 text-slate-600' />
                  ) : (
                    <ChevronRight className='h-4 w-4 text-slate-600' />
                  )}
                  <h3 className='text-lg font-semibold text-slate-700'>
                    Demolition & Prep
                  </h3>
                </div>
                <p className='font-bold text-blue-600 text-sm'>
                  ${flatFeeTotal.toFixed(2)}
                </p>
              </div>
              {isDemolitionOpen && (
                <>
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
              )}
            </CardContent>
          </Card>
        ) : (
          /* Hourly Mode */
          <>
            {/* Demolition & Prep Section */}
            {demolitionTasks.length > 0 && (
              <Card>
                <CardContent className='p-3 space-y-3'>
                  <div
                    className='flex justify-between items-center cursor-pointer'
                    onClick={() => setIsDemolitionOpen(!isDemolitionOpen)}
                  >
                    <div className='flex items-center gap-2'>
                      {isDemolitionOpen ? (
                        <ChevronDown className='h-4 w-4 text-slate-600' />
                      ) : (
                        <ChevronRight className='h-4 w-4 text-slate-600' />
                      )}
                      <h3 className='text-lg font-semibold text-slate-700'>
                        Demolition & Prep
                      </h3>
                    </div>
                    <div className='flex items-center gap-4'>
                      <span className='text-sm text-slate-600'>
                        {demolitionTasks
                          .reduce(
                            (sum, item) => sum + (parseFloat(item.hours) || 0),
                            0
                          )
                          .toFixed(1)}{' '}
                        hrs
                      </span>
                      <p className='font-bold text-blue-600 text-sm'>
                        ${demolitionTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {isDemolitionOpen && (
                    <div className='space-y-2'>
                      {demolitionTasks.map(renderLaborItem)}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Custom Tasks Section */}
            <Card>
              <CardContent className='p-3 space-y-3'>
                <div
                  className='flex justify-between items-center cursor-pointer'
                  onClick={() => setIsCustomTasksOpen(!isCustomTasksOpen)}
                >
                  <div className='flex items-center gap-2'>
                    {isCustomTasksOpen ? (
                      <ChevronDown className='h-4 w-4 text-slate-600' />
                    ) : (
                      <ChevronRight className='h-4 w-4 text-slate-600' />
                    )}
                    <h3 className='text-lg font-semibold text-slate-700'>
                      Custom Tasks
                    </h3>
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='text-sm text-slate-600'>
                      {customTasks
                        .reduce(
                          (sum, item) => sum + (parseFloat(item.hours) || 0),
                          0
                        )
                        .toFixed(1)}{' '}
                      hrs
                    </span>
                    <p className='font-bold text-blue-600 text-sm'>
                      ${customTasksTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
                {isCustomTasksOpen && (
                  <>
                    {customTasks.length > 0 ? (
                      <div className='space-y-2'>
                        {customTasks.map(renderLaborItem)}
                      </div>
                    ) : (
                      <p className='text-sm text-slate-500 text-center py-4'>
                        No custom tasks added.
                      </p>
                    )}
                    <Button
                      onClick={handleAddLaborItem}
                      variant='outline'
                      className='w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold border-blue-200'
                    >
                      <Plus size={16} />
                      Add Custom Labor Task
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Total Labor Cost Section */}
        <Card>
          <CardContent className='p-4'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-bold text-slate-800'>
                Total Labor Cost
              </h3>
              <div className='flex items-center gap-4'>
                {isDemolitionFlatFee === 'no' && (
                  <span className='text-sm text-slate-600'>
                    {totalHours.toFixed(1)} hrs
                  </span>
                )}
                <p className='text-2xl font-bold text-blue-600'>
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
