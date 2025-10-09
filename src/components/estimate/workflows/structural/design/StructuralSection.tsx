'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleSwitch } from '@/components/estimate/shared/ToggleSwitch';
import { WorkflowNotesSection } from '@/components/estimate/shared/WorkflowNotesSection';
import { CollapsibleSection } from '@/components/estimate/shared/CollapsibleSection';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';

interface StructuralDesignData {
  // Wall Modifications
  frameNewWall: boolean;
  relocateWall: boolean;
  relocateWallLength: string;
  relocateWallHeight: string;
  removeNonLoadBearingWall: boolean;
  installBlocking: boolean;
  frameShowerNiche: boolean;
  addInsulation: boolean;

  // Floors
  repairSisterFloorJoists: boolean;
  levelFloor: boolean;
  installNewPlywoodSubfloor: boolean;
  plywoodThickness: '1/2' | '5/8' | '3/4';
  replaceRottenSubfloor: boolean;

  // Window & Door Openings
  addNewWindow: boolean;
  enlargeExistingWindow: boolean;
  changeDoorwayOpening: boolean;
  closeOffWindow: boolean;

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
        // Wall Modifications
        frameNewWall: false,
        relocateWall: false,
        relocateWallLength: '10',
        relocateWallHeight: '8',
        removeNonLoadBearingWall: false,
        installBlocking: false,
        frameShowerNiche: false,
        addInsulation: false,

        // Floors
        repairSisterFloorJoists: false,
        levelFloor: false,
        installNewPlywoodSubfloor: false,
        plywoodThickness: '3/4' as const,
        replaceRottenSubfloor: false,

        // Window & Door Openings
        addNewWindow: false,
        enlargeExistingWindow: false,
        changeDoorwayOpening: false,
        closeOffWindow: false,

        // Notes
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
  const handleMeasurementChange = useCallback(
    (field: string, value: string) => {
      setDesign({ [field]: value });
    },
    [setDesign]
  );

  return (
    <div className='space-y-6'>
      <div className='pt-2'>
        <h1 className='text-4xl font-bold text-slate-800 text-left'>
          Structural
        </h1>
      </div>

      {/* Wall Modifications Card */}
      <CollapsibleSection title='Wall Modifications' colorScheme='design'>
        <ToggleSwitch
          label='Frame new wall(s)'
          enabled={localDesign.frameNewWall}
          onToggle={(enabled) => setDesign({ frameNewWall: enabled })}
        />

        <ToggleSwitch
          label='Relocate wall'
          enabled={localDesign.relocateWall}
          onToggle={(enabled) => setDesign({ relocateWall: enabled })}
          className='pt-2'
        />
        {localDesign.relocateWall && (
          <div className='pl-6 pt-2 space-y-2'>
            <div className='flex gap-4'>
              <div>
                <Label className='text-sm text-slate-600 mb-2 block'>
                  Length (ft)
                </Label>
                <Input
                  type='number'
                  value={localDesign.relocateWallLength}
                  onChange={(e) =>
                    handleMeasurementChange(
                      'relocateWallLength',
                      e.target.value
                    )
                  }
                  placeholder='10'
                  className='w-20 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
                />
              </div>
              <div>
                <Label className='text-sm text-slate-600 mb-2 block'>
                  Height (ft)
                </Label>
                <Input
                  type='number'
                  value={localDesign.relocateWallHeight}
                  onChange={(e) =>
                    handleMeasurementChange(
                      'relocateWallHeight',
                      e.target.value
                    )
                  }
                  placeholder='8'
                  className='w-20 p-2 text-center border border-blue-300 rounded-lg focus:border-blue-500'
                />
              </div>
            </div>
          </div>
        )}

        <ToggleSwitch
          label='Remove non-load bearing wall'
          enabled={localDesign.removeNonLoadBearingWall}
          onToggle={(enabled) =>
            setDesign({ removeNonLoadBearingWall: enabled })
          }
          className='pt-2'
        />

        <ToggleSwitch
          label='Install blocking for accessories (grab bars, etc.)'
          enabled={localDesign.installBlocking}
          onToggle={(enabled) => setDesign({ installBlocking: enabled })}
          className='pt-2'
        />

        <ToggleSwitch
          label='Frame shower niche'
          enabled={localDesign.frameShowerNiche}
          onToggle={(enabled) => setDesign({ frameShowerNiche: enabled })}
          className='pt-2'
        />

        <ToggleSwitch
          label='Add insulation'
          enabled={localDesign.addInsulation}
          onToggle={(enabled) => setDesign({ addInsulation: enabled })}
          className='pt-2'
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
              'Wall Layout',
              'Load Bearing Considerations',
              'Access Requirements',
              'Structural Requirements',
              'Insulation Specifications',
            ]}
            clientTags={[
              'Room Layout',
              'Accessibility Needs',
              'Future Modifications',
              'Quality Standards',
              'Timeline Requirements',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>

      {/* Floors Card */}
      <CollapsibleSection title='Floors' colorScheme='construction'>
        <ToggleSwitch
          label='Repair / sister floor joists'
          enabled={localDesign.repairSisterFloorJoists}
          onToggle={(enabled) =>
            setDesign({ repairSisterFloorJoists: enabled })
          }
        />

        <ToggleSwitch
          label='Level floor with self-leveling compound'
          enabled={localDesign.levelFloor}
          onToggle={(enabled) => setDesign({ levelFloor: enabled })}
          className='pt-2'
        />

        <ToggleSwitch
          label='Install new plywood subfloor'
          enabled={localDesign.installNewPlywoodSubfloor}
          onToggle={(enabled) =>
            setDesign({ installNewPlywoodSubfloor: enabled })
          }
          className='pt-2'
        />
        {localDesign.installNewPlywoodSubfloor && (
          <div className='pl-6 pt-2'>
            <Label className='text-sm text-slate-600 mb-2 block'>
              Thickness Option
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
                  {thickness}&quot;
                </Button>
              ))}
            </div>
          </div>
        )}

        <ToggleSwitch
          label='Replace rotten subfloor'
          enabled={localDesign.replaceRottenSubfloor}
          onToggle={(enabled) => setDesign({ replaceRottenSubfloor: enabled })}
          className='pt-2'
        />
      </CollapsibleSection>

      {/* Window & Door Openings Card */}
      <CollapsibleSection
        title='Window & Door Openings'
        colorScheme='construction'
      >
        <ToggleSwitch
          label='Add new window'
          enabled={localDesign.addNewWindow}
          onToggle={(enabled) => setDesign({ addNewWindow: enabled })}
        />

        <ToggleSwitch
          label='Enlarging an Existing Window'
          enabled={localDesign.enlargeExistingWindow}
          onToggle={(enabled) => setDesign({ enlargeExistingWindow: enabled })}
          className='pt-2'
        />

        <ToggleSwitch
          label='Changing Doorway'
          enabled={localDesign.changeDoorwayOpening}
          onToggle={(enabled) => setDesign({ changeDoorwayOpening: enabled })}
          className='pt-2'
        />

        <ToggleSwitch
          label='Closing off window'
          enabled={localDesign.closeOffWindow}
          onToggle={(enabled) => setDesign({ closeOffWindow: enabled })}
          className='pt-2'
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
