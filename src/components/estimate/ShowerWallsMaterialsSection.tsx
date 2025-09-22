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

interface ShowerWallsMaterialsSectionProps {
  materialItems: MaterialItem[];
  onAddMaterialItem: () => void;
  onMaterialItemChange: (
    id: string,
    field: string,
    value: string | number
  ) => void;
  onDeleteMaterialItem: (id: string) => void;
}

export default function ShowerWallsMaterialsSection({
  materialItems,
  onAddMaterialItem,
  onMaterialItemChange,
  onDeleteMaterialItem,
}: ShowerWallsMaterialsSectionProps) {
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
          item.scope === 'showerWalls_design'
      ),
    [materials]
  );
  const constructionMaterials = useMemo(
    () =>
      materials.filter(
        (item) =>
          item &&
          item.id.startsWith('mat-') &&
          item.scope === 'showerWalls_construction'
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
      return (
        <div
          key={item.id}
          className='flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200'
        >
          <div className='flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2'>
            <div>
              <Label
                htmlFor={`name-${item.id}`}
                className='text-xs text-slate-600'
              >
                Material Name
              </Label>
              <Input
                id={`name-${item.id}`}
                value={item.name}
                onChange={(e) =>
                  onMaterialItemChange(item.id, 'name', e.target.value)
                }
                className='text-sm'
                placeholder='Material name'
              />
            </div>
            <div>
              <Label
                htmlFor={`quantity-${item.id}`}
                className='text-xs text-slate-600'
              >
                Quantity
              </Label>
              <Input
                id={`quantity-${item.id}`}
                type='number'
                value={item.quantity}
                onChange={(e) =>
                  onMaterialItemChange(item.id, 'quantity', e.target.value)
                }
                className='text-sm'
                placeholder='0'
              />
            </div>
            <div>
              <Label
                htmlFor={`price-${item.id}`}
                className='text-xs text-slate-600'
              >
                Price ($)
              </Label>
              <Input
                id={`price-${item.id}`}
                type='number'
                value={item.price}
                onChange={(e) =>
                  onMaterialItemChange(item.id, 'price', e.target.value)
                }
                className='text-sm'
                placeholder='0.00'
              />
            </div>
            <div>
              <Label
                htmlFor={`unit-${item.id}`}
                className='text-xs text-slate-600'
              >
                Unit
              </Label>
              <Input
                id={`unit-${item.id}`}
                value={item.unit}
                onChange={(e) =>
                  onMaterialItemChange(item.id, 'unit', e.target.value)
                }
                className='text-sm'
                placeholder='each'
              />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='text-right min-w-[80px]'>
              <p className='text-xs text-slate-600'>Total</p>
              <p className='font-semibold text-blue-600'>
                $
                {(
                  (parseFloat(item.quantity) || 0) *
                  (parseFloat(item.price) || 0)
                ).toFixed(2)}
              </p>
            </div>
            <Button
              onClick={() => onDeleteMaterialItem(item.id)}
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-700 hover:bg-red-50 p-1'
            >
              <Trash2 size={16} />
            </Button>
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
                No shower walls materials available. Select tile size and other
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

      {/* Total Section - At the bottom like in the image */}
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
