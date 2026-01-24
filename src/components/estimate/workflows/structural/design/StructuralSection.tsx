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
  changeDoorwayOpening: boolean;

  // Floors
  repairSisterFloorJoists: boolean;
  levelFloor: boolean;
  installNewPlywoodSubfloor: boolean;
  plywoodThickness: '1/2' | '5/8' | '3/4';
  replaceRottenSubfloor: boolean;

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
        relocateWallLength: '8',
        relocateWallHeight: '8',
        removeNonLoadBearingWall: false,
        installBlocking: false,
        frameShowerNiche: false,
        addInsulation: false,
        changeDoorwayOpening: false,

        // Floors
        repairSisterFloorJoists: false,
        levelFloor: false,
        installNewPlywoodSubfloor: false,
        plywoodThickness: '3/4' as const,
        replaceRottenSubfloor: false,

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
      <h2 className='text-2xl font-bold text-slate-800'>Structural</h2>

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

        <ToggleSwitch
          label='Change doorway opening (non-load bearing)'
          enabled={localDesign.changeDoorwayOpening}
          onToggle={(enabled) => setDesign({ changeDoorwayOpening: enabled })}
          className='pt-2'
        />

        {/* Design Notes */}
        <div className='mt-4 pt-4 border-t border-gray-200'>
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
              'Verify if wall is load-bearing before removal',
              'Check for plumbing or wiring inside wall',
              'Assess subfloor condition around joists',
              'Confirm framing spacing and alignment',
              'Verify insulation type and vapor barrier need',
            ]}
            clientTags={[
              'Wall modification approved and included in scope',
              'Subfloor repair or replacement discussed with client',
              'New window or door framing included as per plan',
              'Structural reinforcement or insulation added',
              'Framing adjustments reviewed and approved by client',
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
            <p className='text-xs text-slate-500 mt-2 italic'>
              Plywood sheets are calculated automatically from the Floors screen square footage
            </p>
          </div>
        )}

        <ToggleSwitch
          label='Replace rotten subfloor'
          enabled={localDesign.replaceRottenSubfloor}
          onToggle={(enabled) => setDesign({ replaceRottenSubfloor: enabled })}
          className='pt-2'
        />

        {/* Construction Notes */}
        <div className='mt-4 pt-4 border-t border-gray-200'>
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
              'Verify if wall is load-bearing before removal',
              'Check for plumbing or wiring inside wall',
              'Assess subfloor condition around joists',
              'Confirm framing spacing and alignment',
              'Verify insulation type and vapor barrier need',
            ]}
            clientTags={[
              'Wall modification approved and included in scope',
              'Subfloor repair or replacement discussed with client',
              'New window or door framing included as per plan',
              'Structural reinforcement or insulation added',
              'Framing adjustments reviewed and approved by client',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
