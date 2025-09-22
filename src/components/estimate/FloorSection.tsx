'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { CollapsibleCard } from './CollapsibleCard';
import { useFloorCalculations } from '@/hooks/use-floor-calculations';
import type {
  FloorMeasurements,
  FloorDesign,
  FloorConstruction,
} from '@/lib/floor-calculator';

interface FloorSectionProps {
  measurements: FloorMeasurements;
  setMeasurements: (
    measurements:
      | FloorMeasurements
      | ((prev: FloorMeasurements) => FloorMeasurements)
  ) => void;
  design: FloorDesign;
  setDesign: (
    design: FloorDesign | ((prev: FloorDesign) => FloorDesign)
  ) => void;
  construction: FloorConstruction;
  setConstruction: (
    construction:
      | FloorConstruction
      | ((prev: FloorConstruction) => FloorConstruction)
  ) => void;
}

export function FloorSection({
  measurements,
  setMeasurements,
  design,
  setDesign,
  construction,
  setConstruction,
}: FloorSectionProps) {
  const [isDesignCollapsed, setIsDesignCollapsed] = useState(false);
  const [isHeatedFloorCollapsed, setIsHeatedFloorCollapsed] = useState(false);
  const [isConstructionCollapsed, setIsConstructionCollapsed] = useState(false);

  const { totalSqft } = useFloorCalculations(measurements, design);

  const handleMeasurementChange = useCallback(
    (
      field: keyof FloorMeasurements,
      value:
        | number
        | Array<{ id: number; label: string; width: number; length: number }>
    ) => {
      setMeasurements((prev) => ({ ...prev, [field]: value }));
    },
    [setMeasurements]
  );

  const handleDesignChange = useCallback(
    (
      field: keyof FloorDesign,
      value: string | { width: string; length: string }
    ) => {
      setDesign((prev) => ({ ...prev, [field]: value }));
    },
    [setDesign]
  );

  const handleConstructionChange = useCallback(
    (field: keyof FloorConstruction, value: boolean | string | string[]) => {
      setConstruction((prev) => ({ ...prev, [field]: value }));
    },
    [setConstruction]
  );

  const handleAddSide = () => {
    setMeasurements((prev) => ({
      ...prev,
      extraMeasurements: [
        ...prev.extraMeasurements,
        { id: Date.now(), label: '', width: 0, length: 0 },
      ],
    }));
  };

  const handleExtraMeasurementChange = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setMeasurements((prev) => ({
      ...prev,
      extraMeasurements: prev.extraMeasurements.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  };

  const handleDeleteMeasurement = (id: number) => {
    setMeasurements((prev) => ({
      ...prev,
      extraMeasurements: prev.extraMeasurements.filter((m) => m.id !== id),
    }));
  };

  const handleTileSizeOptionChange = (value: string) => {
    if (value === 'select_option') {
      setDesign((prev) => ({
        ...prev,
        selectedTileSizeOption: 'select_option',
        tileSize: { width: '', length: '' },
      }));
    } else if (value !== 'custom') {
      const [width, length] = value.split('x');
      setDesign((prev) => ({
        ...prev,
        selectedTileSizeOption: value,
        tileSize: { width, length },
      }));
    } else {
      setDesign((prev) => ({
        ...prev,
        selectedTileSizeOption: 'custom',
        tileSize: { width: '', length: '' },
      }));
    }
  };

  const handlePrepTaskToggle = (task: string) => {
    setConstruction((prev) => ({
      ...prev,
      selectedPrepTasks: prev.selectedPrepTasks.includes(task)
        ? prev.selectedPrepTasks.filter((t) => t !== task)
        : [...prev.selectedPrepTasks, task],
    }));
  };

  const tilePatternOptions = [
    { value: 'select_option', label: 'Select a Pattern...' },
    { value: 'stacked', label: 'Stacked' },
    { value: '1/2_offset', label: '1/2 Offset' },
    { value: '1/3_offset', label: '1/3 Offset' },
    { value: 'herringbone', label: 'Herringbone' },
    { value: 'other', label: 'Other...' },
  ];

  const tileSizeOptions = [
    { value: 'select_option', label: 'Select a Tile Size...' },
    { value: '12x24', label: '12" x 24"' },
    { value: '12x12', label: '12" x 12"' },
    { value: '6x24', label: '6" x 24"' },
    { value: '24x24', label: '24" x 24"' },
    { value: '6x6', label: '6" x 6"' },
    { value: 'custom', label: 'Custom Size...' },
  ];

  const prepAndStructuralOptions = [
    { value: 'self_leveling', label: 'Self-Leveling' },
    { value: 'ditra', label: 'Install Ditra Membrane' },
    { value: 'ditra_xl', label: 'Install Ditra XL Membrane' },
    { value: 'add_plywood', label: 'Add Plywood for Subfloor support' },
    { value: 'repair_subfloor', label: 'Repair portion of subfloor' },
    { value: 'repair_joist', label: 'Repair Floor Joist' },
  ];

  const plywoodThicknessOptions = [
    { value: '1/2', label: '1/2"' },
    { value: '5/8', label: '5/8"' },
    { value: '3/4', label: '3/4"' },
  ];

  const heatedFloorOptions = [
    { value: 'schluter', label: 'Schluter-DITRA-HEAT' },
    { value: 'nuheat', label: 'Nuheat Cable System' },
    { value: 'custom', label: 'Custom...' },
  ];

  const getWasteFactorText = () => {
    switch (design.tilePattern) {
      case 'herringbone':
        return '25%';
      case '1/2_offset':
      case '1/3_offset':
        return '20%';
      case 'stacked':
      default:
        return '10%';
    }
  };

  return (
    <div className='space-y-6'>
      <div className='pt-2'>
        <h1 className='text-4xl font-bold text-slate-800 text-left'>Floor</h1>
      </div>

      {/* Floor Measurements Card */}
      <CollapsibleCard
        title='Floor Measurements'
        isOpen={!isDesignCollapsed}
        onToggle={() => setIsDesignCollapsed(!isDesignCollapsed)}
        headerContent={
          <div className='flex items-center justify-end w-full'>
            <span className='text-xl font-bold text-blue-600'>
              {totalSqft.toFixed(2)} sq/ft
            </span>
          </div>
        }
      >
        <div className='flex items-start gap-3 -mt-4 mb-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <p className='text-xs text-slate-500'>
            Enter the main room dimensions to calculate materials and labor
          </p>
        </div>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label
                htmlFor='floor-width'
                className='text-sm font-medium text-slate-600 mb-1.5'
              >
                Width (in)
              </Label>
              <Input
                id='floor-width'
                type='number'
                value={measurements.width?.toString() || ''}
                onChange={(e) =>
                  handleMeasurementChange(
                    'width',
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder='e.g., 60'
                className='text-sm'
              />
            </div>
            <div>
              <Label
                htmlFor='floor-length'
                className='text-sm font-medium text-slate-600 mb-1.5'
              >
                Length (in)
              </Label>
              <Input
                id='floor-length'
                type='number'
                value={measurements.length?.toString() || ''}
                onChange={(e) =>
                  handleMeasurementChange(
                    'length',
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder='e.g., 96'
                className='text-sm'
              />
            </div>
          </div>

          <div className='pt-4 border-t border-slate-200 space-y-3'>
            <div className='flex justify-end items-center'>
              <Button onClick={handleAddSide} size='sm' className='text-xs'>
                <svg
                  className='w-4 h-4 mr-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  ></path>
                </svg>
                ADD SIDE
              </Button>
            </div>
            {measurements.extraMeasurements.map((m) => (
              <div
                key={m.id}
                className='p-3 bg-slate-50 rounded-lg border border-slate-300 animate-fade-in'
              >
                <div className='flex justify-between items-center mb-2'>
                  <Input
                    type='text'
                    value={m.label}
                    placeholder='e.g., Closet'
                    onChange={(e) =>
                      handleExtraMeasurementChange(
                        m.id,
                        'label',
                        e.target.value
                      )
                    }
                    className='w-full p-1 text-slate-800 font-semibold border-b-2 border-transparent focus:border-blue-500 focus:outline-none bg-transparent'
                  />
                  <Button
                    onClick={() => handleDeleteMeasurement(m.id)}
                    variant='ghost'
                    size='sm'
                    className='p-1 text-red-400 hover:text-red-600 hover:bg-red-100'
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </Button>
                </div>
                <div className='grid grid-cols-2 gap-2 pt-2'>
                  <Input
                    type='number'
                    value={m.width?.toString() || ''}
                    onChange={(e) =>
                      handleExtraMeasurementChange(
                        m.id,
                        'width',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder='Width (in)'
                    className='w-full p-2 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
                  />
                  <Input
                    type='number'
                    value={m.length?.toString() || ''}
                    onChange={(e) =>
                      handleExtraMeasurementChange(
                        m.id,
                        'length',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder='Length (in)'
                    className='w-full p-2 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleCard>

      {/* Design Card */}
      <CollapsibleCard
        title='Design'
        isOpen={!isDesignCollapsed}
        onToggle={() => setIsDesignCollapsed(!isDesignCollapsed)}
      >
        <div className='space-y-4'>
          <div className='flex items-center justify-between p-4 bg-white rounded-lg border border-slate-300'>
            <span className='text-sm font-semibold text-slate-700'>
              Will the client supply the tiles?
            </span>
            <div className='flex space-x-2'>
              <Button
                variant={
                  !construction.clientSuppliesTiles ? 'default' : 'outline'
                }
                size='sm'
                onClick={() =>
                  handleConstructionChange('clientSuppliesTiles', false)
                }
                className='text-xs'
              >
                No
              </Button>
              <Button
                variant={
                  construction.clientSuppliesTiles ? 'default' : 'outline'
                }
                size='sm'
                onClick={() =>
                  handleConstructionChange('clientSuppliesTiles', true)
                }
                className='text-xs'
              >
                Yes
              </Button>
            </div>
          </div>

          {construction.clientSuppliesTiles && (
            <div className='pb-4 border-b border-slate-200'>
              <p className='text-xs text-slate-500 px-1'>
                Client-supplied tiles. Still enter tile size and pattern for
                grout and thinset calculation.
              </p>
            </div>
          )}

          <Select
            id='tile-size'
            label='Tile Size'
            value={design.selectedTileSizeOption}
            onChange={(e) => handleTileSizeOptionChange(e.target.value)}
          >
            {tileSizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          {design.selectedTileSizeOption === 'custom' && (
            <div className='grid grid-cols-2 gap-4 pt-2 animate-fade-in'>
              <div>
                <Label
                  htmlFor='tile-width'
                  className='text-sm font-medium text-slate-600 mb-1.5'
                >
                  Tile Width (in)
                </Label>
                <Input
                  id='tile-width'
                  type='number'
                  value={design.tileSize.width}
                  onChange={(e) =>
                    handleDesignChange('tileSize', {
                      ...design.tileSize,
                      width: e.target.value,
                    })
                  }
                  placeholder='e.g., 8'
                  className='text-sm'
                />
              </div>
              <div>
                <Label
                  htmlFor='tile-length'
                  className='text-sm font-medium text-slate-600 mb-1.5'
                >
                  Tile Length (in)
                </Label>
                <Input
                  id='tile-length'
                  type='number'
                  value={design.tileSize.length}
                  onChange={(e) =>
                    handleDesignChange('tileSize', {
                      ...design.tileSize,
                      length: e.target.value,
                    })
                  }
                  placeholder='e.g., 8'
                  className='text-sm'
                />
              </div>
            </div>
          )}

          <Select
            id='tile-pattern'
            label='Tile Pattern'
            value={design.tilePattern}
            onChange={(e) => handleDesignChange('tilePattern', e.target.value)}
          >
            {tilePatternOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          {design.tilePattern !== 'select_option' && (
            <div className='mt-2 text-red-600 text-xs animate-fade-in'>
              Note: A <strong>{getWasteFactorText()} waste factor</strong> has
              been applied for this pattern and added to the materials list.
            </div>
          )}

          {design.tilePattern === 'other' && (
            <div className='pt-2 animate-fade-in'>
              <Input
                type='text'
                value={design.customPattern}
                onChange={(e) =>
                  handleDesignChange('customPattern', e.target.value)
                }
                placeholder='Specify custom pattern...'
                className='text-sm'
              />
            </div>
          )}

          <div className='pt-4 border-t border-slate-200'>
            <Textarea
              id='floor-design-notes'
              label='Notes'
              value={design.notes}
              onChange={(e) => handleDesignChange('notes', e.target.value)}
              rows={3}
              placeholder='Add design notes...'
              className='text-sm'
            />
          </div>
        </div>
      </CollapsibleCard>

      {/* Heated Floors Card */}
      <CollapsibleCard
        title='Heated Floors'
        isOpen={!isHeatedFloorCollapsed}
        onToggle={() => setIsHeatedFloorCollapsed(!isHeatedFloorCollapsed)}
      >
        <div className='space-y-4'>
          <div className='flex items-center justify-between p-4 bg-white rounded-lg border border-slate-300'>
            <span className='text-sm font-semibold text-slate-700'>
              Install Heated Floor System
            </span>
            <div className='flex space-x-2'>
              <Button
                variant={!construction.isHeatedFloor ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleConstructionChange('isHeatedFloor', false)}
                className='text-xs'
              >
                No
              </Button>
              <Button
                variant={construction.isHeatedFloor ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleConstructionChange('isHeatedFloor', true)}
                className='text-xs'
              >
                Yes
              </Button>
            </div>
          </div>

          {construction.isHeatedFloor && (
            <div className='pt-3 pl-4 animate-fade-in space-y-4'>
              <p className='text-sm text-amber-800 bg-amber-100 p-3 rounded-lg'>
                <b>Important:</b> Heated floor calculations are derived from the
                dimensions entered in the <b>Floor Measurements</b> card. Please
                ensure these are accurate for the area to be heated.
              </p>
              <Select
                id='heated-floor-type'
                label='System Type'
                value={construction.heatedFloorType}
                onChange={(e) =>
                  handleConstructionChange('heatedFloorType', e.target.value)
                }
              >
                {heatedFloorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>

              {construction.heatedFloorType === 'schluter' && (
                <p className='text-xs text-slate-500 px-1'>
                  <b>Note:</b> Costs are estimated based on standard DITRA-HEAT
                  kits. Please verify the final price and labor hours in the
                  Materials & Labor tabs.
                </p>
              )}

              {construction.heatedFloorType === 'nuheat' && (
                <p className='text-xs text-slate-500 px-1'>
                  <b>Note:</b> Costs are estimated based on standard Nuheat
                  kits. Please verify the final price and labor hours in the
                  Materials & Labor tabs.
                </p>
              )}

              {construction.heatedFloorType === 'custom' && (
                <div className='pt-2'>
                  <Input
                    type='text'
                    value={construction.customHeatedFloorName}
                    onChange={(e) =>
                      handleConstructionChange(
                        'customHeatedFloorName',
                        e.target.value
                      )
                    }
                    placeholder='Enter system name...'
                    className='text-sm'
                  />
                  <p className='text-xs text-slate-500 mt-2 px-1'>
                    Remember to update material costs and labor hours for this
                    custom system.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleCard>

      {/* Construction Card */}
      <CollapsibleCard
        title='Construction'
        isOpen={!isConstructionCollapsed}
        onToggle={() => setIsConstructionCollapsed(!isConstructionCollapsed)}
      >
        <div className='space-y-4'>
          {prepAndStructuralOptions.map((task) => (
            <div key={task.value}>
              <div className='flex items-center justify-between p-4 bg-white rounded-lg border border-slate-300'>
                <span className='text-sm font-semibold text-slate-700'>
                  {task.label}
                </span>
                <div className='flex space-x-2'>
                  <Button
                    variant={
                      !construction.selectedPrepTasks.includes(task.value)
                        ? 'default'
                        : 'outline'
                    }
                    size='sm'
                    onClick={() => handlePrepTaskToggle(task.value)}
                    className='text-xs'
                  >
                    No
                  </Button>
                  <Button
                    variant={
                      construction.selectedPrepTasks.includes(task.value)
                        ? 'default'
                        : 'outline'
                    }
                    size='sm'
                    onClick={() => handlePrepTaskToggle(task.value)}
                    className='text-xs'
                  >
                    Yes
                  </Button>
                </div>
              </div>
              {task.value === 'add_plywood' &&
                construction.selectedPrepTasks.includes('add_plywood') && (
                  <div className='pt-3 pl-4 animate-fade-in'>
                    <Select
                      id='plywood-thickness'
                      label='Plywood Thickness'
                      value={construction.plywoodThickness}
                      onChange={(e) =>
                        handleConstructionChange(
                          'plywoodThickness',
                          e.target.value
                        )
                      }
                    >
                      {plywoodThicknessOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
            </div>
          ))}

          <div className='pt-4 border-t border-slate-200'>
            <Textarea
              id='floor-construction-notes'
              label='Notes'
              value={design.constructionNotes}
              onChange={(e) =>
                handleDesignChange('constructionNotes', e.target.value)
              }
              rows={3}
              placeholder='Add construction notes...'
              className='text-sm'
            />
          </div>
        </div>
      </CollapsibleCard>
    </div>
  );
}
