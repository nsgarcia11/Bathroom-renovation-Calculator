'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
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
  entryType: string;
  drainLocation: string;
  subfloorRepair: boolean;
  joistModification: boolean;
  clientSuppliesBase: string;
  installationBy: string;
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
  const design = useMemo(() => {
    if (designData) {
      return designData;
    }

    // Only use default values if no data exists at all
    return {
      width: '32',
      length: '60',
      baseType: 'Select base type',
      drainType: 'regular',
      waterproofingSystem: 'none',
      entryType: 'curb',
      drainLocation: 'center',
      subfloorRepair: false,
      joistModification: false,
      clientSuppliesBase: 'No',
      installationBy: 'Me',
      designContractorNotes: '',
      designClientNotes: '',
      constructionContractorNotes: '',
      constructionClientNotes: '',
    };
  }, [designData]);

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

  // Entry type options (only for tiled base)
  const entryTypeOptions = [
    { value: 'curb', label: 'Curb' },
    { value: 'curbless', label: 'Curbless' },
  ];

  // Drain location options (only for tiled base)
  const drainLocationOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ];

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-slate-800'>Shower Base</h2>
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
              placeholder='e.g., 32'
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
              placeholder='e.g., 60'
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
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3 pb-3'>
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
              <div className='flex items-center space-x-2 pb-3'>
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

        {/* Installation By - only for Tub and Acrylic Base */}
        {(localDesign.baseType === 'Tub' ||
          localDesign.baseType === 'Acrylic Base') && (
          <div className='pt-4 border-t border-gray-200'>
            <div className='flex items-center justify-between'>
              <Label className='text-sm font-medium text-gray-700'>
                Installation by
              </Label>
              <div className='flex items-center space-x-2 pb-3'>
                {['Me', 'Trade'].map((option) => (
                  <Button
                    key={option}
                    onClick={() => setDesign({ installationBy: option })}
                    variant={
                      localDesign.installationBy === option
                        ? 'default'
                        : 'outline'
                    }
                    size='sm'
                    className={
                      localDesign.installationBy === option
                        ? 'bg-blue-600 text-white'
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                    }
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {/* Trade Installation Reminder Note */}
            {localDesign.installationBy === 'Trade' && (
              <div className='bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start space-x-3 mt-2'>
                <div className='flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-orange-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='text-sm text-orange-800'>
                  <p className='font-medium'>Reminder:</p>
                  <p>
                    The installation cost must be added on the Trades screen, not
                    in the Shower Base labor.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tiled Base Options */}
        {localDesign.baseType === 'Tiled Base' && (
          <>
            {/* Informational Message */}
            <div className='pt-4 border-t border-gray-200'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3'>
                <div className='flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-blue-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='text-sm text-blue-800'>
                  <p className='font-medium'>Next Step:</p>
                  <p>
                    To calculate costs for your tiled base, please open the
                    &apos;Construction&apos; card below and select a
                    waterproofing system.
                  </p>
                </div>
              </div>
            </div>

            {/* Entry Type */}
            <div className='pt-4 border-t border-gray-200'>
              <Label className='text-sm font-medium text-gray-700 mb-3 block'>
                Entry
              </Label>
              <div className='flex space-x-2'>
                {entryTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => setDesign({ entryType: option.value })}
                    variant={
                      localDesign.entryType === option.value
                        ? 'default'
                        : 'outline'
                    }
                    className={`flex-1 ${
                      localDesign.entryType === option.value
                        ? 'bg-blue-600 text-white'
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Drain Type */}
            <div className='pt-4 border-t border-gray-200'>
              <Label className='text-sm font-medium text-gray-700 mb-3 block'>
                Drain Type
              </Label>
              <div className='flex space-x-2'>
                {drainTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => setDesign({ drainType: option.value })}
                    variant={
                      localDesign.drainType === option.value
                        ? 'default'
                        : 'outline'
                    }
                    className={`flex-1 ${
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

            {/* Drain Location */}
            <div className='pt-4 border-t border-gray-200'>
              <Label className='text-sm font-medium text-gray-700 mb-3 block'>
                Drain Location
              </Label>
              <div className='flex space-x-2'>
                {drainLocationOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => setDesign({ drainLocation: option.value })}
                    variant={
                      localDesign.drainLocation === option.value
                        ? 'default'
                        : 'outline'
                    }
                    className={`flex-1 ${
                      localDesign.drainLocation === option.value
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
              'Waterproofing system installed',
              'Slope tested for proper drainage',
              'Drain location',
              'Curb/corners sealed',
            ]}
            clientTags={[
              'Tile type',
              'Grout color',
              'Slip-resistant tile requested',
              'Confirm tile size works with slope',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>

      {/* Construction Card */}
      <CollapsibleSection title='Construction' colorScheme='construction'>
        <div className='space-y-4 pb-3'>
          {/* Waterproofing System - only for Tiled Base */}
          {localDesign.baseType === 'Tiled Base' && (
            <div>
              <Label className='text-sm font-medium text-gray-700 mb-3 block'>
                Which waterproofing system will be used?
              </Label>
              <Select
                id='waterproofingSystem'
                label=''
                value={localDesign.waterproofingSystem}
                onChange={(e) =>
                  setDesign({ waterproofingSystem: e.target.value })
                }
                className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              >
                {waterproofingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          )}

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
              'Subfloor condition verified for slope',
              'Tile layout centered to drain',
              'Offer linear drain upgrade',
              'Suggest curbless conversion if feasible',
            ]}
            clientTags={[
              'Waterproofing system installed and tested',
              'Base sloped for proper drainage',
              'Leak test completed before tiling',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
