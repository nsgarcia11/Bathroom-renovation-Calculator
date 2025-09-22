import React, { useMemo, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { CollapsibleCard } from './CollapsibleCard';

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  unit: string;
  color?: string;
  scope?: string;
}

interface ShowerBaseMaterialsSectionProps {
  materialItems: MaterialItem[];
  onAddMaterialItem: () => void;
  onMaterialItemChange: (
    id: string,
    field: string,
    value: string | number
  ) => void;
  onDeleteMaterialItem: (id: string) => void;
}

export default function ShowerBaseMaterialsSection({
  materialItems,
  onAddMaterialItem,
  onMaterialItemChange,
  onDeleteMaterialItem,
}: ShowerBaseMaterialsSectionProps) {
  // State for managing collapsed sections
  const [isDesignCollapsed, setIsDesignCollapsed] = useState(true);
  const [isConstructionCollapsed, setIsConstructionCollapsed] = useState(true);

  // Memoized calculations
  const materials = useMemo(() => materialItems || [], [materialItems]);

  // Group material items by type
  const designMaterials = useMemo(
    () =>
      materials.filter(
        (item) =>
          item &&
          item.id.startsWith('mat-') &&
          item.scope === 'showerBase_design'
      ),
    [materials]
  );
  const constructionMaterials = useMemo(
    () =>
      materials.filter(
        (item) =>
          item &&
          item.id.startsWith('mat-') &&
          item.scope === 'showerBase_construction'
      ),
    [materials]
  );
  const customMaterials = useMemo(
    () => materials.filter((item) => item && item.id.startsWith('custom-')),
    [materials]
  );

  // Calculate totals for each category
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
  const customTotal = useMemo(
    () =>
      customMaterials.reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      ),
    [customMaterials]
  );

  const grandTotal = useMemo(
    () => designTotal + constructionTotal + customTotal,
    [designTotal, constructionTotal, customTotal]
  );

  const renderMaterialItem = useCallback(
    (item: MaterialItem) => {
      if (!item) return null;

      // Handle note items (client supplies, etc.)
      if (item.scope === 'showerBase_design' && item.unit === 'note') {
        return (
          <div
            key={item.id}
            className='flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border'
          >
            <div className='flex items-center gap-2'>
              <div className='w-5 h-5 text-green-500'>
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
                  <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                  <circle cx='9' cy='7' r='4' />
                  <polyline points='16 11 18 13 22 9' />
                </svg>
              </div>
              <span className='text-sm font-medium text-slate-700'>
                {item.name}
              </span>
            </div>
          </div>
        );
      }

      return (
        <div
          key={item.id}
          className='material-item p-3 bg-white rounded-lg shadow-sm border'
        >
          <div className='flex justify-between items-center mb-2'>
            <Input
              value={item.name}
              onChange={(e) =>
                onMaterialItemChange(item.id, 'name', e.target.value)
              }
              className='item-label w-full text-md font-bold border-none shadow-none p-0 focus-visible:ring-0'
              placeholder='Material name'
            />
            <Button
              onClick={() => onDeleteMaterialItem(item.id)}
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-700 hover:bg-red-50 p-1 ml-2 flex-shrink-0'
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className='grid grid-cols-4 gap-2'>
            <div>
              <Label className='block text-xs font-medium text-slate-500 mb-1'>
                Qty
              </Label>
              <Input
                type='number'
                value={item.quantity}
                onChange={(e) =>
                  onMaterialItemChange(item.id, 'quantity', e.target.value)
                }
                className='w-full text-sm p-2 h-9 rounded-md text-center'
                placeholder='0'
              />
            </div>
            <div>
              <Label className='block text-xs font-medium text-slate-500 mb-1'>
                Price
              </Label>
              <Input
                type='number'
                value={item.price}
                onChange={(e) =>
                  onMaterialItemChange(item.id, 'price', e.target.value)
                }
                className='w-full text-sm p-2 h-9 rounded-md text-center'
                placeholder='0'
              />
            </div>
            <div>
              <Label className='block text-xs font-medium text-slate-500 mb-1'>
                Unit
              </Label>
              <Input
                value={item.unit}
                onChange={(e) =>
                  onMaterialItemChange(item.id, 'unit', e.target.value)
                }
                className='w-full text-sm p-2 h-9 rounded-md text-center'
                placeholder='each'
              />
            </div>
            <div className='text-right'>
              <Label className='block text-xs font-medium text-slate-500 mb-1'>
                Total
              </Label>
              <div className='font-semibold text-slate-800 text-md h-9 flex items-center justify-end mt-1'>
                <span className='material-total'>
                  $
                  {(
                    (parseFloat(item.quantity) || 0) *
                    (parseFloat(item.price) || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    },
    [onMaterialItemChange, onDeleteMaterialItem]
  );

  return (
    <div className='space-y-5'>
      {/* Design Materials Section - Collapsible */}
      {designMaterials.length > 0 && (
        <CollapsibleCard
          title='Design Materials'
          isOpen={!isDesignCollapsed}
          onToggle={() => setIsDesignCollapsed(!isDesignCollapsed)}
          headerContent={
            <p className='font-bold text-blue-600 text-sm'>
              ${designTotal.toFixed(2)}
            </p>
          }
        >
          <div className='space-y-2'>
            {designMaterials.map(renderMaterialItem)}
          </div>
        </CollapsibleCard>
      )}

      {/* Construction Materials Section - Collapsible */}
      {constructionMaterials.length > 0 && (
        <CollapsibleCard
          title='Construction Materials'
          isOpen={!isConstructionCollapsed}
          onToggle={() => setIsConstructionCollapsed(!isConstructionCollapsed)}
          headerContent={
            <p className='font-bold text-blue-600 text-sm'>
              ${constructionTotal.toFixed(2)}
            </p>
          }
        >
          <div className='space-y-2'>
            {constructionMaterials.map(renderMaterialItem)}
          </div>
        </CollapsibleCard>
      )}

      {/* Custom Materials Section - Always visible */}
      {customMaterials.length > 0 && (
        <Card>
          <CardContent className='p-3 space-y-3'>
            <div className='flex justify-between items-baseline'>
              <h3 className='text-lg font-semibold text-slate-700 px-1'>
                Custom Materials
              </h3>
              <p className='font-bold text-blue-600 text-sm'>
                ${customTotal.toFixed(2)}
              </p>
            </div>
            <div className='space-y-2'>
              {customMaterials.map(renderMaterialItem)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show message if no materials */}
      {designMaterials.length === 0 &&
        constructionMaterials.length === 0 &&
        customMaterials.length === 0 && (
          <Card>
            <CardContent className='p-6'>
              <p className='text-sm text-slate-500 text-center py-4'>
                No shower base materials available. Select base type and other
                design options to generate materials.
              </p>
            </CardContent>
          </Card>
        )}

      {/* Add Custom Material Button */}
      <Button
        onClick={onAddMaterialItem}
        variant='outline'
        className='w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold border-blue-200'
      >
        <Plus size={16} />
        Add Custom Material
      </Button>

      {/* Total Section - At the bottom */}
      <Card className='border-red-200'>
        <CardContent className='p-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-slate-800'>
              Total Material Cost
            </h3>
            <div className='text-right'>
              <p className='text-sm text-slate-600'>
                {designMaterials.length +
                  constructionMaterials.length +
                  customMaterials.length}{' '}
                items
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
