import React, { useMemo, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { CollapsibleCard } from '@/components/estimate/shared/CollapsibleCard';
import { useEstimateWorkflow } from '@/hooks/useEstimateWorkflow';
import { LaborItem } from '@/types/estimate';

interface ShowerBaseLaborSectionV2Props {
  initialData?: unknown;
  contractorHourlyRate?: number;
  onDataChange?: (data: unknown) => void;
}

export default function ShowerBaseLaborSectionV2({
  initialData,
  contractorHourlyRate,
  onDataChange,
}: ShowerBaseLaborSectionV2Props) {
  const { workflow, actions } = useEstimateWorkflow(initialData);

  // State for managing collapsed sections
  const [isDesignCollapsed, setIsDesignCollapsed] = useState(false);
  const [isConstructionCollapsed, setIsConstructionCollapsed] = useState(false);

  // Notify parent of data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(workflow);
    }
  }, [workflow, onDataChange]);

  // Group labor items by scope
  const designTasks = useMemo(
    () =>
      (workflow.labor?.laborItems || []).filter(
        (item) => item.scope === 'showerBase_design'
      ),
    [workflow.labor?.laborItems]
  );

  const constructionTasks = useMemo(
    () =>
      (workflow.labor?.laborItems || []).filter(
        (item) => item.scope === 'showerBase_construction'
      ),
    [workflow.labor?.laborItems]
  );

  const generalTasks = useMemo(
    () =>
      (workflow.labor?.laborItems || []).filter(
        (item) => item.scope === 'showerBase_general' || !item.scope
      ),
    [workflow.labor?.laborItems]
  );

  // Calculate totals
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

  const generalTotal = useMemo(
    () =>
      generalTasks.reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      ),
    [generalTasks]
  );

  const grandTotal = designTotal + constructionTotal + generalTotal;

  const renderLaborItem = useCallback(
    (item: LaborItem) => {
      const total =
        (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0);

      return (
        <div
          key={item.id}
          className={`p-3 bg-white rounded-lg border ${
            item.color || 'border-slate-300'
          }`}
        >
          <div className='flex items-center gap-2 mb-2'>
            <Input
              type='text'
              value={item.name}
              onChange={(e) =>
                actions.updateLaborItem(item.id, 'name', e.target.value)
              }
              placeholder='Task Name'
              className='border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent border-blue-300 focus:border-blue-500 focus:outline-none w-44 sm:w-full'
            />
            <Button
              onClick={() => actions.deleteLaborItem(item.id)}
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
                  actions.updateLaborItem(item.id, 'hours', e.target.value)
                }
                placeholder='0'
                className='text-center border-blue-300 focus:border-blue-500'
              />
            </div>
            <div className='w-full'>
              <label className='text-xs text-slate-500'>Rate ($/hr)</label>
              <Input
                type='number'
                value={item.rate}
                onChange={(e) =>
                  actions.updateLaborItem(item.id, 'rate', e.target.value)
                }
                placeholder={contractorHourlyRate?.toString() || '75'}
                className='text-center border-blue-300 focus:border-blue-500'
              />
            </div>
            <div className='w-full'>
              <label className='text-xs text-slate-500'>Total</label>
              <div className='w-full p-2 text-center font-semibold text-slate-800 bg-slate-50 rounded-md'>
                ${total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      );
    },
    [actions, contractorHourlyRate]
  );

  return (
    <div className='space-y-5'>
      {/* Design Labor Section - Collapsible */}
      <CollapsibleCard
        title='Design Labor'
        isCollapsed={isDesignCollapsed}
        onToggle={() => setIsDesignCollapsed(!isDesignCollapsed)}
        total={designTotal}
      >
        <div className='space-y-3'>
          {designTasks.map((item) => renderLaborItem(item))}
          <div className='flex justify-center'>
            <Button
              onClick={() => {
                actions.addLaborItem({
                  name: 'Design Labor Task',
                  hours: '1',
                  rate: contractorHourlyRate?.toString() || '75',
                  scope: 'showerBase_design',
                });
                setIsDesignCollapsed(false);
              }}
              variant='default'
              className='w-auto flex items-center justify-center gap-2 py-2.5 px-4 text-white font-semibold'
            >
              <Plus size={16} />
              Add Item
            </Button>
          </div>
        </div>
      </CollapsibleCard>

      {/* Construction Labor Section - Collapsible */}
      <CollapsibleCard
        title='Construction Labor'
        isCollapsed={isConstructionCollapsed}
        onToggle={() => setIsConstructionCollapsed(!isConstructionCollapsed)}
        total={constructionTotal}
      >
        <div className='space-y-3'>
          {constructionTasks.map((item) => renderLaborItem(item))}
          <div className='flex justify-center'>
            <Button
              onClick={() => {
                actions.addLaborItem({
                  name: 'Construction Labor Task',
                  hours: '1',
                  rate: contractorHourlyRate?.toString() || '75',
                  scope: 'showerBase_construction',
                });
                setIsConstructionCollapsed(false);
              }}
              variant='default'
              className='w-auto flex items-center justify-center gap-2 py-2.5 px-4 text-white font-semibold'
            >
              <Plus size={16} />
              Add Item
            </Button>
          </div>
        </div>
      </CollapsibleCard>

      {/* General Labor Section */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-slate-800'>
              General Labor Tasks
            </h3>
            <p className='text-lg font-bold text-blue-600'>
              ${generalTotal.toFixed(2)}
            </p>
          </div>
          <div className='space-y-3'>
            {generalTasks.map((item) => renderLaborItem(item))}
            <div className='flex justify-center'>
              <Button
                onClick={() =>
                  actions.addLaborItem({
                    name: 'General Labor Task',
                    hours: '1',
                    rate: contractorHourlyRate?.toString() || '75',
                    scope: 'showerBase_general',
                  })
                }
                variant='default'
                className='w-auto flex items-center justify-center gap-2 py-2.5 px-4 text-white font-semibold'
              >
                <Plus size={16} />
                Add Custom Task
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Summary */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-slate-800'>
              Total Labor Cost
            </h3>
            <p className='text-xl font-bold text-blue-600'>
              ${grandTotal.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
