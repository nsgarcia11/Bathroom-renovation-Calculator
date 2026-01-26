'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleSwitch } from '@/components/estimate/shared/ToggleSwitch';
import { WorkflowNotesSection } from '@/components/estimate/shared/WorkflowNotesSection';
import { CollapsibleSection } from '@/components/estimate/shared/CollapsibleSection';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';

interface TradeDesignData {
  // Plumbing - Rough-in
  moveToiletDrainSupply: boolean;
  addVanityPlumbingRoughIn: boolean;
  installNewShowerValve: boolean;
  addFreestandingTubRoughIn: boolean;
  relocateFixtureDrain: boolean;
  addBidetPlumbingRoughIn: boolean;

  // Plumbing - Fixture Installation
  vanityInstallationType: 'none' | 'single' | 'double';
  connectSinkDrains: boolean;
  installVanityFaucetSupplyLines: boolean;
  showerTrimValveTrim: boolean;
  showerTrimShowerHead: boolean;
  showerTrimHandheld: boolean;
  showerTrimRainhead: boolean;
  showerTrimSpout: boolean;
  installToilet: boolean;
  installBidetSeat: boolean;
  installFreestandingTubFaucet: boolean;

  // Electrical - Rough-in
  heatedFloorThermostatPower: boolean;
  addRecessedPotLights: boolean;
  addVanityGFCIOutlets: boolean;
  addToiletBidetPowerOutlet: boolean;
  ledMirrorCabinetPower: boolean;

  // Electrical - Fixture Installation
  replaceBathroomExhaustFan: boolean;
  exhaustFanControl: boolean;
  vanityWallLightFixtures: boolean;
  replaceLightSwitchDimmer: boolean;
  replaceSwitchOrOutlet: boolean;
  replaceShowerPotLight: boolean;

  // Notes
  plumbingContractorNotes: string;
  plumbingClientNotes: string;
  electricalContractorNotes: string;
  electricalClientNotes: string;

  [key: string]: unknown;
}

export function TradeSection() {
  const { getDesignData, updateDesign } = useEstimateWorkflowContext();

  // Tab state for Plumbing and Electrical sections
  const [plumbingTab, setPlumbingTab] = useState<'rough-in' | 'fixture'>('rough-in');
  const [electricalTab, setElectricalTab] = useState<'rough-in' | 'fixture'>('rough-in');

  // Get design data from context
  const designData = getDesignData('trade') as TradeDesignData | null;
  const design = useMemo(
    () =>
      designData || {
        // Plumbing - Rough-in
        moveToiletDrainSupply: false,
        addVanityPlumbingRoughIn: false,
        installNewShowerValve: false,
        addFreestandingTubRoughIn: false,
        relocateFixtureDrain: false,
        addBidetPlumbingRoughIn: false,

        // Plumbing - Fixture Installation
        vanityInstallationType: 'none' as const,
        connectSinkDrains: false,
        installVanityFaucetSupplyLines: false,
        showerTrimValveTrim: false,
        showerTrimShowerHead: false,
        showerTrimHandheld: false,
        showerTrimRainhead: false,
        showerTrimSpout: false,
        installToilet: false,
        installBidetSeat: false,
        installFreestandingTubFaucet: false,

        // Electrical - Rough-in
        heatedFloorThermostatPower: false,
        addRecessedPotLights: false,
        addVanityGFCIOutlets: false,
        addToiletBidetPowerOutlet: false,
        ledMirrorCabinetPower: false,

        // Electrical - Fixture Installation
        replaceBathroomExhaustFan: false,
        exhaustFanControl: false,
        vanityWallLightFixtures: false,
        replaceLightSwitchDimmer: false,
        replaceSwitchOrOutlet: false,
        replaceShowerPotLight: false,

        // Notes
        plumbingContractorNotes: '',
        plumbingClientNotes: '',
        electricalContractorNotes: '',
        electricalClientNotes: '',
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

  // Tab button component
  const TabButton = ({
    label,
    isActive,
    onClick,
  }: {
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <Button
      onClick={onClick}
      variant={isActive ? 'default' : 'outline'}
      size='sm'
      className={
        isActive
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'border-blue-200 text-blue-600 hover:bg-blue-50'
      }
    >
      {label}
    </Button>
  );

  // Toggle item with description
  const ToggleItem = ({
    label,
    description,
    enabled,
    onToggle,
  }: {
    label: string;
    description: string;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
  }) => (
    <div className='flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-slate-200'>
      <div className='flex-1'>
        <div className='font-medium text-slate-800'>{label}</div>
        <div className='text-sm text-slate-500'>{description}</div>
      </div>
      <ToggleSwitch
        label=''
        enabled={enabled}
        onToggle={onToggle}
      />
    </div>
  );

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-slate-800'>Plumbing Electrical</h2>

      {/* Plumbing Section */}
      <CollapsibleSection title='Plumbing' colorScheme='design'>
        {/* Tabs */}
        <div className='flex space-x-2 mb-4'>
          <TabButton
            label='Rough-in'
            isActive={plumbingTab === 'rough-in'}
            onClick={() => setPlumbingTab('rough-in')}
          />
          <TabButton
            label='Fixture Installation'
            isActive={plumbingTab === 'fixture'}
            onClick={() => setPlumbingTab('fixture')}
          />
        </div>

        {/* Plumbing Rough-in */}
        {plumbingTab === 'rough-in' && (
          <div className='space-y-3'>
            <ToggleItem
              label='Move toilet drain and supply'
              description='Relocate toilet drain and water supply to new location'
              enabled={localDesign.moveToiletDrainSupply}
              onToggle={(enabled) => setDesign({ moveToiletDrainSupply: enabled })}
            />

            <ToggleItem
              label='Add Vanity Plumbing Rough-In'
              description='Add water supply and drain rough-in for new vanity location'
              enabled={localDesign.addVanityPlumbingRoughIn}
              onToggle={(enabled) => setDesign({ addVanityPlumbingRoughIn: enabled })}
            />

            <ToggleItem
              label='Install new shower valve'
              description='Install new shower valve body and connect water lines'
              enabled={localDesign.installNewShowerValve}
              onToggle={(enabled) => setDesign({ installNewShowerValve: enabled })}
            />

            <ToggleItem
              label='Add Freestanding Tub Rough-In'
              description='Add drain and water supply rough-in for freestanding tub'
              enabled={localDesign.addFreestandingTubRoughIn}
              onToggle={(enabled) => setDesign({ addFreestandingTubRoughIn: enabled })}
            />

            <ToggleItem
              label='Relocate Fixture Drain (Sink / Shower / Tub)'
              description='Relocate existing drain to suit new fixture layout (Sink / Shower / Tub)'
              enabled={localDesign.relocateFixtureDrain}
              onToggle={(enabled) => setDesign({ relocateFixtureDrain: enabled })}
            />

            <ToggleItem
              label='Add Bidet Plumbing Rough-In'
              description='Add water supply rough-in for bidet or bidet seat'
              enabled={localDesign.addBidetPlumbingRoughIn}
              onToggle={(enabled) => setDesign({ addBidetPlumbingRoughIn: enabled })}
            />
          </div>
        )}

        {/* Plumbing Fixture Installation */}
        {plumbingTab === 'fixture' && (
          <div className='space-y-4'>
            {/* Vanity Installation Type */}
            <div className='p-4 bg-white rounded-lg border border-slate-200'>
              <div className='font-medium text-slate-800 mb-3'>Vanity Installation Type</div>
              <div className='flex space-x-2'>
                {[
                  { value: 'none', label: 'None' },
                  { value: 'single', label: 'Single Sink' },
                  { value: 'double', label: 'Double Vanity' },
                ].map((option) => (
                  <Button
                    key={option.value}
                    onClick={() =>
                      setDesign({
                        vanityInstallationType: option.value as 'none' | 'single' | 'double',
                      })
                    }
                    variant={localDesign.vanityInstallationType === option.value ? 'default' : 'outline'}
                    size='sm'
                    className={
                      localDesign.vanityInstallationType === option.value
                        ? 'bg-blue-600 text-white flex-1'
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50 flex-1'
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {/* Connect Sink Drains - shown when vanity type is selected */}
              {localDesign.vanityInstallationType !== 'none' && (
                <div className='mt-4 pl-4 border-l-2 border-slate-200'>
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='font-medium text-slate-800'>Connect Sink Drain(s)</div>
                      <div className='text-sm text-slate-500'>Connect sink drain(s) to existing plumbing</div>
                    </div>
                    <ToggleSwitch
                      label=''
                      enabled={localDesign.connectSinkDrains}
                      onToggle={(enabled) => setDesign({ connectSinkDrains: enabled })}
                    />
                  </div>
                </div>
              )}
            </div>

            <ToggleItem
              label='Install Vanity Faucet & Supply Lines'
              description='Install faucet and connect hot/cold water lines'
              enabled={localDesign.installVanityFaucetSupplyLines}
              onToggle={(enabled) => setDesign({ installVanityFaucetSupplyLines: enabled })}
            />

            {/* Shower Trim Components */}
            <div className='p-4 bg-white rounded-lg border border-slate-200'>
              <div className='font-medium text-slate-800 mb-1'>Shower Trim Components</div>
              <div className='text-sm text-slate-500 mb-3'>
                Install trim components on existing shower valve rough-in
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  onClick={() => setDesign({ showerTrimValveTrim: !localDesign.showerTrimValveTrim })}
                  variant={localDesign.showerTrimValveTrim ? 'default' : 'outline'}
                  size='sm'
                  className={
                    localDesign.showerTrimValveTrim
                      ? 'bg-blue-600 text-white'
                      : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                  }
                >
                  Valve trim
                </Button>
                <Button
                  onClick={() => setDesign({ showerTrimShowerHead: !localDesign.showerTrimShowerHead })}
                  variant={localDesign.showerTrimShowerHead ? 'default' : 'outline'}
                  size='sm'
                  className={
                    localDesign.showerTrimShowerHead
                      ? 'bg-blue-600 text-white'
                      : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                  }
                >
                  Shower Head
                </Button>
              </div>
              <div className='grid grid-cols-3 gap-2 mt-2'>
                <Button
                  onClick={() => setDesign({ showerTrimHandheld: !localDesign.showerTrimHandheld })}
                  variant={localDesign.showerTrimHandheld ? 'default' : 'outline'}
                  size='sm'
                  className={
                    localDesign.showerTrimHandheld
                      ? 'bg-blue-600 text-white'
                      : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                  }
                >
                  Handheld
                </Button>
                <Button
                  onClick={() => setDesign({ showerTrimRainhead: !localDesign.showerTrimRainhead })}
                  variant={localDesign.showerTrimRainhead ? 'default' : 'outline'}
                  size='sm'
                  className={
                    localDesign.showerTrimRainhead
                      ? 'bg-blue-600 text-white'
                      : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                  }
                >
                  Rainhead
                </Button>
                <Button
                  onClick={() => setDesign({ showerTrimSpout: !localDesign.showerTrimSpout })}
                  variant={localDesign.showerTrimSpout ? 'default' : 'outline'}
                  size='sm'
                  className={
                    localDesign.showerTrimSpout
                      ? 'bg-blue-600 text-white'
                      : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                  }
                >
                  Spout
                </Button>
              </div>
            </div>

            <ToggleItem
              label='Install Toilet'
              description='Set toilet, secure to flange, and connect water supply'
              enabled={localDesign.installToilet}
              onToggle={(enabled) => setDesign({ installToilet: enabled })}
            />

            <ToggleItem
              label='Install Bidet / Bidet Seat'
              description='Install bidet or bidet seat and connect water supply'
              enabled={localDesign.installBidetSeat}
              onToggle={(enabled) => setDesign({ installBidetSeat: enabled })}
            />

            <ToggleItem
              label='Install Freestanding Tub & Faucet'
              description='Set tub, install faucet, and connect water supply and drain'
              enabled={localDesign.installFreestandingTubFaucet}
              onToggle={(enabled) => setDesign({ installFreestandingTubFaucet: enabled })}
            />
          </div>
        )}

        {/* Plumbing Notes */}
        <div className='pt-4 mt-4 border-t border-gray-200'>
          <WorkflowNotesSection
            contractorNotes={localDesign.plumbingContractorNotes || ''}
            clientNotes={localDesign.plumbingClientNotes || ''}
            onContractorNotesChange={(notes) => {
              setDesign({ plumbingContractorNotes: notes });
            }}
            onClientNotesChange={(notes) => {
              setDesign({ plumbingClientNotes: notes });
            }}
            title='Plumbing Notes'
            placeholder='Add plumbing-specific notes here...'
            contractorTags={[
              'Pipes visible and accessible',
              'Old lines corroded or mixed',
              'Drain may need move',
              'Low water pressure',
              'Tight access behind wall',
            ]}
            clientTags={[
              'Fixture models confirmed',
              'Faucet style chosen',
              'Sink location approved',
              'Valve height confirmed',
              'Tub filler selected',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>

      {/* Electrical Section */}
      <CollapsibleSection title='Electrical' colorScheme='construction'>
        {/* Tabs */}
        <div className='flex space-x-2 mb-4'>
          <TabButton
            label='Rough-in'
            isActive={electricalTab === 'rough-in'}
            onClick={() => setElectricalTab('rough-in')}
          />
          <TabButton
            label='Fixture Installation'
            isActive={electricalTab === 'fixture'}
            onClick={() => setElectricalTab('fixture')}
          />
        </div>

        {/* Electrical Rough-in */}
        {electricalTab === 'rough-in' && (
          <div className='space-y-3'>
            <ToggleItem
              label='Heated Floor Thermostat & Power'
              description='Includes power rough-in, sensor placement, and thermostat install'
              enabled={localDesign.heatedFloorThermostatPower}
              onToggle={(enabled) => setDesign({ heatedFloorThermostatPower: enabled })}
            />

            <ToggleItem
              label='Add Recessed Pot Light(s)'
              description='Includes wiring, housing/canless install, and final trim.'
              enabled={localDesign.addRecessedPotLights}
              onToggle={(enabled) => setDesign({ addRecessedPotLights: enabled })}
            />

            <ToggleItem
              label='Add Vanity GFCI Outlet(s)'
              description='Includes wiring, box installation, and final GFCI device'
              enabled={localDesign.addVanityGFCIOutlets}
              onToggle={(enabled) => setDesign({ addVanityGFCIOutlets: enabled })}
            />

            <ToggleItem
              label='Add Toilet / Bidet Power Outlet'
              description='Install one new outlet location (rough-in + final receptacle install).'
              enabled={localDesign.addToiletBidetPowerOutlet}
              onToggle={(enabled) => setDesign({ addToiletBidetPowerOutlet: enabled })}
            />

            <ToggleItem
              label='LED Mirror / Medicine Cabinet Power'
              description='Includes power rough-in and final connection for mirror or cabinet'
              enabled={localDesign.ledMirrorCabinetPower}
              onToggle={(enabled) => setDesign({ ledMirrorCabinetPower: enabled })}
            />
          </div>
        )}

        {/* Electrical Fixture Installation */}
        {electricalTab === 'fixture' && (
          <div className='space-y-3'>
            <ToggleItem
              label='Replace Bathroom Exhaust Fan'
              description='Replace existing fan using current wiring and venting.'
              enabled={localDesign.replaceBathroomExhaustFan}
              onToggle={(enabled) => setDesign({ replaceBathroomExhaustFan: enabled })}
            />

            <ToggleItem
              label='Exhaust Fan Control (Timer / Humidity Sensor)'
              description='Includes wiring adjustments and final control installation'
              enabled={localDesign.exhaustFanControl}
              onToggle={(enabled) => setDesign({ exhaustFanControl: enabled })}
            />

            <ToggleItem
              label='Vanity / Wall Light Fixture(s) (finish-only)'
              description='Install client-supplied light fixtures at existing wiring.'
              enabled={localDesign.vanityWallLightFixtures}
              onToggle={(enabled) => setDesign({ vanityWallLightFixtures: enabled })}
            />

            <ToggleItem
              label='Replace Light Switch with Dimmer (finish-only)'
              description='Replace existing light switch with dimmer control.'
              enabled={localDesign.replaceLightSwitchDimmer}
              onToggle={(enabled) => setDesign({ replaceLightSwitchDimmer: enabled })}
            />

            <ToggleItem
              label='Replace Switch or Outlet (Finish-Only)'
              description='Replace existing switch or outlet at finished walls.'
              enabled={localDesign.replaceSwitchOrOutlet}
              onToggle={(enabled) => setDesign({ replaceSwitchOrOutlet: enabled })}
            />

            <ToggleItem
              label='Replace Shower Pot Light (Wet-Rated) (finish-only)'
              description='Replace existing shower pot light with wet-rated fixture.'
              enabled={localDesign.replaceShowerPotLight}
              onToggle={(enabled) => setDesign({ replaceShowerPotLight: enabled })}
            />
          </div>
        )}

        {/* Electrical Notes */}
        <div className='pt-4 mt-4 border-t border-gray-200'>
          <WorkflowNotesSection
            contractorNotes={localDesign.electricalContractorNotes || ''}
            clientNotes={localDesign.electricalClientNotes || ''}
            onContractorNotesChange={(notes) => {
              setDesign({ electricalContractorNotes: notes });
            }}
            onClientNotesChange={(notes) => {
              setDesign({ electricalClientNotes: notes });
            }}
            title='Electrical Notes'
            placeholder='Add electrical-specific notes here...'
            contractorTags={[
              'Existing wiring condition checked',
              'Breaker capacity may be limited',
              'Access in ceiling confirmed',
              'Switch or outlet locations to verify',
              'Fan vent path needs inspection',
            ]}
            clientTags={[
              'Light fixture style selected',
              'Outlet and switch layout approved',
              'Pot light locations confirmed',
              'Exhaust fan type chosen',
              'Fixture finish and trim color confirmed',
            ]}
            useTabs={true}
            alwaysExpanded={true}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
