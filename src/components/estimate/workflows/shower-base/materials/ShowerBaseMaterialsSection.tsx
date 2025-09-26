import React, { useMemo, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { CollapsibleCard } from '@/components/estimate/shared/CollapsibleCard';
import { useEstimateWorkflow } from '@/hooks/useEstimateWorkflow';
import { MaterialItem } from '@/types/estimate';

interface ShowerBaseMaterialsSectionV2Props {
  initialData?: unknown;
  onDataChange?: (data: unknown) => void;
}

export default function ShowerBaseMaterialsSectionV2({
  initialData,
  onDataChange,
}: ShowerBaseMaterialsSectionV2Props) {
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

  // Group material items by scope
  const designMaterials = useMemo(
    () =>
      (workflow.materials?.items || []).filter(
        (item) => item.scope === 'showerBase_design'
      ),
    [workflow.materials?.items]
  );

  const constructionMaterials = useMemo(
    () =>
      (workflow.materials?.items || []).filter(
        (item) => item.scope === 'showerBase_construction'
      ),
    [workflow.materials?.items]
  );

  // Calculate totals
  const designTotal = useMemo(
    () =>
      designMaterials.reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      ),
    [designMaterials]
  );

  const constructionTotal = useMemo(
    () =>
      constructionMaterials.reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      ),
    [constructionMaterials]
  );

  const grandTotal = designTotal + constructionTotal;

  const renderMaterialItem = useCallback(
    (item: MaterialItem) => {
      const total =
        (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);

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
                actions.updateMaterialItem(item.id, 'name', e.target.value)
              }
              placeholder='Material Name'
              className='border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent border-blue-300 focus:border-blue-500 focus:outline-none w-44 sm:w-full'
            />
            <Button
              onClick={() => actions.deleteMaterialItem(item.id)}
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-700 p-1 h-auto flex-shrink-0'
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className='grid grid-cols-3 gap-3 w-full'>
            <div className='w-full'>
              <label className='text-xs text-slate-500'>Quantity</label>
              <Input
                type='number'
                value={item.quantity}
                onChange={(e) =>
                  actions.updateMaterialItem(
                    item.id,
                    'quantity',
                    e.target.value
                  )
                }
                placeholder='0'
                className='text-center border-blue-300 focus:border-blue-500'
              />
            </div>
            <div className='w-full'>
              <label className='text-xs text-slate-500'>Price/Unit ($)</label>
              <Input
                type='number'
                value={item.price}
                onChange={(e) =>
                  actions.updateMaterialItem(item.id, 'price', e.target.value)
                }
                placeholder='0.00'
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
    [actions]
  );

  return (
    <div className='space-y-5'>
      {/* Design Materials Section - Collapsible */}
      <CollapsibleCard
        title='Design Materials'
        isCollapsed={isDesignCollapsed}
        onToggle={() => setIsDesignCollapsed(!isDesignCollapsed)}
        total={designTotal}
      >
        <div className='space-y-3'>
          {designMaterials.map((item) => renderMaterialItem(item))}
          <div className='flex justify-center'>
            <Button
              onClick={() => {
                actions.addMaterialItem({
                  name: 'Design Material',
                  quantity: '1',
                  price: '0',
                  unit: 'each',
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

      {/* Construction Materials Section - Collapsible */}
      <CollapsibleCard
        title='Construction Materials'
        isCollapsed={isConstructionCollapsed}
        onToggle={() => setIsConstructionCollapsed(!isConstructionCollapsed)}
        total={constructionTotal}
      >
        <div className='space-y-3'>
          {constructionMaterials.map((item) => renderMaterialItem(item))}
          <div className='flex justify-center'>
            <Button
              onClick={() => {
                actions.addMaterialItem({
                  name: 'Construction Material',
                  quantity: '1',
                  price: '0',
                  unit: 'each',
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

      {/* Total Summary */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-slate-800'>
              Total Materials Cost
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
