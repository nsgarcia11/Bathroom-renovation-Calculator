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

interface ShowerWallsLaborSectionProps {
  laborItems: LaborItem[];
  onAddLaborItem: () => void;
  onLaborItemChange: (id: string, field: string, value: string) => void;
  onDeleteLaborItem: (id: string) => void;
}

export default function ShowerWallsLaborSection({
  laborItems,
  onAddLaborItem,
  onLaborItemChange,
  onDeleteLaborItem,
}: ShowerWallsLaborSectionProps) {
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
          item.id.startsWith('sw-') &&
          item.scope === 'showerWalls_design'
      ),
    [labor]
  );
  const constructionTasks = useMemo(
    () =>
      labor.filter(
        (item) =>
          item &&
          item.id.startsWith('sw-') &&
          item.scope === 'showerWalls_construction'
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

  // Calculate grand total
  const grandTotal = useMemo(() => {
    return designTotal + constructionTotal + customTotal;
  }, [designTotal, constructionTotal, customTotal]);

  const renderLaborItem = useCallback(
    (item: LaborItem) => {
      if (!item) return null;
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
            <Button
              onClick={() => onDeleteLaborItem(item.id)}
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50'
            >
              <Trash2 size={14} />
            </Button>
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
                Custom Tasks
              </h3>
              <p className='font-bold text-blue-600 text-sm'>
                ${customTotal.toFixed(2)}
              </p>
            </div>
            <div className='space-y-2'>{customTasks.map(renderLaborItem)}</div>
          </CardContent>
        </Card>
      )}

      {/* Show message if no tasks */}
      {designTasks.length === 0 &&
        constructionTasks.length === 0 &&
        customTasks.length === 0 && (
          <Card>
            <CardContent className='p-6'>
              <p className='text-sm text-slate-500 text-center py-4'>
                No shower walls labor tasks available. Select tile size and
                other design options to generate labor tasks.
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

      {/* Total Section - At the bottom like in the image */}
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
