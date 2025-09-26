'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleSwitch } from '@/components/estimate/shared/ToggleSwitch';
import { WorkflowNotesSection } from '@/components/estimate/shared/WorkflowNotesSection';
import { CollapsibleSection } from '@/components/estimate/shared/CollapsibleSection';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';

interface ShowerBaseDesignData {
  width: string;
  length: string;
  baseType: string;
  drainType: string;
  waterproofingSystem: string;
  subfloorRepair: boolean;
  joistModification: boolean;
  clientSuppliesBase: string;
  designContractorNotes: string;
  designClientNotes: string;
  constructionContractorNotes: string;
  constructionClientNotes: string;
  [key: string]: unknown;
}

export function ShowerBaseSection() {
  const { getDesignData, updateDesign } = useEstimateWorkflowContext();

  // Get design data from context
  const designData = getDesignData('showerBase') as ShowerBaseDesignData | null;
  const design = useMemo(
    () =>
      designData || {
        width: '',
        length: '',
        baseType: 'Select base type',
        drainType: 'regular',
        waterproofingSystem: 'none',
        subfloorRepair: false,
        joistModification: false,
        clientSuppliesBase: 'No',
        designContractorNotes: '',
        designClientNotes: '',
        constructionContractorNotes: '',
        constructionClientNotes: '',
      },
    [designData]
  );

  // Local state for immediate UI updates
  const [localDesign, setLocalDesign] = useState<ShowerBaseDesignData>(design);

  // Sync local state with context
  useEffect(() => {
    setLocalDesign(design);
  }, [design]);

  // Update design in context
  const setDesign = useCallback(
    (updates: Partial<ShowerBaseDesignData>) => {
      setLocalDesign((prev) => ({ ...prev, ...updates }));
      updateDesign('showerBase', updates);
    },
    [updateDesign]
  );

  // Base type options
  const baseTypeOptions = [
    { value: 'Tub', label: 'Tub' },
    { value: 'Acrylic Base', label: 'Acrylic Base' },
    { value: 'Tiled Base', label: 'Tiled Base' },
  ];

  // Drain type options (only for tiled base)
  const drainTypeOptions = [
    { value: 'regular', label: 'Regular Drain' },
    { value: 'linear', label: 'Linear Drain' },
  ];

  // Waterproofing system options (only for tiled base)
  const waterproofingOptions = [
    { value: 'none', label: 'None / Select System...' },
    { value: 'kerdi', label: 'Schluter-Kerdi System' },
    { value: 'liquid', label: 'Liquid Membrane' },
    { value: 'kerdi-board', label: 'Kerdi-Board' },
  ];

  return (
    <div className='space-y-6'>
      {/* Measurements Card */}
      <CollapsibleSection title='Measurements' colorScheme='neutral'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label className='text-sm font-medium text-gray-700 mb-2 block'>
              Width (inches)
            </Label>
            <Input
              type='number'
              value={localDesign.width || ''}
              onChange={(e) => setDesign({ width: e.target.value })}
              className='bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-slate-800 text-center focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='Enter width'
            />
          </div>
          <div>
            <Label className='text-sm font-medium text-gray-700 mb-2 block'>
              Length (inches)
            </Label>
            <Input
              type='number'
              value={localDesign.length || ''}
              onChange={(e) => setDesign({ length: e.target.value })}
              className='bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-slate-800 text-center focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='Enter length'
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Design Card */}
      <CollapsibleSection title='Design' colorScheme='design'>
        {/* Base Type Selection */}
        <div>
          <Label className='text-sm font-medium text-gray-700 mb-3 block'>
            What type of shower base will be installed?
          </Label>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {baseTypeOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => setDesign({ baseType: option.value })}
                variant={
                  localDesign.baseType === option.value ? 'default' : 'outline'
                }
                className={`w-full ${
                  localDesign.baseType === option.value
                    ? 'bg-blue-600 text-white'
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Client Supplies Base */}
        {localDesign.baseType !== 'Select base type' && (
          <div className='pt-4 border-t border-gray-200'>
            <div className='flex items-center justify-between'>
              <Label className='text-sm font-medium text-gray-700'>
                Will the client supply the base?
              </Label>
              <div className='flex items-center space-x-2'>
                {['No', 'Yes'].map((option) => (
                  <Button
                    key={option}
                    onClick={() => setDesign({ clientSuppliesBase: option })}
                    variant={
                      localDesign.clientSuppliesBase === option
                        ? 'default'
                        : 'outline'
                    }
                    size='sm'
                    className={
                      localDesign.clientSuppliesBase === option
                        ? 'bg-blue-600 text-white'
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                    }
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tiled Base Options */}
        {localDesign.baseType === 'Tiled Base' && (
          <>
            {/* Drain Type */}
            <div className='pt-4 border-t border-gray-200'>
              <Label className='text-sm font-medium text-gray-700 mb-3 block'>
                What type of drain will be used?
              </Label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {drainTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => setDesign({ drainType: option.value })}
                    variant={
                      localDesign.drainType === option.value
                        ? 'default'
                        : 'outline'
                    }
                    className={`w-full ${
                      localDesign.drainType === option.value
                        ? 'bg-blue-600 text-white'
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Curb Options */}
            <div className='pt-4 border-t border-gray-200'>
              <div className='flex items-center justify-between'>
                <Label className='text-sm font-medium text-gray-700'>
                  Will there be a curb?
                </Label>
                <div className='flex items-center space-x-2'>
                  {['curb', 'curbless'].map((option) => (
                    <Button
                      key={option}
                      onClick={() => setDesign({ drainType: option })}
                      variant={
                        localDesign.drainType === option ? 'default' : 'outline'
                      }
                      size='sm'
                      className={
                        localDesign.drainType === option
                          ? 'bg-blue-600 text-white'
                          : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                      }
                    >
                      {option === 'curb' ? 'With Curb' : 'Curbless Entry'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Waterproofing System */}
            <div className='pt-4 border-t border-gray-200'>
              <Label className='text-sm font-medium text-gray-700 mb-3 block'>
                Which waterproofing system will be used?
              </Label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {waterproofingOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() =>
                      setDesign({ waterproofingSystem: option.value })
                    }
                    variant={
                      localDesign.waterproofingSystem === option.value
                        ? 'default'
                        : 'outline'
                    }
                    className={`w-full ${
                      localDesign.waterproofingSystem === option.value
                        ? 'bg-blue-600 text-white'
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Design Notes */}
        <div className='pt-4 border-t border-gray-200'>
          <WorkflowNotesSection
            contractorNotes={localDesign.designContractorNotes || ''}
            clientNotes={localDesign.designClientNotes || ''}
            onContractorNotesChange={(notes) => {
              setDesign({ designContractorNotes: notes });
            }}
            onClientNotesChange={(notes) => {
              setDesign({ designClientNotes: notes });
            }}
            title='Design Notes'
            placeholder='Add design-specific notes here...'
            contractorTags={[
              'Base Type',
              'Drain Configuration',
              'Waterproofing System',
              'Curb Design',
              'Access Requirements',
            ]}
            clientTags={[
              'Design Preferences',
              'Accessibility Needs',
              'Style Requirements',
              'Budget Considerations',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>

      {/* Construction Card */}
      <CollapsibleSection title='Construction' colorScheme='construction'>
        <div className='space-y-4'>
          <ToggleSwitch
            label='Subfloor repair required?'
            enabled={localDesign.subfloorRepair}
            onToggle={(enabled) => setDesign({ subfloorRepair: enabled })}
          />
          <ToggleSwitch
            label='Joist modification required?'
            enabled={localDesign.joistModification}
            onToggle={(enabled) => setDesign({ joistModification: enabled })}
          />
        </div>

        {/* Construction Notes */}
        <div className='pt-4 border-t border-gray-200'>
          <WorkflowNotesSection
            contractorNotes={localDesign.constructionContractorNotes || ''}
            clientNotes={localDesign.constructionClientNotes || ''}
            onContractorNotesChange={(notes) => {
              setDesign({ constructionContractorNotes: notes });
            }}
            onClientNotesChange={(notes) => {
              setDesign({ constructionClientNotes: notes });
            }}
            title='Construction Notes'
            placeholder='Add construction-specific notes here...'
            contractorTags={[
              'Installation Method',
              'Waterproofing Details',
              'Drain Connection',
              'Subfloor Preparation',
              'Quality Control',
            ]}
            clientTags={[
              'Timeline Requirements',
              'Access Restrictions',
              'Quality Expectations',
              'Cleanup Requirements',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
