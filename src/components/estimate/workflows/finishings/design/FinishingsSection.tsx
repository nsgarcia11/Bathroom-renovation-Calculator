'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleSwitch } from '@/components/estimate/shared/ToggleSwitch';
import { WorkflowNotesSection } from '@/components/estimate/shared/WorkflowNotesSection';
import { CollapsibleSection } from '@/components/estimate/shared/CollapsibleSection';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';

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

  // Carpentry options
  installBaseboard: boolean;
  installDoorCasing: boolean;
  installShoeQuarterRound: boolean;
  installDoorHardware: boolean;

  // Accessory options
  installMirror: boolean;
  installTowelBar: boolean;
  towelBarQuantity: number;
  installTPHolder: boolean;
  tpHolderQuantity: number;
  installRobeHook: boolean;
  robeHookQuantity: number;
  installTowelRing: boolean;
  towelRingQuantity: number;
  installShowerRod: boolean;
  showerRodQuantity: number;
  installWallShelf: boolean;
  wallShelfQuantity: number;

  // Trade options
  plumbingPerformedBy: 'me' | 'trade';
  electricalPerformedBy: 'me' | 'trade';

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
        installBaseboard: false,
        installDoorCasing: false,
        installShoeQuarterRound: false,
        installDoorHardware: false,
        installVanity: true,
        vanitySinks: 1,
        installMirror: true,
        installLighting: true,
        lightingQuantity: 2,
        installToilet: true,
        installTowelBar: false,
        towelBarQuantity: 1,
        installTPHolder: false,
        tpHolderQuantity: 1,
        installRobeHook: false,
        robeHookQuantity: 1,
        installTowelRing: false,
        towelRingQuantity: 1,
        installShowerRod: false,
        showerRodQuantity: 1,
        installWallShelf: false,
        wallShelfQuantity: 1,
        plumbingPerformedBy: 'me' as const,
        electricalPerformedBy: 'me' as const,
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
      <CollapsibleSection
        title='Painting'
        subtitle='Sanding, Priming and Painting'
        colorScheme='design'
      >
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

      {/* Carpentry Card */}
      <CollapsibleSection
        title='Carpentry'
        subtitle='Trim & Doors'
        colorScheme='design'
      >
        <ToggleSwitch
          label='Baseboard'
          enabled={localDesign.installBaseboard}
          onToggle={(enabled) => setDesign({ installBaseboard: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Door Casing'
          enabled={localDesign.installDoorCasing}
          onToggle={(enabled) => setDesign({ installDoorCasing: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Shoe & Quarter Round'
          enabled={localDesign.installShoeQuarterRound}
          onToggle={(enabled) => setDesign({ installShoeQuarterRound: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Door Hardware'
          enabled={localDesign.installDoorHardware}
          onToggle={(enabled) => setDesign({ installDoorHardware: enabled })}
          className='pb-3'
        />
      </CollapsibleSection>

      {/* Accessories Card */}
      <CollapsibleSection
        title='Accessories'
        subtitle='Hardware Installation'
        colorScheme='design'
      >
        <ToggleSwitch
          label='Towel Bar'
          enabled={localDesign.installTowelBar}
          onToggle={(enabled) => setDesign({ installTowelBar: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Toilet Paper Holder'
          enabled={localDesign.installTPHolder}
          onToggle={(enabled) => setDesign({ installTPHolder: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Robe Hook'
          enabled={localDesign.installRobeHook}
          onToggle={(enabled) => setDesign({ installRobeHook: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Towel Ring'
          enabled={localDesign.installTowelRing}
          onToggle={(enabled) => setDesign({ installTowelRing: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Shower Rod'
          enabled={localDesign.installShowerRod}
          onToggle={(enabled) => setDesign({ installShowerRod: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Wall Shelf'
          enabled={localDesign.installWallShelf}
          onToggle={(enabled) => setDesign({ installWallShelf: enabled })}
          className='pb-3'
        />
        <ToggleSwitch
          label='Mirror'
          enabled={localDesign.installMirror}
          onToggle={(enabled) => setDesign({ installMirror: enabled })}
          className='pb-3'
        />
      </CollapsibleSection>
    </div>
  );
}
