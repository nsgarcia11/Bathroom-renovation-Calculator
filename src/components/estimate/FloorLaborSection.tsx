'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface LaborItem {
  id: string;
  name: string;
  hours: string;
  rate: string;
  scope?: string;
}

interface FloorLaborSectionProps {
  laborItems: LaborItem[];
  onAddLaborItem: () => void;
  onLaborItemChange: (id: string, field: string, value: string) => void;
  onDeleteLaborItem: (id: string) => void;
}

export function FloorLaborSection({
  laborItems,
  onAddLaborItem,
  onLaborItemChange,
  onDeleteLaborItem,
}: FloorLaborSectionProps) {
  const [isDesignOpen, setIsDesignOpen] = useState(true);
  const [isConstructionOpen, setIsConstructionOpen] = useState(true);
  const [isStructuralOpen, setIsStructuralOpen] = useState(true);

  // Group labor items by scope
  const designTasks = laborItems.filter(
    (item) => item && item.scope === 'floor_design'
  );
  const constructionTasks = laborItems.filter(
    (item) => item && item.scope === 'floor_construction'
  );
  const structuralTasks = laborItems.filter(
    (item) => item && item.scope === 'floor_structural'
  );
  const customTasks = laborItems.filter(
    (item) => item && item.id.startsWith('custom-')
  );

  // Calculate totals
  const designTotal = designTasks.reduce(
    (sum, item) =>
      sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
    0
  );
  const constructionTotal = constructionTasks.reduce(
    (sum, item) =>
      sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
    0
  );
  const structuralTotal = structuralTasks.reduce(
    (sum, item) =>
      sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
    0
  );
  const customTotal = customTasks.reduce(
    (sum, item) =>
      sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
    0
  );

  const totalLabor =
    designTotal + constructionTotal + structuralTotal + customTotal;

  const renderLaborItem = (item: LaborItem) => {
    if (!item) return null;
    const isAuto = item.id.startsWith('fl-');
    return (
      <div
        key={item.id}
        className='flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200'
      >
        <div className='flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2'>
          <div>
            <Label
              htmlFor={`name-${item.id}`}
              className='text-xs text-slate-600'
            >
              Task Name
            </Label>
            <Input
              id={`name-${item.id}`}
              value={item.name}
              onChange={(e) =>
                onLaborItemChange(item.id, 'name', e.target.value)
              }
              className='text-sm'
              placeholder='Task name'
              readOnly={isAuto}
            />
          </div>
          <div>
            <Label
              htmlFor={`hours-${item.id}`}
              className='text-xs text-slate-600'
            >
              Hours
            </Label>
            <Input
              id={`hours-${item.id}`}
              type='number'
              value={item.hours}
              onChange={(e) =>
                onLaborItemChange(item.id, 'hours', e.target.value)
              }
              className='text-sm'
              placeholder='0'
              readOnly={isAuto}
            />
          </div>
          <div>
            <Label
              htmlFor={`rate-${item.id}`}
              className='text-xs text-slate-600'
            >
              Rate ($/hr)
            </Label>
            <Input
              id={`rate-${item.id}`}
              type='number'
              value={item.rate}
              onChange={(e) =>
                onLaborItemChange(item.id, 'rate', e.target.value)
              }
              className='text-sm'
              placeholder='0.00'
            />
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <div className='text-right text-sm font-medium text-slate-700 min-w-[80px]'>
            $
            {(
              (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0)
            ).toFixed(2)}
          </div>
          {!isAuto && (
            <Button
              onClick={() => onDeleteLaborItem(item.id)}
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50'
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-baseline mb-3'>
        <h2 className='text-2xl font-bold text-slate-800'>Labor</h2>
        <p className='font-bold text-blue-600 text-lg'>
          ${totalLabor.toFixed(2)}
        </p>
      </div>

      <div className='space-y-4'>
        {/* Design Labor Section */}
        {designTasks.length > 0 && (
          <Card>
            <CardContent className='p-3 space-y-3'>
              <div
                className='flex justify-between items-center cursor-pointer'
                onClick={() => setIsDesignOpen(!isDesignOpen)}
              >
                <div className='flex items-center gap-2'>
                  {isDesignOpen ? (
                    <ChevronDown className='h-4 w-4 text-slate-600' />
                  ) : (
                    <ChevronRight className='h-4 w-4 text-slate-600' />
                  )}
                  <h3 className='text-lg font-semibold text-slate-700'>
                    Design Labor
                  </h3>
                </div>
                <p className='font-bold text-blue-600 text-sm'>
                  ${designTotal.toFixed(2)}
                </p>
              </div>
              {isDesignOpen && (
                <div className='space-y-2'>
                  {designTasks.map(renderLaborItem)}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Construction Labor Section */}
        {constructionTasks.length > 0 && (
          <Card>
            <CardContent className='p-3 space-y-3'>
              <div
                className='flex justify-between items-center cursor-pointer'
                onClick={() => setIsConstructionOpen(!isConstructionOpen)}
              >
                <div className='flex items-center gap-2'>
                  {isConstructionOpen ? (
                    <ChevronDown className='h-4 w-4 text-slate-600' />
                  ) : (
                    <ChevronRight className='h-4 w-4 text-slate-600' />
                  )}
                  <h3 className='text-lg font-semibold text-slate-700'>
                    Construction Labor
                  </h3>
                </div>
                <p className='font-bold text-blue-600 text-sm'>
                  ${constructionTotal.toFixed(2)}
                </p>
              </div>
              {isConstructionOpen && (
                <div className='space-y-2'>
                  {constructionTasks.map(renderLaborItem)}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Structural Labor Section */}
        {structuralTasks.length > 0 && (
          <Card>
            <CardContent className='p-3 space-y-3'>
              <div
                className='flex justify-between items-center cursor-pointer'
                onClick={() => setIsStructuralOpen(!isStructuralOpen)}
              >
                <div className='flex items-center gap-2'>
                  {isStructuralOpen ? (
                    <ChevronDown className='h-4 w-4 text-slate-600' />
                  ) : (
                    <ChevronRight className='h-4 w-4 text-slate-600' />
                  )}
                  <h3 className='text-lg font-semibold text-slate-700'>
                    Structural Labor
                  </h3>
                </div>
                <p className='font-bold text-blue-600 text-sm'>
                  ${structuralTotal.toFixed(2)}
                </p>
              </div>
              {isStructuralOpen && (
                <div className='space-y-2'>
                  {structuralTasks.map(renderLaborItem)}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Custom Tasks Section */}
        {customTasks.length > 0 && (
          <Card>
            <CardContent className='p-3 space-y-3'>
              <div className='flex justify-between items-baseline'>
                <h3 className='text-lg font-semibold text-slate-700 px-1'>
                  Custom Tasks
                </h3>
                <p className='font-bold text-blue-600 text-sm'>
                  ${customTotal.toFixed(2)}
                </p>
              </div>
              <div className='space-y-2'>
                {customTasks.map(renderLaborItem)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Total Section */}
        <Card>
          <CardContent className='p-4'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-bold text-slate-800'>Total Labor</h3>
              <p className='text-2xl font-bold text-blue-600'>
                ${totalLabor.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Add Custom Task Button */}
        <Button
          onClick={onAddLaborItem}
          variant='outline'
          className='w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold border-blue-200'
        >
          <Plus size={16} />
          Add Custom Labor Task
        </Button>
      </div>
    </div>
  );
}
