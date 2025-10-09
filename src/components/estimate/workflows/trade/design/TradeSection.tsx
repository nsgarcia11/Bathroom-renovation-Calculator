'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ToggleSwitch } from '@/components/estimate/shared/ToggleSwitch';
import { WorkflowNotesSection } from '@/components/estimate/shared/WorkflowNotesSection';
import { CollapsibleSection } from '@/components/estimate/shared/CollapsibleSection';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';

interface TradeDesignData {
  // Plumbing - Rough-in
  roughInNewPlumbing: boolean;
  moveToiletDrainSupply: boolean;
  installNewShowerValve: boolean;
  moveDrain: boolean;
  roughInStandaloneTub: boolean;

  // Plumbing - Finishing
  installVanitySinkPlumbing: boolean;
  installVanityFaucetSupply: boolean;
  installShowerTubTrimKit: boolean;
  installNewToilet: boolean;
  installStandaloneTubFaucet: boolean;

  // Electrical - Rough-in
  installNewOutlet: boolean;
  installNewGFCIOutlet: boolean;
  installNewPotLight: boolean;

  // Electrical - Finishing
  installNewLightFixture: boolean;
  installNewExhaustFan: boolean;

  // Notes
  designContractorNotes: string;
  designClientNotes: string;
  constructionContractorNotes: string;
  constructionClientNotes: string;

  [key: string]: unknown;
}

export function TradeSection() {
  const { getDesignData, updateDesign } = useEstimateWorkflowContext();

  // Get design data from context
  const designData = getDesignData('trade') as TradeDesignData | null;
  const design = useMemo(
    () =>
      designData || {
        // Plumbing - Rough-in
        roughInNewPlumbing: false,
        moveToiletDrainSupply: false,
        installNewShowerValve: false,
        moveDrain: false,
        roughInStandaloneTub: false,

        // Plumbing - Finishing
        installVanitySinkPlumbing: false,
        installVanityFaucetSupply: false,
        installShowerTubTrimKit: false,
        installNewToilet: false,
        installStandaloneTubFaucet: false,

        // Electrical - Rough-in
        installNewOutlet: false,
        installNewGFCIOutlet: false,
        installNewPotLight: false,

        // Electrical - Finishing
        installNewLightFixture: false,
        installNewExhaustFan: false,

        // Notes
        designContractorNotes: '',
        designClientNotes: '',
        constructionContractorNotes: '',
        constructionClientNotes: '',
      },
    [designData]
  );

  // Local state for immediate UI updates
  const [localDesign, setLocalDesign] = useState<TradeDesignData>(design);

  // Sync local state with context
  useEffect(() => {
    setLocalDesign(design);
  }, [design]);

  // Update design in context
  const setDesign = useCallback(
    (updates: Partial<TradeDesignData>) => {
      setLocalDesign((prev) => ({ ...prev, ...updates }));
      updateDesign('trade', updates);
    },
    [updateDesign]
  );

  return (
    <div className='space-y-6'>
      <div className='pt-2'>
        <h1 className='text-4xl font-bold text-slate-800 text-left'>Trade</h1>
      </div>

      {/* Plumbing Card */}
      <CollapsibleSection title='Plumbing' colorScheme='design'>
        {/* Rough-in Phase */}
        <div className='mb-6'>
          <div className='flex items-center gap-4 mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Rough-in</h3>
            <div className='flex-1 h-px bg-gray-200'></div>
          </div>

          <div className='space-y-3'>
            <ToggleSwitch
              label='Rough-in new plumbing'
              enabled={localDesign.roughInNewPlumbing}
              onToggle={(enabled) => setDesign({ roughInNewPlumbing: enabled })}
            />

            <ToggleSwitch
              label='Move toilet drain and supply'
              enabled={localDesign.moveToiletDrainSupply}
              onToggle={(enabled) =>
                setDesign({ moveToiletDrainSupply: enabled })
              }
              className='pt-2'
            />

            <ToggleSwitch
              label='Install new shower valve'
              enabled={localDesign.installNewShowerValve}
              onToggle={(enabled) =>
                setDesign({ installNewShowerValve: enabled })
              }
              className='pt-2'
            />

            <ToggleSwitch
              label='Move drain'
              enabled={localDesign.moveDrain}
              onToggle={(enabled) => setDesign({ moveDrain: enabled })}
              className='pt-2'
            />

            <ToggleSwitch
              label='Rough-in for stand-alone tub'
              enabled={localDesign.roughInStandaloneTub}
              onToggle={(enabled) =>
                setDesign({ roughInStandaloneTub: enabled })
              }
              className='pt-2'
            />
          </div>
        </div>

        {/* Finishing Phase */}
        <div className='mb-6'>
          <div className='flex items-center gap-4 mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Finishing</h3>
            <div className='flex-1 h-px bg-gray-200'></div>
          </div>

          <div className='space-y-3'>
            <ToggleSwitch
              label='Install vanity sink plumbing'
              enabled={localDesign.installVanitySinkPlumbing}
              onToggle={(enabled) =>
                setDesign({ installVanitySinkPlumbing: enabled })
              }
            />

            <ToggleSwitch
              label='Install vanity faucet & supply lines'
              enabled={localDesign.installVanityFaucetSupply}
              onToggle={(enabled) =>
                setDesign({ installVanityFaucetSupply: enabled })
              }
              className='pt-2'
            />

            <ToggleSwitch
              label='Install shower & tub trim kit'
              enabled={localDesign.installShowerTubTrimKit}
              onToggle={(enabled) =>
                setDesign({ installShowerTubTrimKit: enabled })
              }
              className='pt-2'
            />

            <ToggleSwitch
              label='Install new toilet'
              enabled={localDesign.installNewToilet}
              onToggle={(enabled) => setDesign({ installNewToilet: enabled })}
              className='pt-2'
            />

            <ToggleSwitch
              label='Install stand-alone tub & faucet'
              enabled={localDesign.installStandaloneTubFaucet}
              onToggle={(enabled) =>
                setDesign({ installStandaloneTubFaucet: enabled })
              }
              className='pt-2'
            />
          </div>
        </div>

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
              'Plumbing Layout',
              'Fixture Specifications',
              'Water Supply Requirements',
              'Drainage Planning',
              'Code Compliance',
            ]}
            clientTags={[
              'Fixture Preferences',
              'Water Pressure Requirements',
              'Accessibility Needs',
              'Quality Standards',
              'Timeline Requirements',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>

      {/* Electrical Card */}
      <CollapsibleSection title='Electrical' colorScheme='construction'>
        {/* Rough-in Phase */}
        <div className='mb-6'>
          <div className='flex items-center gap-4 mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Rough-in</h3>
            <div className='flex-1 h-px bg-gray-200'></div>
          </div>

          <div className='space-y-3'>
            <ToggleSwitch
              label='Install new outlet'
              enabled={localDesign.installNewOutlet}
              onToggle={(enabled) => setDesign({ installNewOutlet: enabled })}
            />

            <ToggleSwitch
              label='Install new GFCI outlet'
              enabled={localDesign.installNewGFCIOutlet}
              onToggle={(enabled) =>
                setDesign({ installNewGFCIOutlet: enabled })
              }
              className='pt-2'
            />

            <ToggleSwitch
              label='Install new pot light'
              enabled={localDesign.installNewPotLight}
              onToggle={(enabled) => setDesign({ installNewPotLight: enabled })}
              className='pt-2'
            />
          </div>
        </div>

        {/* Finishing Phase */}
        <div className='mb-6'>
          <div className='flex items-center gap-4 mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Finishing</h3>
            <div className='flex-1 h-px bg-gray-200'></div>
          </div>

          <div className='space-y-3'>
            <ToggleSwitch
              label='Install new light fixture'
              enabled={localDesign.installNewLightFixture}
              onToggle={(enabled) =>
                setDesign({ installNewLightFixture: enabled })
              }
            />

            <ToggleSwitch
              label='Install new exhaust fan'
              enabled={localDesign.installNewExhaustFan}
              onToggle={(enabled) =>
                setDesign({ installNewExhaustFan: enabled })
              }
              className='pt-2'
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
              'Electrical Code Requirements',
              'Load Calculations',
              'Permit Requirements',
              'Safety Considerations',
              'Wiring Specifications',
            ]}
            clientTags={[
              'Timeline Requirements',
              'Access Constraints',
              'Quality Standards',
              'Warranty Information',
              'Future Modifications',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
