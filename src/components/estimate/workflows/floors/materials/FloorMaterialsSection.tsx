'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  unit: string;
  scope?: string;
}

interface FloorMaterialsSectionProps {
  materialItems: MaterialItem[];
  onAddMaterialItem: () => void;
  onMaterialItemChange: (id: string, field: string, value: string) => void;
  onDeleteMaterialItem: (id: string) => void;
}

export function FloorMaterialsSection({
  materialItems,
  onAddMaterialItem,
  onMaterialItemChange,
  onDeleteMaterialItem,
}: FloorMaterialsSectionProps) {
  const [isDesignOpen, setIsDesignOpen] = useState(true);
  const [isConstructionOpen, setIsConstructionOpen] = useState(true);
  const [isStructuralOpen, setIsStructuralOpen] = useState(true);

  // Group material items by scope
  const designMaterials = materialItems.filter(
    (item) => item && item.scope === 'floor_design'
  );
  const constructionMaterials = materialItems.filter(
    (item) => item && item.scope === 'floor_construction'
  );
  const structuralMaterials = materialItems.filter(
    (item) => item && item.scope === 'floor_structural'
  );
  const customMaterials = materialItems.filter(
    (item) => item && item.id.startsWith('custom-')
  );

  // Calculate totals
  const designTotal = designMaterials.reduce(
    (sum, item) =>
      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
    0
  );
  const constructionTotal = constructionMaterials.reduce(
    (sum, item) =>
      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
    0
  );
  const structuralTotal = structuralMaterials.reduce(
    (sum, item) =>
      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
    0
  );
  const customTotal = customMaterials.reduce(
    (sum, item) =>
      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
    0
  );

  const totalMaterials =
    designTotal + constructionTotal + structuralTotal + customTotal;

  const renderMaterialItem = (material: MaterialItem) => {
    if (!material) return null;
    const isAuto = material.id.startsWith('mat-');
    return (
      <div
        key={material.id}
        className='flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200'
      >
        <div className='flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2'>
          <div>
            <Label
              htmlFor={`mat-name-${material.id}`}
              className='text-xs text-slate-600'
            >
              Material Name
            </Label>
            <Input
              id={`mat-name-${material.id}`}
              value={material.name}
              onChange={(e) =>
                onMaterialItemChange(material.id, 'name', e.target.value)
              }
              className='text-sm'
              placeholder='Material name'
              readOnly={isAuto}
            />
          </div>
          <div>
            <Label
              htmlFor={`mat-qty-${material.id}`}
              className='text-xs text-slate-600'
            >
              Quantity
            </Label>
            <Input
              id={`mat-qty-${material.id}`}
              type='number'
              value={material.quantity}
              onChange={(e) =>
                onMaterialItemChange(material.id, 'quantity', e.target.value)
              }
              className='text-sm'
              placeholder='0'
              readOnly={isAuto}
            />
          </div>
          <div>
            <Label
              htmlFor={`mat-price-${material.id}`}
              className='text-xs text-slate-600'
            >
              Price/Unit ($)
            </Label>
            <Input
              id={`mat-price-${material.id}`}
              type='number'
              value={material.price}
              onChange={(e) =>
                onMaterialItemChange(material.id, 'price', e.target.value)
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
              (parseFloat(material.quantity) || 0) *
              (parseFloat(material.price) || 0)
            ).toFixed(2)}
          </div>
          {!isAuto && (
            <Button
              onClick={() => onDeleteMaterialItem(material.id)}
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
        <h2 className='text-2xl font-bold text-slate-800'>Materials</h2>
        <p className='font-bold text-blue-600 text-lg'>
          ${totalMaterials.toFixed(2)}
        </p>
      </div>

      <div className='space-y-4'>
        {/* Design Materials Section */}
        {designMaterials.length > 0 && (
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
                    Design Materials
                  </h3>
                </div>
                <p className='font-bold text-blue-600 text-sm'>
                  ${designTotal.toFixed(2)}
                </p>
              </div>
              {isDesignOpen && (
                <div className='space-y-2'>
                  {designMaterials.map(renderMaterialItem)}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Construction Materials Section */}
        {constructionMaterials.length > 0 && (
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
                    Construction Materials
                  </h3>
                </div>
                <p className='font-bold text-blue-600 text-sm'>
                  ${constructionTotal.toFixed(2)}
                </p>
              </div>
              {isConstructionOpen && (
                <div className='space-y-2'>
                  {constructionMaterials.map(renderMaterialItem)}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Structural Materials Section */}
        {structuralMaterials.length > 0 && (
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
                    Structural Materials
                  </h3>
                </div>
                <p className='font-bold text-blue-600 text-sm'>
                  ${structuralTotal.toFixed(2)}
                </p>
              </div>
              {isStructuralOpen && (
                <div className='space-y-2'>
                  {structuralMaterials.map(renderMaterialItem)}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Custom Materials Section */}
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

        {/* Total Section */}
        <Card>
          <CardContent className='p-4'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-bold text-slate-800'>
                Total Materials
              </h3>
              <p className='text-2xl font-bold text-blue-600'>
                ${totalMaterials.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
