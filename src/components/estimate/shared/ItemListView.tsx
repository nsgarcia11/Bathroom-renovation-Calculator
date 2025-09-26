'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import type { LaborItem, MaterialItem } from '@/types/estimate';

interface ItemListViewProps {
  title: string;
  itemsByCategory: { [category: string]: (LaborItem | MaterialItem)[] };
  onUpdateItem: (
    id: string,
    updatedValues: Partial<LaborItem | MaterialItem>
  ) => void;
  onAddItem: (category: string) => void;
  onDeleteItem: (id: string) => void;
  itemType: 'labor' | 'material';
}

const CATEGORY_STYLES = {
  wall: { name: 'Wall Modifications', bg: 'bg-white', text: 'text-slate-800' },
  floor: { name: 'Floors', bg: 'bg-white', text: 'text-slate-800' },
  windowDoor: {
    name: 'Window & Door Openings',
    bg: 'bg-white',
    text: 'text-slate-800',
  },
};

export function ItemListView({
  title,
  itemsByCategory,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  itemType,
}: ItemListViewProps) {
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const total = Object.values(itemsByCategory)
    .flat()
    .reduce((sum, item) => {
      const quantity =
        itemType === 'labor'
          ? (item as LaborItem).hours
          : (item as MaterialItem).quantity;
      const price =
        itemType === 'labor'
          ? (item as LaborItem).rate
          : (item as MaterialItem).price;
      return (
        sum +
        (parseFloat(quantity || '0') || 0) * (parseFloat(price || '0') || 0)
      );
    }, 0);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-slate-800'>{title}</h2>
        <p className='font-bold text-blue-600 text-lg'>${total.toFixed(2)}</p>
      </div>
      <div className='space-y-4'>
        {Object.entries(itemsByCategory).map(([category, items]) => {
          if (items.length === 0) return null;
          const style =
            CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES];
          const categoryTotal = items.reduce((sum, item) => {
            const quantity =
              itemType === 'labor'
                ? (item as LaborItem).hours
                : (item as MaterialItem).quantity;
            const price =
              itemType === 'labor'
                ? (item as LaborItem).rate
                : (item as MaterialItem).price;
            return (
              sum +
              (parseFloat(quantity || '0') || 0) *
                (parseFloat(price || '0') || 0)
            );
          }, 0);
          const isOpen = !!openCategories[category];

          return (
            <div key={category} className={`${style.bg} rounded-xl shadow-sm`}>
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full p-4 flex justify-between items-center ${style.text}`}
              >
                <h3 className='text-lg font-bold'>{style.name}</h3>
                <div className='flex items-center gap-4'>
                  <span className='font-semibold'>
                    ${categoryTotal.toFixed(2)}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </div>
              </button>
              {isOpen && (
                <div className='p-4 pt-0 space-y-3 animate-fade-in'>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className='p-4 bg-white rounded-lg shadow-sm'
                    >
                      <div className='flex justify-between items-start gap-2'>
                        <Input
                          type='text'
                          value={item.name}
                          onChange={(e) =>
                            onUpdateItem(item.id, { name: e.target.value })
                          }
                          className='flex-grow font-semibold text-slate-800 p-1 border border-transparent hover:border-slate-200 focus:border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                        />
                        <Button
                          onClick={() => onDeleteItem(item.id)}
                          className='flex-shrink-0 p-1 text-red-400 hover:text-red-600 ml-2'
                          variant='ghost'
                          size='sm'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                      <div className='grid grid-cols-3 gap-4 mt-2'>
                        <div>
                          <label className='text-xs text-slate-500'>
                            {itemType === 'labor' ? 'Hours' : 'Quantity'}
                          </label>
                          <Input
                            type='number'
                            value={
                              itemType === 'labor'
                                ? (item as LaborItem).hours
                                : (item as MaterialItem).quantity
                            }
                            onChange={(e) =>
                              onUpdateItem(
                                item.id,
                                itemType === 'labor'
                                  ? { hours: e.target.value }
                                  : { quantity: e.target.value }
                              )
                            }
                            className='w-full p-2 text-center border rounded-lg'
                          />
                        </div>
                        <div>
                          <label className='text-xs text-slate-500'>
                            {itemType === 'labor'
                              ? 'Rate ($/hr)'
                              : 'Price/Unit ($)'}
                          </label>
                          <Input
                            type='number'
                            value={
                              itemType === 'labor'
                                ? (item as LaborItem).rate
                                : (item as MaterialItem).price
                            }
                            onChange={(e) =>
                              onUpdateItem(
                                item.id,
                                itemType === 'labor'
                                  ? { rate: e.target.value }
                                  : { price: e.target.value }
                              )
                            }
                            className='w-full p-2 text-center border rounded-lg'
                          />
                        </div>
                        <div>
                          <label className='text-xs text-slate-500'>
                            Total
                          </label>
                          <p className='w-full p-2 text-center font-semibold text-slate-800'>
                            $
                            {(() => {
                              const quantity =
                                itemType === 'labor'
                                  ? (item as LaborItem).hours
                                  : (item as MaterialItem).quantity;
                              const price =
                                itemType === 'labor'
                                  ? (item as LaborItem).rate
                                  : (item as MaterialItem).price;
                              return (
                                (parseFloat(quantity || '0') || 0) *
                                (parseFloat(price || '0') || 0)
                              ).toFixed(2);
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => onAddItem(category)}
                    className='w-full text-sm font-semibold text-blue-600 hover:text-blue-800 py-2 mt-2 rounded-lg hover:bg-blue-100 transition-colors'
                    variant='ghost'
                  >
                    <Plus className='w-4 h-4 mr-2' />
                    Add Custom {itemType === 'labor' ? 'Labor' : 'Material'}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {total === 0 && (
          <p className='text-slate-500 text-center py-4'>
            No {itemType} items selected.
          </p>
        )}
      </div>
    </div>
  );
}
