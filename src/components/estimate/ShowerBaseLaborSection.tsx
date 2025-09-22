import React, { useMemo, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { CollapsibleCard } from './CollapsibleCard';

interface LaborItem {
  id: string;
  name: string;
  hours: string;
  rate: string;
  color?: string;
  scope?: string;
}

interface ShowerBaseLaborSectionProps {
  laborItems: LaborItem[];
  onAddLaborItem: () => void;
  onLaborItemChange: (id: string, field: string, value: string) => void;
  onDeleteLaborItem: (id: string) => void;
}

export default function ShowerBaseLaborSection({
  laborItems,
  onAddLaborItem,
  onLaborItemChange,
  onDeleteLaborItem,
}: ShowerBaseLaborSectionProps) {
  // State for managing collapsed sections
  const [isDesignCollapsed, setIsDesignCollapsed] = useState(true);
  const [isConstructionCollapsed, setIsConstructionCollapsed] = useState(true);

  // Memoized calculations
  const labor = useMemo(() => laborItems || [], [laborItems]);

  // Group labor items by type
  const designTasks = useMemo(
    () =>
      labor.filter(
        (item) =>
          item &&
          item.id.startsWith('sb-') &&
          item.scope === 'showerBase_design'
      ),
    [labor]
  );
  const constructionTasks = useMemo(
    () =>
      labor.filter(
        (item) =>
          item &&
          item.id.startsWith('sb-') &&
          item.scope === 'showerBase_construction'
      ),
    [labor]
  );
  const customTasks = useMemo(
    () => labor.filter((item) => item && item.id.startsWith('custom-')),
    [labor]
  );

  // Calculate totals for each category
  const designTotal = useMemo(
    () =>
      designTasks.reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      ),
    [designTasks]
  );
  const constructionTotal = useMemo(
    () =>
      constructionTasks.reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      ),
    [constructionTasks]
  );
  const customTotal = useMemo(
    () =>
      customTasks.reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      ),
    [customTasks]
  );

  const grandTotal = useMemo(
    () => designTotal + constructionTotal + customTotal,
    [designTotal, constructionTotal, customTotal]
  );

  const renderLaborItem = useCallback(
    (item: LaborItem) => {
      if (!item) return null;

      // Handle note items (trade installation, etc.)
      if (
        item.scope === 'showerBase_design' &&
        item.hours === '0' &&
        item.rate === '0'
      ) {
        return (
          <div
            key={item.id}
            className='flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border'
          >
            <div className='flex items-center gap-2'>
              <div className='w-5 h-5 text-blue-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
                </svg>
              </div>
              <span className='text-sm font-medium text-slate-700'>
                {item.name}
              </span>
            </div>
            <span className='text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full'>
              See Trade Screen
            </span>
          </div>
        );
      }

      return (
        <div
          key={item.id}
          className='labor-item p-3 bg-white rounded-lg shadow-sm border'
        >
          <div className='flex justify-between items-center mb-2'>
            <Input
              value={item.name}
              onChange={(e) =>
                onLaborItemChange(item.id, 'name', e.target.value)
              }
              className='item-label w-full text-md font-bold border-none shadow-none p-0 focus-visible:ring-0'
              placeholder='Labor task name'
            />
            <Button
              onClick={() => onDeleteLaborItem(item.id)}
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-700 hover:bg-red-50 p-1 ml-2 flex-shrink-0'
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <div>
              <Label className='block text-xs font-medium text-slate-500 mb-1'>
                Hours
              </Label>
              <Input
                type='number'
                value={item.hours}
                onChange={(e) =>
                  onLaborItemChange(item.id, 'hours', e.target.value)
                }
                className='w-full text-sm p-2 h-9 rounded-md text-center'
                placeholder='0'
              />
            </div>
            <div>
              <Label className='block text-xs font-medium text-slate-500 mb-1'>
                Rate
              </Label>
              <Input
                type='number'
                value={item.rate}
                onChange={(e) =>
                  onLaborItemChange(item.id, 'rate', e.target.value)
                }
                className='w-full text-sm p-2 h-9 rounded-md text-center'
                placeholder='0'
              />
            </div>
            <div className='text-right'>
              <Label className='block text-xs font-medium text-slate-500 mb-1'>
                Total
              </Label>
              <div className='font-semibold text-slate-800 text-md h-9 flex items-center justify-end mt-1'>
                <span className='labor-total'>
                  $
                  {(
                    (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    },
    [onLaborItemChange, onDeleteLaborItem]
  );

  return (
    <div className='space-y-5'>
      {/* Design Labor Section - Collapsible */}
      {designTasks.length > 0 && (
        <CollapsibleCard
          title='Design Labor'
          isOpen={!isDesignCollapsed}
          onToggle={() => setIsDesignCollapsed(!isDesignCollapsed)}
          headerContent={
            <p className='font-bold text-blue-600 text-sm'>
              ${designTotal.toFixed(2)}
            </p>
          }
        >
          <div className='space-y-2'>{designTasks.map(renderLaborItem)}</div>
        </CollapsibleCard>
      )}

      {/* Construction Labor Section - Collapsible */}
      {constructionTasks.length > 0 && (
        <CollapsibleCard
          title='Construction Labor'
          isOpen={!isConstructionCollapsed}
          onToggle={() => setIsConstructionCollapsed(!isConstructionCollapsed)}
          headerContent={
            <p className='font-bold text-blue-600 text-sm'>
              ${constructionTotal.toFixed(2)}
            </p>
          }
        >
          <div className='space-y-2'>
            {constructionTasks.map(renderLaborItem)}
          </div>
        </CollapsibleCard>
      )}

      {/* Custom Tasks Section - Always visible */}
      {customTasks.length > 0 && (
        <Card>
          <CardContent className='p-3 space-y-3'>
            <div className='flex justify-between items-baseline'>
              <h3 className='text-lg font-semibold text-slate-700 px-1'>
                Custom Labor
              </h3>
              <p className='font-bold text-blue-600 text-sm'>
                ${customTotal.toFixed(2)}
              </p>
            </div>
            <div className='space-y-2'>{customTasks.map(renderLaborItem)}</div>
          </CardContent>
        </Card>
      )}

      {/* Show message if no labor */}
      {designTasks.length === 0 &&
        constructionTasks.length === 0 &&
        customTasks.length === 0 && (
          <Card>
            <CardContent className='p-6'>
              <p className='text-sm text-slate-500 text-center py-4'>
                No shower base labor available. Select base type and other
                design options to generate labor.
              </p>
            </CardContent>
          </Card>
        )}

      {/* Add Custom Labor Button */}
      <Button
        onClick={onAddLaborItem}
        variant='outline'
        className='w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold border-blue-200'
      >
        <Plus size={16} />
        Add Custom Labor Task
      </Button>

      {/* Total Section - At the bottom */}
      <Card className='border-red-200'>
        <CardContent className='p-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-slate-800'>
              Total Labor Cost
            </h3>
            <div className='text-right'>
              <p className='text-sm text-slate-600'>
                {designTasks.length +
                  constructionTasks.length +
                  customTasks.length}{' '}
                tasks
              </p>
              <p className='font-bold text-blue-600 text-lg'>
                ${grandTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
