'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { CollapsibleCard } from '@/components/estimate/shared/CollapsibleCard';
import { WorkflowNotesSection } from '@/components/estimate/shared/WorkflowNotesSection';
import { useShowerBaseCalculations } from '@/hooks/use-shower-base-calculations';
import type {
  ShowerBaseMeasurements,
  ShowerBaseDesign,
  ShowerBaseConstruction,
} from '@/lib/shower-base-calculator';

interface ShowerBaseSectionProps {
  measurements: ShowerBaseMeasurements;
  setMeasurements: (measurements: ShowerBaseMeasurements) => void;
  design: ShowerBaseDesign;
  setDesign: (
    design: ShowerBaseDesign | ((prev: ShowerBaseDesign) => ShowerBaseDesign)
  ) => void;
  construction: ShowerBaseConstruction;
  setConstruction: (
    construction:
      | ShowerBaseConstruction
      | ((prev: ShowerBaseConstruction) => ShowerBaseConstruction)
  ) => void;
}

export function ShowerBaseSection({
  measurements,
  setMeasurements,
  design,
  setDesign,
  construction,
  setConstruction,
}: ShowerBaseSectionProps) {
  const [isDesignCollapsed, setIsDesignCollapsed] = useState(false);
  const [isConstructionCollapsed, setIsConstructionCollapsed] = useState(false);

  const { totalSqft } = useShowerBaseCalculations(
    measurements,
    design,
    construction
  );

  const handleMeasurementChange = useCallback(
    (field: keyof ShowerBaseMeasurements, value: number) => {
      setMeasurements({ ...measurements, [field]: value });
    },
    [measurements, setMeasurements]
  );

  const handleDesignChange = useCallback(
    (field: keyof ShowerBaseDesign, value: string) => {
      setDesign((prev) => ({ ...prev, [field]: value }));
    },
    [setDesign]
  );

  const handleConstructionChange = useCallback(
    (field: keyof ShowerBaseConstruction, value: string | boolean) => {
      setConstruction((prev) => ({ ...prev, [field]: value }));
    },
    [setConstruction]
  );

  const showPrefabricatedOptions =
    design.baseType === 'Tub' || design.baseType === 'Acrylic Base';
  const showTiledOptions = design.baseType === 'Tiled Base';
  const showTiledConstructionOptions = design.baseType === 'Tiled Base';
  const showTiledBaseNote = design.baseType === 'Tiled Base';
  const showTradeInstallNote = design.baseInstallationBy === 'trade';
  const showClientSuppliesNote = design.clientSuppliesBase === 'yes';

  return (
    <div className='space-y-5'>
      {/* Measurements Card */}
      <Card>
        <CardContent className='p-5'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-bold text-slate-800'>Measurements</h2>
            <div className='flex items-center gap-4'>
              <span className='text-lg font-bold text-blue-600'>
                {totalSqft.toFixed(2)} sq/ft
              </span>
            </div>
          </div>
          <p className='text-sm text-slate-500 mb-4'>
            Enter the base dimensions to calculate materials and labor.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <Label
                htmlFor='base-width'
                className='text-sm font-medium text-slate-600 mb-1.5'
              >
                Width (in)
              </Label>
              <Input
                id='base-width'
                type='number'
                value={measurements.width?.toString() || ''}
                onChange={(e) =>
                  handleMeasurementChange(
                    'width',
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder='e.g., 32'
                className='text-sm'
              />
            </div>
            <div>
              <Label
                htmlFor='base-length'
                className='text-sm font-medium text-slate-600 mb-1.5'
              >
                Length (in)
              </Label>
              <Input
                id='base-length'
                type='number'
                value={measurements.length?.toString() || ''}
                onChange={(e) =>
                  handleMeasurementChange(
                    'length',
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder='e.g., 60'
                className='text-sm'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Design Card */}
      <CollapsibleCard
        title='Design'
        isOpen={!isDesignCollapsed}
        onToggle={() => setIsDesignCollapsed(!isDesignCollapsed)}
      >
        <div className='space-y-6'>
          <div>
            <Select
              id='base-type'
              label='Base Type'
              value={design.baseType}
              onChange={(e) => handleDesignChange('baseType', e.target.value)}
            >
              <option value=''>Select a Base Type...</option>
              <option value='Tub'>Tub</option>
              <option value='Acrylic Base'>Acrylic Base</option>
              <option value='Tiled Base'>Tiled Base</option>
            </Select>
          </div>

          {/* Tiled Base Note */}
          {showTiledBaseNote && (
            <div className='flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200'>
              <div className='w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5'>
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
                  <path d='M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 9 6c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5' />
                  <path d='M9 18h6' />
                  <path d='M10 22h4' />
                </svg>
              </div>
              <p className='text-xs text-slate-600 flex-grow'>
                <span className='font-semibold text-blue-700'>Next Step:</span>{' '}
                To calculate costs for your tiled base, please open the
                &apos;Construction&apos; card below and select a waterproofing
                system.
              </p>
            </div>
          )}

          {/* Prefabricated Base Options */}
          {showPrefabricatedOptions && (
            <div className='space-y-4'>
              <div className='bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4'>
                <div className='flex items-center justify-between'>
                  <Label className='text-sm font-medium text-slate-600'>
                    Will the client supply the base?
                  </Label>
                  <div className='flex space-x-2'>
                    <Button
                      variant={
                        design.clientSuppliesBase === 'no'
                          ? 'default'
                          : 'outline'
                      }
                      size='sm'
                      onClick={() =>
                        handleDesignChange('clientSuppliesBase', 'no')
                      }
                      className='text-xs'
                    >
                      No
                    </Button>
                    <Button
                      variant={
                        design.clientSuppliesBase === 'yes'
                          ? 'default'
                          : 'outline'
                      }
                      size='sm'
                      onClick={() =>
                        handleDesignChange('clientSuppliesBase', 'yes')
                      }
                      className='text-xs'
                    >
                      Yes
                    </Button>
                  </div>
                </div>
                <hr className='border-slate-100' />
                <div className='flex items-center justify-between'>
                  <Label className='text-sm font-medium text-slate-600'>
                    Installation By:
                  </Label>
                  <div className='flex space-x-2'>
                    <Button
                      variant={
                        design.baseInstallationBy === 'me'
                          ? 'default'
                          : 'outline'
                      }
                      size='sm'
                      onClick={() =>
                        handleDesignChange('baseInstallationBy', 'me')
                      }
                      className='text-xs'
                    >
                      Me
                    </Button>
                    <Button
                      variant={
                        design.baseInstallationBy === 'trade'
                          ? 'default'
                          : 'outline'
                      }
                      size='sm'
                      onClick={() =>
                        handleDesignChange('baseInstallationBy', 'trade')
                      }
                      className='text-xs'
                    >
                      Trade
                    </Button>
                  </div>
                </div>
              </div>

              {showClientSuppliesNote && (
                <div className='flex items-start gap-3'>
                  <div className='w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5'>
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
                      <path d='M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 9 6c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5' />
                      <path d='M9 18h6' />
                      <path d='M10 22h4' />
                    </svg>
                  </div>
                  <p className='text-xs text-orange-500 flex-grow'>
                    <span className='font-semibold'>Note:</span> Base will be
                    removed from the Materials screen.
                  </p>
                </div>
              )}

              {showTradeInstallNote && (
                <div className='flex items-start gap-3'>
                  <div className='w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5'>
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
                      <path d='M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 9 6c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5' />
                      <path d='M9 18h6' />
                      <path d='M10 22h4' />
                    </svg>
                  </div>
                  <p className='text-xs text-orange-500 flex-grow'>
                    <span className='font-semibold'>Note:</span> The cost for
                    installation by a trade professional should be added on the
                    Trades screen.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tiled Base Options */}
          {showTiledOptions && (
            <div className='space-y-6'>
              <div className='space-y-3 pt-1 bg-slate-50 p-4 rounded-lg border border-slate-200'>
                <div className='grid grid-cols-3 items-center gap-4'>
                  <Label className='text-sm font-medium text-slate-600 col-span-1'>
                    Entry
                  </Label>
                  <div className='col-span-2 flex justify-end space-x-2'>
                    <Button
                      variant={
                        design.entryType === 'curb' ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() => handleDesignChange('entryType', 'curb')}
                      className='text-xs'
                    >
                      Curb
                    </Button>
                    <Button
                      variant={
                        design.entryType === 'curbless' ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() =>
                        handleDesignChange('entryType', 'curbless')
                      }
                      className='text-xs'
                    >
                      Curbless
                    </Button>
                  </div>
                </div>
                <hr className='border-slate-100' />
                <div className='grid grid-cols-3 items-center gap-4'>
                  <Label className='text-sm font-medium text-slate-600 col-span-1'>
                    Drain Type
                  </Label>
                  <div className='col-span-2 flex justify-end space-x-2'>
                    <Button
                      variant={
                        design.drainType === 'regular' ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() => handleDesignChange('drainType', 'regular')}
                      className='text-xs'
                    >
                      Regular
                    </Button>
                    <Button
                      variant={
                        design.drainType === 'linear' ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() => handleDesignChange('drainType', 'linear')}
                      className='text-xs'
                    >
                      Linear
                    </Button>
                  </div>
                </div>
                <hr className='border-slate-100' />
                <div className='grid grid-cols-3 items-center gap-4'>
                  <Label className='text-sm font-medium text-slate-600 col-span-1'>
                    Drain Location
                  </Label>
                  <div className='col-span-2 flex justify-end space-x-2'>
                    <Button
                      variant={
                        design.drainLocation === 'left' ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() =>
                        handleDesignChange('drainLocation', 'left')
                      }
                      className='text-xs'
                    >
                      Left
                    </Button>
                    <Button
                      variant={
                        design.drainLocation === 'center'
                          ? 'default'
                          : 'outline'
                      }
                      size='sm'
                      onClick={() =>
                        handleDesignChange('drainLocation', 'center')
                      }
                      className='text-xs'
                    >
                      Center
                    </Button>
                    <Button
                      variant={
                        design.drainLocation === 'right' ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() =>
                        handleDesignChange('drainLocation', 'right')
                      }
                      className='text-xs'
                    >
                      Right
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Design Notes */}
          <WorkflowNotesSection
            contractorNotes={design.designContractorNotes}
            clientNotes={design.designClientNotes}
            onContractorNotesChange={(value: string) =>
              handleDesignChange('designContractorNotes', value)
            }
            onClientNotesChange={(value: string) =>
              handleDesignChange('designClientNotes', value)
            }
            title='Design Notes'
            placeholder='Add design-specific notes here...'
            contractorTags={[
              'Base Type',
              'Drain Type',
              'Entry Style',
              'Client Supplies',
              'Installation Method',
              'Drain Location',
              'Base Material',
              'Waterproofing',
            ]}
            clientTags={[
              'Design Preferences',
              'Style Requests',
              'Budget Considerations',
              'Timeline Concerns',
              'Special Requirements',
              'Access Needs',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleCard>

      {/* Construction Card */}
      <CollapsibleCard
        title='Construction'
        isOpen={!isConstructionCollapsed}
        onToggle={() => setIsConstructionCollapsed(!isConstructionCollapsed)}
      >
        <div className='space-y-4'>
          {/* Tiled Base Construction Options */}
          {showTiledConstructionOptions && (
            <div className='space-y-4'>
              <div>
                <Select
                  id='tiled-base-system'
                  label='Waterproofing System'
                  value={construction.tiledBaseSystem}
                  onChange={(e) =>
                    handleConstructionChange('tiledBaseSystem', e.target.value)
                  }
                >
                  <option value=''>Select a system...</option>
                  <option value='Schluter'>Schluter</option>
                  <option value='Mortar Bed'>Mortar Bed</option>
                  <option value='Wedi'>Wedi</option>
                  <option value='Laticrete'>Laticrete</option>
                </Select>
              </div>
            </div>
          )}

          <div className='flex items-center justify-between bg-slate-50 p-3 rounded-lg'>
            <Label className='text-sm font-medium text-slate-700'>
              Repair Subfloor
            </Label>
            <div className='flex space-x-2'>
              <Button
                variant={!construction.repairSubfloor ? 'default' : 'outline'}
                size='sm'
                onClick={() =>
                  handleConstructionChange('repairSubfloor', false)
                }
                className='text-xs'
              >
                No
              </Button>
              <Button
                variant={construction.repairSubfloor ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleConstructionChange('repairSubfloor', true)}
                className='text-xs'
              >
                Yes
              </Button>
            </div>
          </div>

          <div className='flex items-center justify-between bg-slate-50 p-3 rounded-lg'>
            <Label className='text-sm font-medium text-slate-700'>
              Modify Floor Joists
            </Label>
            <div className='flex space-x-2'>
              <Button
                variant={!construction.modifyJoists ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleConstructionChange('modifyJoists', false)}
                className='text-xs'
              >
                No
              </Button>
              <Button
                variant={construction.modifyJoists ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleConstructionChange('modifyJoists', true)}
                className='text-xs'
              >
                Yes
              </Button>
            </div>
          </div>

          {/* Construction Notes */}
          <WorkflowNotesSection
            contractorNotes={construction.constructionContractorNotes}
            clientNotes={construction.constructionClientNotes}
            onContractorNotesChange={(value: string) =>
              handleConstructionChange('constructionContractorNotes', value)
            }
            onClientNotesChange={(value: string) =>
              handleConstructionChange('constructionClientNotes', value)
            }
            title='Construction Notes'
            placeholder='Add construction-specific notes here...'
            contractorTags={[
              'Subfloor Repair',
              'Joist Modification',
              'Tiled Base System',
              'Waterproofing Details',
              'Drain Installation',
              'Base Installation',
              'Structural Work',
              'Plumbing Work',
            ]}
            clientTags={[
              'Access Requirements',
              'Timeline Constraints',
              'Noise Restrictions',
              'Cleanup Preferences',
              'Quality Expectations',
              'Inspection Needs',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleCard>
    </div>
  );
}
