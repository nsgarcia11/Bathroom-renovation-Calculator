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
import { Trash2 } from 'lucide-react';

interface FloorsDesignData {
  // Measurements
  width: string;
  length: string;
  extraMeasurements: Array<{
    id: number;
    label: string;
    width: string;
    length: string;
  }>;

  // Design
  clientSuppliesTiles: boolean;
  selectedTileSizeOption: string;
  tileSize: {
    width: string;
    length: string;
  };
  tilePattern: string;
  customPattern: string;

  // Heated Floor
  isHeatedFloor: boolean;
  heatedFloorType: string;
  customHeatedFloorName: string;

  // Construction
  selectedPrepTasks: string[];
  plywoodThickness: string;
  joistCount: number; // Number of joists to repair

  // Notes
  designContractorNotes: string;
  designClientNotes: string;
  constructionContractorNotes: string;
  constructionClientNotes: string;

  [key: string]: unknown;
}

export function FloorsSection() {
  const { getDesignData, updateDesign } = useEstimateWorkflowContext();

  // Get design data from context
  const designData = getDesignData('floors') as FloorsDesignData | null;
  const design = useMemo(
    () =>
      designData || {
        width: '',
        length: '',
        extraMeasurements: [],
        clientSuppliesTiles: false,
        selectedTileSizeOption: 'select_option',
        tileSize: { width: '', length: '' },
        tilePattern: 'select_option',
        customPattern: '',
        isHeatedFloor: false,
        heatedFloorType: 'schluter',
        customHeatedFloorName: '',
        selectedPrepTasks: [],
        plywoodThickness: '3/4',
        joistCount: 1,
        designContractorNotes: '',
        designClientNotes: '',
        constructionContractorNotes: '',
        constructionClientNotes: '',
      },
    [designData]
  );

  // Local state for immediate UI updates
  const [localDesign, setLocalDesign] = useState<FloorsDesignData>(design);

  // Sync local state with context
  useEffect(() => {
    setLocalDesign(design);
  }, [design]);

  // Update design in context
  const setDesign = useCallback(
    (updates: Partial<FloorsDesignData>) => {
      setLocalDesign((prev) => ({ ...prev, ...updates }));
      updateDesign('floors', updates);
    },
    [updateDesign]
  );

  // Calculate total square footage
  const totalSqFt = useMemo(() => {
    let totalArea = 0;
    const mainWidth = parseFloat(localDesign.width) || 0;
    const mainLength = parseFloat(localDesign.length) || 0;

    if (mainWidth > 0 && mainLength > 0) {
      totalArea += (mainWidth * mainLength) / 144;
    }

    // Add null check for extraMeasurements
    if (
      localDesign.extraMeasurements &&
      Array.isArray(localDesign.extraMeasurements)
    ) {
      localDesign.extraMeasurements.forEach((m) => {
        const sideWidth = parseFloat(m.width) || 0;
        const sideLength = parseFloat(m.length) || 0;
        if (sideWidth > 0 && sideLength > 0) {
          totalArea += (sideWidth * sideLength) / 144;
        }
      });
    }

    return totalArea;
  }, [localDesign.width, localDesign.length, localDesign.extraMeasurements]);

  // Calculate waste percentage based on pattern (used in materials calculation)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const wastePercentage = useMemo(() => {
    switch (localDesign.tilePattern) {
      case 'stacked':
        return 10; // 10%
      case '1/2_offset':
      case '1/3_offset':
      case 'diagonal':
        return 12; // 12%
      case 'hexagonal':
        return 13; // 13%
      case 'herringbone':
      case 'checkerboard':
        return 15; // 15%
      default:
        return 12; // 12% default for other/custom
    }
  }, [localDesign.tilePattern]);

  // Tile size options
  const tileSizeOptions = [
    { value: 'select_option', label: 'Select a Tile Size...' },
    { value: '12x24', label: '12" x 24"' },
    { value: '12x12', label: '12" x 12"' },
    { value: '6x24', label: '6" x 24"' },
    { value: '24x24', label: '24" x 24"' },
    { value: '6x6', label: '6" x 6"' },
    { value: 'custom', label: 'Custom Size...' },
  ];

  // Tile pattern options
  const tilePatternOptions = [
    { value: 'select_option', label: 'Select a Pattern...' },
    { value: 'stacked', label: 'Stacked (straight grid)' },
    { value: '1/2_offset', label: 'Offset 1/2 (running bond)' },
    { value: '1/3_offset', label: 'Offset 1/3 (running bond)' },
    { value: 'diagonal', label: 'Diagonal grid 45°' },
    { value: 'hexagonal', label: 'Hexagonal' },
    { value: 'herringbone', label: 'Herringbone' },
    { value: 'checkerboard', label: 'Checkerboard' },
    { value: 'other', label: 'Other...' },
  ];

  // Heated floor options
  const heatedFloorOptions = [
    { value: 'schluter', label: 'Schluter-DITRA-HEAT' },
    { value: 'nuheat', label: 'Nuheat Cable System' },
    { value: 'custom', label: 'Custom...' },
  ];

  // Prep and structural options
  const prepAndStructuralOptions = [
    { value: 'self_leveling', label: 'Self-Leveling' },
    { value: 'ditra', label: 'Install Ditra Membrane' },
    { value: 'ditra_xl', label: 'Install Ditra XL Membrane' },
    { value: 'add_plywood', label: 'Add Plywood for Subfloor support' },
    { value: 'repair_subfloor', label: 'Repair portion of subfloor' },
    { value: 'repair_joist', label: 'Repair Floor Joist' },
  ];

  // Plywood thickness options
  const plywoodThicknessOptions = [
    { value: '1/2', label: '1/2"' },
    { value: '5/8', label: '5/8"' },
    { value: '3/4', label: '3/4"' },
  ];

  // Handlers
  const handleDimensionChange = (field: 'width' | 'length', value: string) => {
    setDesign({ [field]: value });
  };

  const handleTileSizeOptionChange = (value: string) => {
    if (value === 'select_option') {
      setDesign({
        selectedTileSizeOption: 'select_option',
        tileSize: { width: '', length: '' },
      });
    } else if (value !== 'custom') {
      const [width, length] = value.split('x');
      setDesign({
        selectedTileSizeOption: value,
        tileSize: { width, length },
      });
    } else {
      setDesign({
        selectedTileSizeOption: 'custom',
        tileSize: { width: '', length: '' },
      });
    }
  };

  const handleTileSizeChange = (field: 'width' | 'length', value: string) => {
    setDesign({
      tileSize: { ...localDesign.tileSize, [field]: value },
    });
  };

  const handleAddSide = () => {
    const currentMeasurements = localDesign.extraMeasurements || [];
    setDesign({
      extraMeasurements: [
        ...currentMeasurements,
        {
          id: Date.now(),
          label: '',
          width: '',
          length: '',
        },
      ],
    });
  };

  const handleExtraMeasurementChange = (
    id: number,
    field: string,
    value: string
  ) => {
    const currentMeasurements = localDesign.extraMeasurements || [];
    setDesign({
      extraMeasurements: currentMeasurements.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    });
  };

  const handleDeleteMeasurement = (id: number) => {
    const currentMeasurements = localDesign.extraMeasurements || [];
    setDesign({
      extraMeasurements: currentMeasurements.filter((m) => m.id !== id),
    });
  };

  const handlePrepTaskToggle = (task: string) => {
    const currentTasks = localDesign.selectedPrepTasks || [];
    setDesign({
      selectedPrepTasks: currentTasks.includes(task)
        ? currentTasks.filter((item) => item !== task)
        : [...currentTasks, task],
    });
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-slate-800'>Floors</h2>
      {/* Measurements Card */}
      <CollapsibleSection
        title='Floor Measurements'
        colorScheme='neutral'
        summary={
          <span className='text-blue-900 font-bold text-lg'>
            {totalSqFt.toFixed(2)} sq/ft
          </span>
        }
      >
        <div className='flex items-center gap-3 mt-0 mb-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 text-slate-400 flex-shrink-0'
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
              <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                Width (in)
              </Label>
              <Input
                type='number'
                value={localDesign.width || ''}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                placeholder='e.g., 60'
                className='bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-slate-800 text-center focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <div>
              <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                Length (in)
              </Label>
              <Input
                type='number'
                value={localDesign.length || ''}
                onChange={(e) =>
                  handleDimensionChange('length', e.target.value)
                }
                placeholder='e.g., 96'
                className='bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-slate-800 text-center focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>
          </div>

          <div className='pt-4 border-t border-slate-200 space-y-3'>
            <div className='flex justify-end items-center'>
              <Button
                onClick={handleAddSide}
                className='inline-flex items-center justify-center gap-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors'
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
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  ></path>
                </svg>
                ADD SIDE
              </Button>
            </div>
            {localDesign.extraMeasurements &&
              localDesign.extraMeasurements.map((m) => (
                <div
                  key={m.id}
                  className='p-3  rounded-lg border border-slate-300 animate-fade-in'
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
                      className='w-full p-1 text-slate-800 font-semibold border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent border-blue-300 focus:border-blue-500 focus:outline-none'
                    />
                    <Button
                      onClick={() => handleDeleteMeasurement(m.id)}
                      variant='ghost'
                      size='sm'
                      className='p-1 text-red-500 hover:text-red-700 h-auto flex-shrink-0'
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className='grid grid-cols-2 gap-2 pt-2'>
                    <Input
                      type='number'
                      value={m.width}
                      onChange={(e) =>
                        handleExtraMeasurementChange(
                          m.id,
                          'width',
                          e.target.value
                        )
                      }
                      placeholder='Width (in)'
                      className='w-full p-2 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
                    />
                    <Input
                      type='number'
                      value={m.length}
                      onChange={(e) =>
                        handleExtraMeasurementChange(
                          m.id,
                          'length',
                          e.target.value
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
      </CollapsibleSection>

      {/* Design Card */}
      <CollapsibleSection title='Design' colorScheme='design'>
        {/* Client Supplies Tiles */}
        <div className='flex items-center justify-between p-4 bg-white rounded-lg border border-slate-300'>
          <span className='text-sm font-semibold text-slate-700'>
            Will the client supply the tiles?
          </span>
          <div className='flex items-center space-x-2'>
            {['No', 'Yes'].map((option) => (
              <Button
                key={option}
                onClick={() =>
                  setDesign({ clientSuppliesTiles: option === 'Yes' })
                }
                variant={
                  localDesign.clientSuppliesTiles === (option === 'Yes')
                    ? 'default'
                    : 'outline'
                }
                size='sm'
                className={
                  localDesign.clientSuppliesTiles === (option === 'Yes')
                    ? 'bg-blue-600 text-white'
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {localDesign.clientSuppliesTiles && (
          <div className='pb-4 border-b border-slate-200'>
            <p className='text-xs text-slate-500 px-1'>
              Client-supplied tiles. Still enter tile size and pattern for grout
              and thinset calculation.
            </p>
          </div>
        )}

        {/* Tile Size Selection */}
        <div>
          <Label className='text-sm font-medium text-gray-700 mb-3 block'>
            Tile Size
          </Label>
          <div className='relative'>
            <Select
              id='flooringType'
              label=''
              value={localDesign.selectedTileSizeOption}
              onChange={(e) => handleTileSizeOptionChange(e.target.value)}
              className='block appearance-none w-full bg-slate-50 border border-blue-300 text-slate-700 py-2.5 px-4 pr-8 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              aria-label='Select tile size'
            >
              {tileSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-500'>
              <svg
                className='fill-current h-5 w-5'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
              </svg>
            </div>
          </div>
        </div>

        {/* Custom Tile Size Inputs */}
        {localDesign.selectedTileSizeOption === 'custom' && (
          <div className='grid grid-cols-2 gap-4 pt-2 animate-fade-in'>
            <div>
              <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                Tile Width (in)
              </Label>
              <Input
                type='number'
                value={localDesign.tileSize.width}
                onChange={(e) => handleTileSizeChange('width', e.target.value)}
                placeholder='e.g., 8'
                className='bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-slate-800 text-center focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>
            <div>
              <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                Tile Length (in)
              </Label>
              <Input
                type='number'
                value={localDesign.tileSize.length}
                onChange={(e) => handleTileSizeChange('length', e.target.value)}
                placeholder='e.g., 8'
                className='bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-slate-800 text-center focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>
          </div>
        )}

        {/* Tile Pattern Selection */}
        <div className='pt-4'>
          <Label className='text-sm font-medium text-gray-700 mb-3 block'>
            Tile Pattern
          </Label>
          <div className='relative'>
            <Select
              id='flooringType'
              label=''
              value={localDesign.tilePattern}
              onChange={(e) => setDesign({ tilePattern: e.target.value })}
              className='block appearance-none w-full bg-slate-50 border border-blue-300 text-slate-700 py-2.5 px-4 pr-8 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              aria-label='Select tile pattern'
            >
              {tilePatternOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-500'>
              <svg
                className='fill-current h-5 w-5'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
              </svg>
            </div>
          </div>
        </div>

        {/* Waste Factor Notifications */}
        {localDesign.tilePattern === 'stacked' && (
          <div className='mt-2 text-red-600 text-xs animate-fade-in'>
            Note: A <strong>10% waste factor</strong> has been applied for this
            pattern and added to the materials list.
          </div>
        )}
        {(localDesign.tilePattern === '1/2_offset' ||
          localDesign.tilePattern === '1/3_offset' ||
          localDesign.tilePattern === 'diagonal') && (
          <div className='mt-2 text-red-600 text-xs animate-fade-in'>
            Note: A <strong>12% waste factor</strong> has been applied for this
            pattern and added to the materials list.
          </div>
        )}
        {localDesign.tilePattern === 'hexagonal' && (
          <div className='mt-2 text-red-600 text-xs animate-fade-in'>
            Note: A <strong>13% waste factor</strong> has been applied for this
            pattern and added to the materials list.
          </div>
        )}
        {(localDesign.tilePattern === 'herringbone' ||
          localDesign.tilePattern === 'checkerboard') && (
          <div className='mt-2 text-red-600 text-xs animate-fade-in'>
            Note: A <strong>15% waste factor</strong> has been applied for this
            pattern and added to the materials list.
          </div>
        )}

        {/* Custom Pattern Input */}
        {localDesign.tilePattern === 'other' && (
          <div className='pt-2 animate-fade-in'>
            <Input
              type='text'
              value={localDesign.customPattern}
              onChange={(e) => setDesign({ customPattern: e.target.value })}
              placeholder='Specify custom pattern...'
              className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
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
              'Offer heated floor upgrade',
              'Suggest larger format tile for cleaner look',
              'Verify transition height at doorway',
            ]}
            clientTags={[
              'Grout colour',
              'transition style / colour',
              'heated floor confirmed',
              'Layout direction (square/diagonal)',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>

      {/* Heated Floors Card */}
      <CollapsibleSection title='Heated Floors' colorScheme='construction'>
        <ToggleSwitch
          label='Install Heated Floor System'
          enabled={localDesign.isHeatedFloor}
          onToggle={(enabled) => setDesign({ isHeatedFloor: enabled })}
        />

        {localDesign.isHeatedFloor && (
          <div className='pt-3 pl-4 animate-fade-in space-y-4'>
            <p className='text-sm text-amber-800 bg-amber-100 p-3 rounded-lg'>
              <b>Important:</b> Heated floor calculations are derived from the
              dimensions entered in the <b>Floor Measurements</b> card. Please
              ensure these are accurate for the area to be heated.
            </p>

            <div>
              <Label className='text-sm font-medium text-gray-700 mb-3 block'>
                System Type
              </Label>
              <div className='relative'>
                <Select
                  id='flooringType'
                  label=''
                  value={localDesign.heatedFloorType}
                  onChange={(e) =>
                    setDesign({ heatedFloorType: e.target.value })
                  }
                  className='block appearance-none w-full bg-slate-50 border border-blue-300 text-slate-700 py-2.5 px-4 pr-8 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  aria-label='Select heated floor system type'
                >
                  {heatedFloorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-500'>
                  <svg
                    className='fill-current h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                  >
                    <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
                  </svg>
                </div>
              </div>
            </div>

            {localDesign.heatedFloorType === 'schluter' && (
              <p className='text-xs text-slate-500 px-1'>
                <b>Note:</b> Costs are estimated based on standard DITRA-HEAT
                kits. Please verify the final price and labor hours in the
                Materials & Labor tabs.
              </p>
            )}

            {localDesign.heatedFloorType === 'nuheat' && (
              <p className='text-xs text-slate-500 px-1'>
                <b>Note:</b> Costs are estimated based on standard Nuheat kits.
                Please verify the final price and labor hours in the Materials &
                Labor tabs.
              </p>
            )}

            {localDesign.heatedFloorType === 'custom' && (
              <div className='pt-2'>
                <Input
                  type='text'
                  value={localDesign.customHeatedFloorName}
                  onChange={(e) =>
                    setDesign({ customHeatedFloorName: e.target.value })
                  }
                  placeholder='Enter system name...'
                  className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <p className='text-xs text-slate-500 mt-2 px-1'>
                  Remember to update material costs and labor hours for this
                  custom system.
                </p>
              </div>
            )}
          </div>
        )}
      </CollapsibleSection>

      {/* Construction Card */}
      <CollapsibleSection title='Construction' colorScheme='construction'>
        <div className='space-y-4'>
          {prepAndStructuralOptions.map((task) => (
            <div key={task.value}>
              <ToggleSwitch
                label={task.label}
                enabled={
                  localDesign.selectedPrepTasks?.includes(task.value) || false
                }
                onToggle={() => handlePrepTaskToggle(task.value)}
              />
              {task.value === 'add_plywood' &&
                localDesign.selectedPrepTasks?.includes('add_plywood') && (
                  <div className='pt-3 pl-4 animate-fade-in'>
                    <div>
                      <Label className='text-sm font-medium text-gray-700 mb-3 block'>
                        Plywood Thickness
                      </Label>
                      <div className='relative'>
                        <Select
                          id='flooringType'
                          label=''
                          value={localDesign.plywoodThickness}
                          onChange={(e) =>
                            setDesign({ plywoodThickness: e.target.value })
                          }
                          className='block appearance-none w-full bg-slate-50 border border-blue-300 text-slate-700 py-2.5 px-4 pr-8 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          aria-label='Select plywood thickness'
                        >
                          {plywoodThicknessOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-500'>
                          <svg
                            className='fill-current h-5 w-5'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                          >
                            <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              {task.value === 'repair_joist' &&
                localDesign.selectedPrepTasks?.includes('repair_joist') && (
                  <div className='pt-3 pl-4 animate-fade-in'>
                    <div>
                      <Label className='text-sm font-medium text-gray-700 mb-3 block'>
                        Number of joists to repair
                      </Label>
                      <Input
                        type='number'
                        value={(localDesign.joistCount || 1).toString()}
                        onChange={(e) =>
                          setDesign({
                            joistCount: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                        className='w-24 bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-slate-800 text-center focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                      />
                      <p className='text-xs text-slate-500 mt-2'>
                        Labor: 4.5 hrs per joist | Materials: 2 pieces of lumber,
                        1 box screws, 2 tubes adhesive per joist
                      </p>
                    </div>
                  </div>
                )}
            </div>
          ))}
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
              'Subfloor damaged or soft',
              'Moisture signs toilet or tub',
              'No existing underlayment',
              'Cracked tiles or grout showing movement',
              'Check joist spacing',
            ]}
            clientTags={[
              'Subfloor inspected and leveled for new tile',
              'Heated Floor',
              'Grout sealant',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
