import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface LaborItem {
  id: string;
  name: string;
  hours: string;
  rate: string;
  color?: string;
  scope?: string;
}

interface WorkflowMaterialItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  scope?: string;
}

interface WorkflowSectionProps {
  category: string;
  laborItems: LaborItem[];
  materialItems: WorkflowMaterialItem[];
  onAddLaborItem: () => void;
  onLaborItemChange: (id: string, field: string, value: string) => void;
  onDeleteLaborItem: (id: string) => void;
  onAddMaterialItem: () => void;
  onMaterialItemChange: (
    id: string,
    field: string,
    value: string | number
  ) => void;
  onDeleteMaterialItem: (id: string) => void;
  wasteNote?: string;
}

export default function WorkflowSection({
  category,
  laborItems,
  materialItems,
  onAddLaborItem,
  onLaborItemChange,
  onDeleteLaborItem,
  onAddMaterialItem,
  onMaterialItemChange,
  onDeleteMaterialItem,
  wasteNote,
}: WorkflowSectionProps) {
  // Group labor items by scope
  const designTasks = laborItems.filter(
    (item) =>
      item && item.id.startsWith('sw-') && item.scope === 'showerWalls_design'
  );
  const constructionTasks = laborItems.filter(
    (item) =>
      item &&
      item.id.startsWith('sw-') &&
      item.scope === 'showerWalls_construction'
  );
  const demolitionTasks = laborItems.filter(
    (item) => item && item.id.startsWith('lab-')
  );
  const customTasks = laborItems.filter(
    (item) => item && item.id.startsWith('custom-')
  );

  // Group material items by scope
  const designMaterials = materialItems.filter(
    (item) => item && item.scope === 'showerWalls_design'
  );
  const constructionMaterials = materialItems.filter(
    (item) => item && item.scope === 'showerWalls_construction'
  );
  const demolitionMaterials = materialItems.filter(
    (item) => item && item.scope === 'demolition'
  );

  // Calculate totals
  const designLaborTotal = designTasks.reduce(
    (sum, item) =>
      sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
    0
  );
  const constructionLaborTotal = constructionTasks.reduce(
    (sum, item) =>
      sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
    0
  );
  const demolitionLaborTotal = demolitionTasks.reduce(
    (sum, item) =>
      sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
    0
  );
  const customLaborTotal = customTasks.reduce(
    (sum, item) =>
      sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
    0
  );

  const designMaterialTotal = designMaterials.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const constructionMaterialTotal = constructionMaterials.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const demolitionMaterialTotal = demolitionMaterials.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const totalLabor =
    designLaborTotal +
    constructionLaborTotal +
    demolitionLaborTotal +
    customLaborTotal;
  const totalMaterials =
    designMaterialTotal + constructionMaterialTotal + demolitionMaterialTotal;

  const renderLaborItem = (item: LaborItem) => {
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
              className='text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500'
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
              className='text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500'
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
              className='text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500'
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
  };

  const renderMaterialItem = (item: WorkflowMaterialItem) => {
    if (!item) return null;
    return (
      <div
        key={item.id}
        className='flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200'
      >
        <div className='flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2'>
          <div>
            <Label
              htmlFor={`mat-name-${item.id}`}
              className='text-xs text-slate-600'
            >
              Material Name
            </Label>
            <Input
              id={`mat-name-${item.id}`}
              value={item.name}
              onChange={(e) =>
                onMaterialItemChange(item.id, 'name', e.target.value)
              }
              className='text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500'
              placeholder='Material name'
            />
          </div>
          <div>
            <Label
              htmlFor={`mat-qty-${item.id}`}
              className='text-xs text-slate-600'
            >
              Quantity
            </Label>
            <Input
              id={`mat-qty-${item.id}`}
              type='number'
              value={item.quantity.toString()}
              onChange={(e) =>
                onMaterialItemChange(
                  item.id,
                  'quantity',
                  parseFloat(e.target.value) || 0
                )
              }
              className='text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500'
              placeholder='0'
            />
          </div>
          <div>
            <Label
              htmlFor={`mat-unitPrice-${item.id}`}
              className='text-xs text-slate-600'
            >
              Price/Unit
            </Label>
            <Input
              id={`mat-unitPrice-${item.id}`}
              type='number'
              value={item.unitPrice.toString()}
              onChange={(e) =>
                onMaterialItemChange(
                  item.id,
                  'unitPrice',
                  parseFloat(e.target.value) || 0
                )
              }
              className='text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500'
              placeholder='0.00'
            />
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <div className='text-right text-sm font-medium text-slate-700 min-w-[80px]'>
            ${item.total.toFixed(2)}
          </div>
          <Button
            onClick={() => onDeleteMaterialItem(item.id)}
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50'
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    );
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'shower-walls':
        return 'Shower Walls';
      case 'shower-base':
        return 'Shower Base';
      case 'floors':
        return 'Floors';
      case 'finishings':
        return 'Finishings';
      case 'structural':
        return 'Structural';
      case 'trades':
        return 'Trades';
      default:
        return 'Workflow';
    }
  };

  return (
    <div className='space-y-5'>
      <div className='flex justify-between items-baseline'>
        <h2 className='text-2xl font-bold text-slate-800'>
          {getCategoryTitle(category)}
        </h2>
        <div className='text-right'>
          <div className='text-sm text-slate-600'>
            Labor: ${totalLabor.toFixed(2)}
          </div>
          <div className='text-sm text-slate-600'>
            Materials: ${totalMaterials.toFixed(2)}
          </div>
          <div className='text-lg font-bold text-blue-600'>
            Total: ${(totalLabor + totalMaterials).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Design Labor Section */}
      {designTasks.length > 0 && (
        <Card>
          <CardContent className='p-3 space-y-3'>
            <div className='flex justify-between items-baseline'>
              <h3 className='text-lg font-semibold text-slate-700 px-1'>
                Design Labor
              </h3>
              <p className='font-bold text-blue-600 text-sm'>
                ${designLaborTotal.toFixed(2)}
              </p>
            </div>
            <div className='space-y-2'>{designTasks.map(renderLaborItem)}</div>
          </CardContent>
        </Card>
      )}

      {/* Construction Labor Section */}
      {constructionTasks.length > 0 && (
        <Card>
          <CardContent className='p-3 space-y-3'>
            <div className='flex justify-between items-baseline'>
              <h3 className='text-lg font-semibold text-slate-700 px-1'>
                Construction Labor
              </h3>
              <p className='font-bold text-blue-600 text-sm'>
                ${constructionLaborTotal.toFixed(2)}
              </p>
            </div>
            <div className='space-y-2'>
              {constructionTasks.map(renderLaborItem)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demolition Labor Section */}
      {demolitionTasks.length > 0 && (
        <Card>
          <CardContent className='p-3 space-y-3'>
            <div className='flex justify-between items-baseline'>
              <h3 className='text-lg font-semibold text-slate-700 px-1'>
                Demolition Labor
              </h3>
              <p className='font-bold text-blue-600 text-sm'>
                ${demolitionLaborTotal.toFixed(2)}
              </p>
            </div>
            <div className='space-y-2'>
              {demolitionTasks.map(renderLaborItem)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Labor Section */}
      {customTasks.length > 0 && (
        <Card>
          <CardContent className='p-3 space-y-3'>
            <div className='flex justify-between items-baseline'>
              <h3 className='text-lg font-semibold text-slate-700 px-1'>
                Custom Tasks
              </h3>
              <p className='font-bold text-blue-600 text-sm'>
                ${customLaborTotal.toFixed(2)}
              </p>
            </div>
            <div className='space-y-2'>{customTasks.map(renderLaborItem)}</div>
          </CardContent>
        </Card>
      )}

      {/* Design Materials Section */}
      {designMaterials.length > 0 && (
        <Card>
          <CardContent className='p-3 space-y-3'>
            <div className='flex justify-between items-baseline'>
              <h3 className='text-lg font-semibold text-slate-700 px-1'>
                Design Materials
              </h3>
              <p className='font-bold text-blue-600 text-sm'>
                ${designMaterialTotal.toFixed(2)}
              </p>
            </div>
            {wasteNote && (
              <div className='text-orange-500 text-sm p-2 bg-orange-50 rounded border border-orange-200'>
                {wasteNote}
              </div>
            )}
            <div className='space-y-2'>
              {designMaterials.map(renderMaterialItem)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Construction Materials Section */}
      {constructionMaterials.length > 0 && (
        <Card>
          <CardContent className='p-3 space-y-3'>
            <div className='flex justify-between items-baseline'>
              <h3 className='text-lg font-semibold text-slate-700 px-1'>
                Construction Materials
              </h3>
              <p className='font-bold text-blue-600 text-sm'>
                ${constructionMaterialTotal.toFixed(2)}
              </p>
            </div>
            <div className='space-y-2'>
              {constructionMaterials.map(renderMaterialItem)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demolition Materials Section */}
      {demolitionMaterials.length > 0 && (
        <Card>
          <CardContent className='p-3 space-y-3'>
            <div className='flex justify-between items-baseline'>
              <h3 className='text-lg font-semibold text-slate-700 px-1'>
                Demolition Materials
              </h3>
              <p className='font-bold text-blue-600 text-sm'>
                ${demolitionMaterialTotal.toFixed(2)}
              </p>
            </div>
            <div className='space-y-2'>
              {demolitionMaterials.map(renderMaterialItem)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show message if no items */}
      {laborItems.length === 0 && materialItems.length === 0 && (
        <Card>
          <CardContent className='p-6'>
            <p className='text-sm text-slate-500 text-center py-4'>
              No items available for this category. Configure the project scope
              to generate items.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Buttons */}
      <div className='flex gap-2'>
        <Button
          onClick={onAddLaborItem}
          variant='outline'
          className='flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold border-blue-200'
        >
          <Plus size={16} />
          Add Labor Task
        </Button>
        <Button
          onClick={onAddMaterialItem}
          variant='outline'
          className='flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-green-100 hover:bg-green-200 text-green-800 font-semibold border-green-200'
        >
          <Plus size={16} />
          Add Material
        </Button>
      </div>
    </div>
  );
}
