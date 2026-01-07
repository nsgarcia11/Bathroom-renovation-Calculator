'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleSwitch } from '@/components/estimate/shared/ToggleSwitch';
import { WorkflowNotesSection } from '@/components/estimate/shared/WorkflowNotesSection';
import { CollapsibleSection } from '@/components/estimate/shared/CollapsibleSection';
import WarningNote from '@/components/estimate/shared/WarningNote';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
import { Plus, Trash2 } from 'lucide-react';

interface FinishingsDesignData {
  // Dimensions
  width: string;
  length: string;
  height: string;

  // Painting options
  fixWalls: boolean;
  drywallRepairsLevel: 'LIGHT' | 'MEDIUM' | 'HEAVY';
  priming: boolean;
  paintWalls: boolean;
  paintCeiling: boolean;
  paintTrim: boolean;
  paintDoor: boolean;
  numDoors: string;
  nonPaintWallAreaSqFt: string;

  // Installation options
  installBaseboard: boolean;
  installVanity: boolean;
  vanitySinks: number;
  installMirror: boolean;
  installLighting: boolean;
  lightingQuantity: number;
  installToilet: boolean;

  // Trade options
  plumbingPerformedBy: 'me' | 'trade';
  electricalPerformedBy: 'me' | 'trade';

  // Accent walls
  accentWalls: Array<{
    id: string;
    width: string;
    height: string;
    finishType: 'tile' | 'wainscot' | 'paint';
  }>;

  // Notes
  designContractorNotes: string;
  designClientNotes: string;
  constructionContractorNotes: string;
  constructionClientNotes: string;

  [key: string]: unknown;
}

export function FinishingsSection() {
  const { getDesignData, updateDesign } = useEstimateWorkflowContext();

  // Get design data from context
  const designData = getDesignData('finishings') as FinishingsDesignData | null;
  const design = useMemo(
    () =>
      designData || {
        width: '60',
        length: '96',
        height: '96',
        fixWalls: true,
        drywallRepairsLevel: 'LIGHT' as const,
        priming: true,
        paintWalls: true,
        paintCeiling: true,
        paintTrim: false,
        paintDoor: false,
        numDoors: '1',
        nonPaintWallAreaSqFt: '0',
        installBaseboard: false,
        installVanity: true,
        vanitySinks: 1,
        installMirror: true,
        installLighting: true,
        lightingQuantity: 2,
        installToilet: true,
        plumbingPerformedBy: 'me' as const,
        electricalPerformedBy: 'me' as const,
        accentWalls: [],
        designContractorNotes: '',
        designClientNotes: '',
        constructionContractorNotes: '',
        constructionClientNotes: '',
      },
    [designData]
  );

  // Local state for immediate UI updates
  const [localDesign, setLocalDesign] = useState<FinishingsDesignData>(design);

  // Sync local state with context
  useEffect(() => {
    setLocalDesign(design);
  }, [design]);

  // Update design in context
  const setDesign = useCallback(
    (updates: Partial<FinishingsDesignData>) => {
      setLocalDesign((prev) => ({ ...prev, ...updates }));
      updateDesign('finishings', updates);
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

  const handleAccentWallAdd = useCallback(() => {
    const newWall = {
      id: `aw-${Date.now()}`,
      width: '',
      height: '',
      finishType: 'tile' as const,
    };

    // Ensure accentWalls is an array
    const currentWalls = Array.isArray(localDesign.accentWalls)
      ? localDesign.accentWalls
      : [];

    setDesign({
      accentWalls: [...currentWalls, newWall],
    });
  }, [localDesign.accentWalls, setDesign]);

  const handleAccentWallChange = useCallback(
    (id: string, field: string, value: string) => {
      const currentWalls = Array.isArray(localDesign.accentWalls)
        ? localDesign.accentWalls
        : [];

      setDesign({
        accentWalls: currentWalls.map((wall) =>
          wall.id === id ? { ...wall, [field]: value } : wall
        ),
      });
    },
    [localDesign.accentWalls, setDesign]
  );

  const handleAccentWallDelete = useCallback(
    (id: string) => {
      const currentWalls = Array.isArray(localDesign.accentWalls)
        ? localDesign.accentWalls
        : [];

      setDesign({
        accentWalls: currentWalls.filter((wall) => wall.id !== id),
      });
    },
    [localDesign.accentWalls, setDesign]
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

  // Calculate additional areas
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
      <h2 className='text-2xl font-bold text-slate-800'>Finishings</h2>

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
            Enter the bathroom dimensions to calculate materials and labor
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

        {/* Calculated Areas Display */}
        <div className='mt-4 p-3 bg-green-50 rounded-lg border border-green-200'>
          <h4 className='text-sm font-semibold text-green-900 mb-2'>
            Calculated Areas
          </h4>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-green-700 font-medium'>
                Total Floor Area:
              </span>
              <span className='ml-2 text-green-900'>
                {totalSqFt.toFixed(1)} sq/ft
              </span>
            </div>
            <div>
              <span className='text-green-700 font-medium'>Wall Area:</span>
              <span className='ml-2 text-green-900'>
                {wallArea.toFixed(1)} sq/ft
              </span>
            </div>
            <div>
              <span className='text-green-700 font-medium'>Ceiling Area:</span>
              <span className='ml-2 text-green-900'>
                {ceilingArea.toFixed(1)} sq/ft
              </span>
            </div>
            <div>
              <span className='text-green-700 font-medium'>Perimeter:</span>
              <span className='ml-2 text-green-900'>
                {perimeter.toFixed(1)} ft
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Painting Card */}
      <CollapsibleSection title='Painting' colorScheme='design'>
        {/* Non-Paint Wall Area Input */}
        <div className='mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-sm font-medium text-gray-700 mb-1.5 block'>
                Doors
              </Label>
              <Input
                type='number'
                value={localDesign.numDoors}
                onChange={(e) => setDesign({ numDoors: e.target.value })}
                placeholder='1'
                className='w-full p-2.5 bg-white border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
              />
            </div>
            <div>
              <Label className='text-sm font-medium text-gray-700 mb-1.5 block'>
                Non-Paint Area (sq ft)
              </Label>
              <Input
                type='number'
                value={localDesign.nonPaintWallAreaSqFt}
                onChange={(e) =>
                  setDesign({ nonPaintWallAreaSqFt: e.target.value })
                }
                placeholder='0'
                className='w-full p-2.5 bg-white border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
              />
            </div>
          </div>
          <p className='text-xs text-slate-500 mt-2'>
            Non-paint area includes tile backsplash, shower walls, or other
            surfaces not being painted.
          </p>
        </div>

        <ToggleSwitch
          label='Drywall Repairs'
          enabled={localDesign.fixWalls}
          onToggle={(enabled) => setDesign({ fixWalls: enabled })}
          className='pb-3'
        />
        {localDesign.fixWalls && (
          <div className='pl-6 pb-3'>
            <Label className='text-sm text-slate-600 mb-2 block'>
              Repair Level
            </Label>
            <div className='flex space-x-2'>
              {(['LIGHT', 'MEDIUM', 'HEAVY'] as const).map((level) => (
                <Button
                  key={level}
                  onClick={() => setDesign({ drywallRepairsLevel: level })}
                  variant={
                    localDesign.drywallRepairsLevel === level
                      ? 'default'
                      : 'outline'
                  }
                  size='sm'
                  className={
                    localDesign.drywallRepairsLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                  }
                >
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
        )}
        <ToggleSwitch
          label='Priming'
          enabled={localDesign.priming}
          onToggle={(enabled) => setDesign({ priming: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Paint Walls'
          enabled={localDesign.paintWalls}
          onToggle={(enabled) => setDesign({ paintWalls: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Paint Ceiling'
          enabled={localDesign.paintCeiling}
          onToggle={(enabled) => setDesign({ paintCeiling: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Paint Trim'
          enabled={localDesign.paintTrim}
          onToggle={(enabled) => setDesign({ paintTrim: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Paint Door'
          enabled={localDesign.paintDoor}
          onToggle={(enabled) => setDesign({ paintDoor: enabled })}
          className='pb-3'
        />

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
              'Wall condition',
              'Primer coat needed before final color',
              'Moisture or peeling paint detected',
              'Paint baseboard',
            ]}
            clientTags={[
              'Paint color and sheen',
              'Ceiling and trim finish',
              'Accent wall areas selected',
              'Client requested low-VOC paint',
              'Final color approval received',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>

      {/* Installation Card */}
      <CollapsibleSection title='Installation' colorScheme='construction'>
        {/* Plumbing Section */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <Label className='text-sm font-semibold text-slate-600'>
              Plumbing
            </Label>
            <div className='flex space-x-2'>
              <Button
                onClick={() => setDesign({ plumbingPerformedBy: 'me' })}
                variant={
                  localDesign.plumbingPerformedBy === 'me'
                    ? 'default'
                    : 'outline'
                }
                size='sm'
                className={
                  localDesign.plumbingPerformedBy === 'me'
                    ? 'bg-blue-600 text-white'
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }
              >
                Me
              </Button>
              <Button
                onClick={() => setDesign({ plumbingPerformedBy: 'trade' })}
                variant={
                  localDesign.plumbingPerformedBy === 'trade'
                    ? 'default'
                    : 'outline'
                }
                size='sm'
                className={
                  localDesign.plumbingPerformedBy === 'trade'
                    ? 'bg-blue-600 text-white'
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }
              >
                Trade
              </Button>
            </div>
          </div>
          {localDesign.plumbingPerformedBy === 'trade' && (
            <WarningNote variant='warning'>
              <strong>Note:</strong> When &apos;Trade&apos; is selected,
              plumbing labor isn&apos;t included here. Manage it on the
              &apos;Trade&apos; screen.
            </WarningNote>
          )}
          <div className='space-y-4 pl-4'>
            <div className='space-y-2'>
              <ToggleSwitch
                label='Install Vanity'
                enabled={localDesign.installVanity}
                onToggle={(enabled) => setDesign({ installVanity: enabled })}
              />
              {localDesign.installVanity && (
                <div className='pl-6 pt-2'>
                  <Label className='text-sm text-slate-600 mb-2 block'>
                    Number of Sinks
                  </Label>
                  <Input
                    type='number'
                    value={localDesign.vanitySinks.toString()}
                    onChange={(e) =>
                      setDesign({
                        vanitySinks: parseInt(e.target.value) || 1,
                      })
                    }
                    className='w-20 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
                  />
                </div>
              )}
            </div>
            <ToggleSwitch
              label='Install Toilet'
              enabled={localDesign.installToilet}
              onToggle={(enabled) => setDesign({ installToilet: enabled })}
              className='pb-3'
            />
          </div>
        </div>

        {/* Electrical Section */}
        <div className='pt-4 border-t border-slate-200'>
          <div className='flex justify-between items-center mb-4'>
            <Label className='text-sm font-semibold text-slate-600'>
              Electrical
            </Label>
            <div className='flex space-x-2'>
              <Button
                onClick={() => setDesign({ electricalPerformedBy: 'me' })}
                variant={
                  localDesign.electricalPerformedBy === 'me'
                    ? 'default'
                    : 'outline'
                }
                size='sm'
                className={
                  localDesign.electricalPerformedBy === 'me'
                    ? 'bg-blue-600 text-white'
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }
              >
                Me
              </Button>
              <Button
                onClick={() => setDesign({ electricalPerformedBy: 'trade' })}
                variant={
                  localDesign.electricalPerformedBy === 'trade'
                    ? 'default'
                    : 'outline'
                }
                size='sm'
                className={
                  localDesign.electricalPerformedBy === 'trade'
                    ? 'bg-blue-600 text-white'
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }
              >
                Trade
              </Button>
            </div>
          </div>
          {localDesign.electricalPerformedBy === 'trade' && (
            <WarningNote variant='warning'>
              <strong>Note:</strong> When &apos;Trade&apos; is selected,
              electrical labor isn&apos;t included here. Manage it on the
              &apos;Trade&apos; screen.
            </WarningNote>
          )}
          <div className='space-y-4 pl-4'>
            <div className='space-y-2'>
              <ToggleSwitch
                label='Install Lighting'
                enabled={localDesign.installLighting}
                onToggle={(enabled) => setDesign({ installLighting: enabled })}
              />
              {localDesign.installLighting && (
                <div className='pl-6 pt-2 pb-3'>
                  <Label className='text-sm text-slate-600 mb-2 block'>
                    Number of Fixtures
                  </Label>
                  <Input
                    type='number'
                    value={localDesign.lightingQuantity.toString()}
                    onChange={(e) =>
                      setDesign({
                        lightingQuantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className='w-20 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carpentry Section */}
        <div className='pt-4 border-t border-slate-200'>
          <Label className='text-sm font-semibold text-slate-600 mb-4 block'>
            Carpentry & Mounting
          </Label>
          <div className='space-y-4 pl-4'>
            <ToggleSwitch
              label='Install Baseboards'
              enabled={localDesign.installBaseboard}
              onToggle={(enabled) => setDesign({ installBaseboard: enabled })}
            />
            <ToggleSwitch
              label='Install Mirror'
              enabled={localDesign.installMirror}
              onToggle={(enabled) => setDesign({ installMirror: enabled })}
              className='pb-3'
            />
          </div>
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
              'Verify electrical and plumbing rough-ins',
              'Wall blocking',
              'Outlet or switch misalignment',
              'Baseboard or trim needs replacement',
              'Confirm spacing for vanity and toilet clearance',
            ]}
            clientTags={[
              'Fixture and hardware finishes confirmed',
              'Mirror and lighting placement approved',
              'Vanity style and dimensions verified',
              'Toilet model and seat type chosen',
              'Accessories and towel bars confirmed',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>

      {/* Accent Walls Card */}
      <CollapsibleSection title='Accent Walls' colorScheme='design'>
        <div className='space-y-3'>
          {Array.isArray(localDesign.accentWalls) &&
            localDesign.accentWalls.map((wall, index) => (
              <div
                key={wall.id}
                className='p-4 bg-slate-50 rounded-lg border border-slate-200'
              >
                <div className='flex justify-between items-center mb-3'>
                  <p className='font-semibold text-slate-700'>
                    Accent Wall {index + 1}
                  </p>
                  <Button
                    onClick={() => handleAccentWallDelete(wall.id)}
                    variant='ghost'
                    size='sm'
                    className='p-1 text-red-500 hover:text-red-700 h-auto flex-shrink-0'
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label className='text-xs font-medium text-slate-600 mb-1 block'>
                        Wall Width (in)
                      </Label>
                      <Input
                        type='number'
                        value={wall.width}
                        onChange={(e) =>
                          handleAccentWallChange(
                            wall.id,
                            'width',
                            e.target.value
                          )
                        }
                        placeholder='e.g., 96'
                        className='w-full p-2 border border-blue-300 rounded-lg focus:border-blue-500'
                      />
                    </div>
                    <div>
                      <Label className='text-xs font-medium text-slate-600 mb-1 block'>
                        Wall Height (in)
                      </Label>
                      <Input
                        type='number'
                        value={wall.height}
                        onChange={(e) =>
                          handleAccentWallChange(
                            wall.id,
                            'height',
                            e.target.value
                          )
                        }
                        placeholder='e.g., 96'
                        className='w-full p-2 border border-blue-300 rounded-lg focus:border-blue-500'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-xs font-medium text-slate-600'>
                      Finish Type
                    </Label>
                    <div className='flex space-x-2'>
                      {['tile', 'wainscot', 'paint'].map((type) => (
                        <Button
                          key={type}
                          onClick={() =>
                            handleAccentWallChange(wall.id, 'finishType', type)
                          }
                          variant={
                            wall.finishType === type ? 'default' : 'outline'
                          }
                          size='sm'
                          className={
                            wall.finishType === type
                              ? 'bg-blue-600 text-white'
                              : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                          }
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div className='mt-4 flex justify-center'>
            <Button
              onClick={handleAccentWallAdd}
              className='w-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors border border-blue-600'
            >
              <Plus size={16} />
              Add Accent Wall
            </Button>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
