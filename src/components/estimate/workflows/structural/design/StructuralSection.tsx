'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleSwitch } from '@/components/estimate/shared/ToggleSwitch';
import { WorkflowNotesSection } from '@/components/estimate/shared/WorkflowNotesSection';
import { CollapsibleSection } from '@/components/estimate/shared/CollapsibleSection';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
import { Plus, Trash2 } from 'lucide-react';

interface StructuralDesignData {
  // Dimensions
  width: string;
  length: string;
  height: string;

  // Wall Work
  frameNewWall: boolean;
  removeWall: boolean;
  frameDoorway: boolean;
  frameWindow: boolean;
  wallLength: string;
  doorwayWidth: string;
  windowWidth: string;
  windowHeight: string;

  // Structural Support
  installBeam: boolean;
  installHeader: boolean;
  reinforceJoists: boolean;
  beamLength: string;
  headerLength: string;

  // Subfloor Work
  installPlywood: boolean;
  repairSubfloor: boolean;
  plywoodThickness: '1/2' | '5/8' | '3/4';
  subfloorArea: string;

  // Insulation
  installInsulation: boolean;
  installVaporBarrier: boolean;
  insulationArea: string;

  // Extra Measurements
  extraMeasurements: Array<{
    id: string;
    width: string;
    length: string;
  }>;

  // Notes
  designContractorNotes: string;
  designClientNotes: string;
  constructionContractorNotes: string;
  constructionClientNotes: string;

  [key: string]: unknown;
}

export function StructuralSection() {
  const { getDesignData, updateDesign } = useEstimateWorkflowContext();

  // Get design data from context
  const designData = getDesignData('structural') as StructuralDesignData | null;
  const design = useMemo(
    () =>
      designData || {
        width: '60',
        length: '96',
        height: '96',
        frameNewWall: false,
        removeWall: false,
        frameDoorway: false,
        frameWindow: false,
        wallLength: '',
        doorwayWidth: '',
        windowWidth: '',
        windowHeight: '',
        installBeam: false,
        installHeader: false,
        reinforceJoists: false,
        beamLength: '',
        headerLength: '',
        installPlywood: false,
        repairSubfloor: false,
        plywoodThickness: '5/8' as const,
        subfloorArea: '',
        installInsulation: false,
        installVaporBarrier: false,
        insulationArea: '',
        extraMeasurements: [],
        designContractorNotes: '',
        designClientNotes: '',
        constructionContractorNotes: '',
        constructionClientNotes: '',
      },
    [designData]
  );

  // Local state for immediate UI updates
  const [localDesign, setLocalDesign] = useState<StructuralDesignData>(design);

  // Sync local state with context
  useEffect(() => {
    setLocalDesign(design);
  }, [design]);

  // Update design in context
  const setDesign = useCallback(
    (updates: Partial<StructuralDesignData>) => {
      setLocalDesign((prev) => ({ ...prev, ...updates }));
      updateDesign('structural', updates);
    },
    [updateDesign]
  );

  // Handlers
  const handleDimensionChange = useCallback(
    (field: 'width' | 'length' | 'height', value: string) => {
      setDesign({ [field]: value });
    },
    [setDesign]
  );

  const handleMeasurementChange = useCallback(
    (field: string, value: string) => {
      setDesign({ [field]: value });
    },
    [setDesign]
  );

  const handleAddExtraMeasurement = useCallback(() => {
    const newMeasurement = {
      id: `extra-${Date.now()}`,
      width: '',
      length: '',
    };
    setDesign({
      extraMeasurements: [
        ...(localDesign.extraMeasurements || []),
        newMeasurement,
      ],
    });
  }, [localDesign.extraMeasurements, setDesign]);

  const handleExtraMeasurementChange = useCallback(
    (id: string, field: 'width' | 'length', value: string) => {
      const updatedMeasurements = (localDesign.extraMeasurements || []).map(
        (m) => (m.id === id ? { ...m, [field]: value } : m)
      );
      setDesign({ extraMeasurements: updatedMeasurements });
    },
    [localDesign.extraMeasurements, setDesign]
  );

  const handleDeleteExtraMeasurement = useCallback(
    (id: string) => {
      const updatedMeasurements = (localDesign.extraMeasurements || []).filter(
        (m) => m.id !== id
      );
      setDesign({ extraMeasurements: updatedMeasurements });
    },
    [localDesign.extraMeasurements, setDesign]
  );

  // Calculate areas
  const totalSqFt = useMemo(() => {
    let totalArea = 0;
    const mainWidth = parseFloat(localDesign.width) || 0;
    const mainLength = parseFloat(localDesign.length) || 0;

    if (mainWidth > 0 && mainLength > 0) {
      totalArea += (mainWidth * mainLength) / 144;
    }

    // Add extra measurements
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

  const wallArea = useMemo(() => {
    const w = parseFloat(localDesign.width) || 0;
    const l = parseFloat(localDesign.length) || 0;
    const h = parseFloat(localDesign.height) || 0;
    if (w > 0 && l > 0 && h > 0) {
      return (2 * (w + l) * h) / 144;
    }
    return 0;
  }, [localDesign.width, localDesign.length, localDesign.height]);

  const ceilingArea = useMemo(() => {
    const w = parseFloat(localDesign.width) || 0;
    const l = parseFloat(localDesign.length) || 0;
    if (w > 0 && l > 0) {
      return (w * l) / 144;
    }
    return 0;
  }, [localDesign.width, localDesign.length]);

  const perimeter = useMemo(() => {
    const w = parseFloat(localDesign.width) || 0;
    const l = parseFloat(localDesign.length) || 0;
    if (w > 0 && l > 0) {
      return (2 * (w + l)) / 12; // Convert to feet
    }
    return 0;
  }, [localDesign.width, localDesign.length]);

  return (
    <div className='space-y-6'>
      <div className='pt-2'>
        <h1 className='text-4xl font-bold text-slate-800 text-left'>
          Structural
        </h1>
      </div>

      {/* Measurements Card */}
      <CollapsibleSection
        title='Measurements'
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
            Enter the room dimensions and specific measurements for structural
            work
          </p>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <Label className='text-sm font-medium text-gray-700 mb-1.5 block'>
              Width (in)
            </Label>
            <Input
              type='number'
              value={localDesign.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              placeholder='e.g., 60'
              className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
            />
          </div>
          <div>
            <Label className='text-sm font-medium text-gray-700 mb-1.5 block'>
              Length (in)
            </Label>
            <Input
              type='number'
              value={localDesign.length}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              placeholder='e.g., 96'
              className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
            />
          </div>
          <div>
            <Label className='text-sm font-medium text-gray-700 mb-1.5 block'>
              Height (in)
            </Label>
            <Input
              type='number'
              value={localDesign.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              placeholder='e.g., 96'
              className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
            />
          </div>
        </div>

        {/* Extra Measurements */}
        <div className='mt-4'>
          <div className='flex items-center justify-between mb-3'>
            <Label className='text-sm font-semibold text-slate-600'>
              Additional Areas
            </Label>
            <Button
              onClick={handleAddExtraMeasurement}
              variant='outline'
              size='sm'
              className='flex items-center gap-1 text-blue-600 border-blue-300 hover:bg-blue-50'
            >
              <Plus size={14} />
              Add Side
            </Button>
          </div>
          {localDesign.extraMeasurements &&
            localDesign.extraMeasurements.map((m) => (
              <div
                key={m.id}
                className='p-3 bg-slate-50 rounded-lg border border-slate-300 animate-fade-in'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex-1'>
                    <Label className='text-xs font-medium text-slate-600 mb-1 block'>
                      Width (in)
                    </Label>
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
                      placeholder='e.g., 24'
                      className='w-full p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
                    />
                  </div>
                  <div className='flex-1'>
                    <Label className='text-xs font-medium text-slate-600 mb-1 block'>
                      Length (in)
                    </Label>
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
                      placeholder='e.g., 36'
                      className='w-full p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
                    />
                  </div>
                  <Button
                    onClick={() => handleDeleteExtraMeasurement(m.id)}
                    variant='ghost'
                    size='sm'
                    className='p-1 text-red-500 hover:text-red-700 h-auto flex-shrink-0'
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
        </div>

        {/* Calculated Areas Display */}
        <div className='mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
          <h4 className='text-sm font-semibold text-blue-900 mb-2'>
            Calculated Areas
          </h4>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-blue-700 font-medium'>
                Total Floor Area:
              </span>
              <span className='ml-2 text-blue-900'>
                {totalSqFt.toFixed(1)} sq/ft
              </span>
            </div>
            <div>
              <span className='text-blue-700 font-medium'>Wall Area:</span>
              <span className='ml-2 text-blue-900'>
                {wallArea.toFixed(1)} sq/ft
              </span>
            </div>
            <div>
              <span className='text-blue-700 font-medium'>Ceiling Area:</span>
              <span className='ml-2 text-blue-900'>
                {ceilingArea.toFixed(1)} sq/ft
              </span>
            </div>
            <div>
              <span className='text-blue-700 font-medium'>Perimeter:</span>
              <span className='ml-2 text-blue-900'>
                {perimeter.toFixed(1)} ft
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Wall Work Card */}
      <CollapsibleSection title='Wall Work' colorScheme='design'>
        <ToggleSwitch
          label='Frame New Wall'
          enabled={localDesign.frameNewWall}
          onToggle={(enabled) => setDesign({ frameNewWall: enabled })}
        />
        {localDesign.frameNewWall && (
          <div className='pl-6 pt-2'>
            <Label className='text-sm text-slate-600 mb-2 block'>
              Wall Length (ft)
            </Label>
            <Input
              type='number'
              value={localDesign.wallLength}
              onChange={(e) =>
                handleMeasurementChange('wallLength', e.target.value)
              }
              placeholder='e.g., 8'
              className='w-20 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
            />
          </div>
        )}

        <ToggleSwitch
          label='Remove Existing Wall'
          enabled={localDesign.removeWall}
          onToggle={(enabled) => setDesign({ removeWall: enabled })}
          className='pt-2'
        />

        <ToggleSwitch
          label='Frame Doorway Opening'
          enabled={localDesign.frameDoorway}
          onToggle={(enabled) => setDesign({ frameDoorway: enabled })}
          className='pt-2'
        />
        {localDesign.frameDoorway && (
          <div className='pl-6 pt-2'>
            <Label className='text-sm text-slate-600 mb-2 block'>
              Doorway Width (in)
            </Label>
            <Input
              type='number'
              value={localDesign.doorwayWidth}
              onChange={(e) =>
                handleMeasurementChange('doorwayWidth', e.target.value)
              }
              placeholder='e.g., 32'
              className='w-20 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
            />
          </div>
        )}

        <ToggleSwitch
          label='Frame Window Opening'
          enabled={localDesign.frameWindow}
          onToggle={(enabled) => setDesign({ frameWindow: enabled })}
          className='pt-2'
        />
        {localDesign.frameWindow && (
          <div className='pl-6 pt-2 space-y-2 md:flex gap-4 pb-2'>
            <div className='flex-1'>
              <Label className='text-sm text-slate-600 mb-2 block'>
                Window Width (in)
              </Label>
              <Input
                type='number'
                value={localDesign.windowWidth}
                onChange={(e) =>
                  handleMeasurementChange('windowWidth', e.target.value)
                }
                placeholder='e.g., 36'
                className='w-20 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
              />
            </div>
            <div className='flex-1'>
              <Label className='text-sm text-slate-600 mb-2 block'>
                Window Height (in)
              </Label>
              <Input
                type='number'
                value={localDesign.windowHeight}
                onChange={(e) =>
                  handleMeasurementChange('windowHeight', e.target.value)
                }
                placeholder='e.g., 24'
                className='w-20 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
              />
            </div>
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
              'Wall Layout',
              'Doorway Dimensions',
              'Window Placement',
              'Structural Requirements',
              'Load Bearing Walls',
            ]}
            clientTags={[
              'Room Layout',
              'Door Preferences',
              'Window Size',
              'Access Requirements',
              'Future Modifications',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>

      {/* Structural Support Card */}
      <CollapsibleSection title='Structural Support' colorScheme='construction'>
        <ToggleSwitch
          label='Install Support Beam'
          enabled={localDesign.installBeam}
          onToggle={(enabled) => setDesign({ installBeam: enabled })}
        />
        {localDesign.installBeam && (
          <div className='pl-6 pt-2'>
            <Label className='text-sm text-slate-600 mb-2 block'>
              Beam Length (ft)
            </Label>
            <Input
              type='number'
              value={localDesign.beamLength}
              onChange={(e) =>
                handleMeasurementChange('beamLength', e.target.value)
              }
              placeholder='e.g., 12'
              className='w-20 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
            />
          </div>
        )}

        <ToggleSwitch
          label='Install Header Beam'
          enabled={localDesign.installHeader}
          onToggle={(enabled) => setDesign({ installHeader: enabled })}
          className='pt-2'
        />
        {localDesign.installHeader && (
          <div className='pl-6 pt-2'>
            <Label className='text-sm text-slate-600 mb-2 block'>
              Header Length (ft)
            </Label>
            <Input
              type='number'
              value={localDesign.headerLength}
              onChange={(e) =>
                handleMeasurementChange('headerLength', e.target.value)
              }
              placeholder='e.g., 8'
              className='w-20 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
            />
          </div>
        )}

        <ToggleSwitch
          label='Reinforce Floor Joists'
          enabled={localDesign.reinforceJoists}
          onToggle={(enabled) => setDesign({ reinforceJoists: enabled })}
          className='pt-2'
        />
      </CollapsibleSection>

      {/* Subfloor Work Card */}
      <CollapsibleSection title='Subfloor Work' colorScheme='construction'>
        <ToggleSwitch
          label='Install Plywood Subfloor'
          enabled={localDesign.installPlywood}
          onToggle={(enabled) => setDesign({ installPlywood: enabled })}
        />
        {localDesign.installPlywood && (
          <div className='pl-6 pt-2 space-y-3'>
            <div>
              <Label className='text-sm text-slate-600 mb-2 block'>
                Subfloor Area (sq/ft)
              </Label>
              <Input
                type='number'
                value={localDesign.subfloorArea}
                onChange={(e) =>
                  handleMeasurementChange('subfloorArea', e.target.value)
                }
                placeholder='e.g., 64'
                className='w-24 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
              />
            </div>
            <div>
              <Label className='text-sm text-slate-600 mb-2 block'>
                Plywood Thickness
              </Label>
              <div className='flex space-x-2'>
                {['1/2', '5/8', '3/4'].map((thickness) => (
                  <Button
                    key={thickness}
                    onClick={() =>
                      setDesign({
                        plywoodThickness: thickness as '1/2' | '5/8' | '3/4',
                      })
                    }
                    variant={
                      localDesign.plywoodThickness === thickness
                        ? 'default'
                        : 'outline'
                    }
                    size='sm'
                    className={
                      localDesign.plywoodThickness === thickness
                        ? 'bg-blue-600 text-white'
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                    }
                  >
                    {thickness}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <ToggleSwitch
          label='Repair Subfloor'
          enabled={localDesign.repairSubfloor}
          onToggle={(enabled) => setDesign({ repairSubfloor: enabled })}
          className='pt-2'
        />
      </CollapsibleSection>

      {/* Insulation Card */}
      <CollapsibleSection title='Insulation' colorScheme='construction'>
        <ToggleSwitch
          label='Install Wall Insulation'
          enabled={localDesign.installInsulation}
          onToggle={(enabled) => setDesign({ installInsulation: enabled })}
        />
        {localDesign.installInsulation && (
          <div className='pl-6 pt-2'>
            <Label className='text-sm text-slate-600 mb-2 block'>
              Insulation Area (sq/ft)
            </Label>
            <Input
              type='number'
              value={localDesign.insulationArea}
              onChange={(e) =>
                handleMeasurementChange('insulationArea', e.target.value)
              }
              placeholder='e.g., 120'
              className='w-24 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
            />
          </div>
        )}

        <ToggleSwitch
          label='Install Vapor Barrier'
          enabled={localDesign.installVaporBarrier}
          onToggle={(enabled) => setDesign({ installVaporBarrier: enabled })}
          className='py-2'
        />

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
              'Structural Engineering',
              'Load Calculations',
              'Permit Requirements',
              'Safety Considerations',
              'Material Specifications',
            ]}
            clientTags={[
              'Timeline Requirements',
              'Access Constraints',
              'Noise Restrictions',
              'Quality Standards',
              'Warranty Information',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
