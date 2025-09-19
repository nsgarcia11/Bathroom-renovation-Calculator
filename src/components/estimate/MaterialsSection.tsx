'use client';

import React, { useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  unit: string;
  color?: string;
}

interface MaterialsSectionProps {
  constructionMaterials: MaterialItem[];
  setConstructionMaterials: (materials: MaterialItem[]) => void;
  handleDeleteSupply: (id: string) => void;
}

export function MaterialsSection({
  constructionMaterials,
  setConstructionMaterials,
  handleDeleteSupply,
}: MaterialsSectionProps) {
  // Memoized materials array
  const materials = useMemo(
    () => constructionMaterials || [],
    [constructionMaterials]
  );

  const handleConstructionMaterialChange = useCallback(
    (id: string, field: keyof MaterialItem, value: string) => {
      const updatedMaterials = materials.map((mat) =>
        mat.id === id ? { ...mat, [field]: value } : mat
      );
      setConstructionMaterials(updatedMaterials);
    },
    [materials, setConstructionMaterials]
  );

  const handleAddCustomSupply = useCallback(() => {
    setConstructionMaterials([
      ...materials,
      {
        id: `custom-supply-${Date.now()}`,
        name: '',
        quantity: '1',
        price: '',
        unit: 'each',
      },
    ]);
  }, [materials, setConstructionMaterials]);

  const total = useMemo(
    () =>
      materials.reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      ),
    [materials]
  );

  const renderMaterialItem = useCallback(
    (material: MaterialItem) => {
      return (
        <div
          key={material.id}
          className={`p-3 bg-white rounded-lg border ${
            material.color || 'border-slate-300'
          }`}
        >
          <div className='flex items-center gap-2 mb-2'>
            <Input
              type='text'
              value={material.name}
              onChange={(e) =>
                handleConstructionMaterialChange(
                  material.id,
                  'name',
                  e.target.value
                )
              }
              placeholder='Supply Name'
              className='border-b-2 bg-transparent border-slate-200 focus:border-blue-500 focus:outline-none'
            />
            <Button
              onClick={() => handleDeleteSupply(material.id)}
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-700 p-1 h-auto'
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            <div>
              <label className='text-xs text-slate-500'>Quantity</label>
              <Input
                type='number'
                value={material.quantity}
                onChange={(e) =>
                  handleConstructionMaterialChange(
                    material.id,
                    'quantity',
                    e.target.value
                  )
                }
                placeholder='0'
                className='text-center'
              />
            </div>
            <div>
              <label className='text-xs text-slate-500'>Price/Unit ($)</label>
              <Input
                type='number'
                value={material.price}
                onChange={(e) =>
                  handleConstructionMaterialChange(
                    material.id,
                    'price',
                    e.target.value
                  )
                }
                placeholder='0.00'
                className='text-center'
              />
            </div>
            <div>
              <label className='text-xs text-slate-500'>Total</label>
              <div className='w-full p-2 text-center font-semibold text-slate-800 bg-slate-50 rounded-md'>
                $
                {(
                  (parseFloat(material.quantity) || 0) *
                  (parseFloat(material.price) || 0)
                ).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      );
    },
    [handleConstructionMaterialChange, handleDeleteSupply]
  );

  return (
    <div className='space-y-5'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-slate-800'>
          Materials & Supplies
        </h2>
        <p className='font-bold text-blue-600 text-lg'>${total.toFixed(2)}</p>
      </div>

      <Card>
        <CardContent className='p-3 space-y-3'>
          {materials.length > 0 ? (
            materials.map((m) => renderMaterialItem(m))
          ) : (
            <p className='text-sm text-slate-500 text-center py-4'>
              No supplies or disposal fees needed.
            </p>
          )}
          <Button
            onClick={handleAddCustomSupply}
            variant='outline'
            className='w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold border-blue-200'
          >
            <Plus size={16} />
            Add Custom Supply
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
