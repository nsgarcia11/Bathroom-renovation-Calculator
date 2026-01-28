'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleSwitch } from '@/components/estimate/shared/ToggleSwitch';
import { WorkflowNotesSection } from '@/components/estimate/shared/WorkflowNotesSection';
import { CollapsibleSection } from '@/components/estimate/shared/CollapsibleSection';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';

export interface TradeDesignData {
  // Pricing Modes
  pricingModes: {
    plumbing: 'flat' | 'hourly';
    electrical: 'flat' | 'hourly';
  };

  // Trade Rates (hourly)
  tradeRates: {
    plumbing: number;
    electrical: number;
  };

  // Plumbing - Rough-in
  moveToiletDrainSupply: boolean;
  addVanityPlumbingRoughIn: boolean;
  installNewShowerValve: boolean;
  roughInDiverter: boolean;
  addFreestandingTubRoughIn: boolean;
  relocateFixtureDrain: boolean;
  addBidetPlumbingRoughIn: boolean;

  // Plumbing - Fixture Installation
  vanityInstallationType: 'none' | 'single' | 'double';
  connectSinkDrains: boolean;
  installVanityFaucetSupplyLines: boolean;

  // Shower Trim - Main option (valve_head or valve_head_spout)
  showerTrimOption: 'none' | 'valve_head' | 'valve_head_spout';
  // Shower Trim - Add-ons
  showerTrimHandheld: boolean;
  showerTrimRainhead: boolean;
  // Separate tub spout (disabled when valve_head_spout is selected)
  installTubSpout: boolean;

  installToilet: boolean;
  installBidetSeat: boolean;
  installFreestandingTubFaucet: boolean;

  // Electrical - Rough-in (with quantities)
  heatedFloorThermostatPower: boolean;
  potLightQuantity: number;
  gfciOutletQuantity: number;
  bidetOutletQuantity: number;
  ledMirrorQuantity: number;

  // Electrical - Fixture Installation (with quantities)
  replaceBathroomExhaustFan: boolean;
  exhaustFanControl: boolean;
  vanityWallLightQuantity: number;
  dimmerQuantity: number;
  switchOutletQuantity: number;
  showerPotLightQuantity: number;

  // Override structures
  priceOverrides: Record<string, number>;
  hoursOverrides: Record<string, number>;
  rateOverrides: Record<string, number>;

  // Notes
  plumbingContractorNotes: string;
  plumbingClientNotes: string;
  electricalContractorNotes: string;
  electricalClientNotes: string;

  [key: string]: unknown;
}

// Default flat prices for tasks
export const FLAT_PRICES = {
  // Plumbing Rough-in
  move_toilet_drain: 550,
  rough_in_vanity: 440,
  install_new_shower_valve: 440,
  rough_in_diverter: 275,
  install_standalone_tub_roughin: 660,
  move_drain: 440,
  rough_in_bidet: 330,
  // Plumbing Fixture Installation
  install_vanity_single: 475,
  install_vanity_double: 550,
  install_vanity_plumbing_single: 165,
  install_vanity_plumbing_double: 275,
  install_faucet_single: 165,
  install_faucet_double: 330,
  install_shower_trim_valve_head: 325,
  install_shower_trim_valve_head_spout: 425,
  install_handheld: 85,
  install_rainhead: 85,
  install_tub_spout: 85,
  install_toilet: 165,
  install_bidet: 110,
  install_standalone_tub_finishing: 330,
  // Electrical Rough-in
  elec_heated_floor_stat: 285,
  install_pot_light: 190,
  install_new_gfci: 240,
  elec_bidet_outlet: 190,
  elec_led_mirror_power: 190,
  // Electrical Fixture Installation
  elec_exhaust_fan_rough_in: 145,
  elec_fan_control_upgrade: 95,
  elec_vanity_wall_light: 95,
  install_dimmer: 50,
  replace_switch_outlet_finish: 50,
  replace_pot_light_wet: 95,
};

// Default hours for tasks (hourly mode)
export const DEFAULT_HOURS = {
  // Plumbing Rough-in
  move_toilet_drain: 5,
  rough_in_vanity: 4,
  install_new_shower_valve: 4,
  rough_in_diverter: 2.5,
  install_standalone_tub_roughin: 6,
  move_drain: 4,
  rough_in_bidet: 3,
  // Plumbing Fixture Installation
  install_vanity_single: 3,
  install_vanity_double: 4,
  install_vanity_plumbing_single: 1.5,
  install_vanity_plumbing_double: 2.5,
  install_faucet_single: 1.5,
  install_faucet_double: 3,
  install_shower_trim_valve_head: 2.5,
  install_shower_trim_valve_head_spout: 3.5,
  install_handheld: 0.75,
  install_rainhead: 0.75,
  install_tub_spout: 0.75,
  install_toilet: 1.5,
  install_bidet: 1,
  install_standalone_tub_finishing: 3,
  // Electrical Rough-in
  elec_heated_floor_stat: 3,
  install_pot_light: 2,
  install_new_gfci: 2.5,
  elec_bidet_outlet: 2,
  elec_led_mirror_power: 2,
  // Electrical Fixture Installation
  elec_exhaust_fan_rough_in: 1.5,
  elec_fan_control_upgrade: 1,
  elec_vanity_wall_light: 1,
  install_dimmer: 0.5,
  replace_switch_outlet_finish: 0.5,
  replace_pot_light_wet: 1,
};

export const DEFAULT_TRADE_DESIGN: TradeDesignData = {
  // Pricing Modes - default to flat per spec
  pricingModes: {
    plumbing: 'flat',
    electrical: 'flat',
  },
  // Trade Rates
  tradeRates: {
    plumbing: 110,
    electrical: 95,
  },
  // Plumbing - Rough-in
  moveToiletDrainSupply: false,
  addVanityPlumbingRoughIn: false,
  installNewShowerValve: false,
  roughInDiverter: false,
  addFreestandingTubRoughIn: false,
  relocateFixtureDrain: false,
  addBidetPlumbingRoughIn: false,
  // Plumbing - Fixture Installation
  vanityInstallationType: 'none',
  connectSinkDrains: false,
  installVanityFaucetSupplyLines: false,
  showerTrimOption: 'none',
  showerTrimHandheld: false,
  showerTrimRainhead: false,
  installTubSpout: false,
  installToilet: false,
  installBidetSeat: false,
  installFreestandingTubFaucet: false,
  // Electrical - Rough-in
  heatedFloorThermostatPower: false,
  potLightQuantity: 0,
  gfciOutletQuantity: 0,
  bidetOutletQuantity: 0,
  ledMirrorQuantity: 0,
  // Electrical - Fixture Installation
  replaceBathroomExhaustFan: false,
  exhaustFanControl: false,
  vanityWallLightQuantity: 0,
  dimmerQuantity: 0,
  switchOutletQuantity: 0,
  showerPotLightQuantity: 0,
  // Overrides
  priceOverrides: {},
  hoursOverrides: {},
  rateOverrides: {},
  // Notes
  plumbingContractorNotes: '',
  plumbingClientNotes: '',
  electricalContractorNotes: '',
  electricalClientNotes: '',
};

export function TradeSection() {
  const { getDesignData, updateDesign } = useEstimateWorkflowContext();

  // Tab state for Plumbing and Electrical sections
  const [plumbingTab, setPlumbingTab] = useState<'rough-in' | 'fixture'>('rough-in');
  const [electricalTab, setElectricalTab] = useState<'rough-in' | 'fixture'>('rough-in');

  // Get design data from context
  const designData = getDesignData('trade') as TradeDesignData | null;
  const design = useMemo(
    () => ({
      ...DEFAULT_TRADE_DESIGN,
      ...designData,
      pricingModes: {
        ...DEFAULT_TRADE_DESIGN.pricingModes,
        ...(designData?.pricingModes || {}),
      },
      tradeRates: {
        ...DEFAULT_TRADE_DESIGN.tradeRates,
        ...(designData?.tradeRates || {}),
      },
      priceOverrides: {
        ...DEFAULT_TRADE_DESIGN.priceOverrides,
        ...(designData?.priceOverrides || {}),
      },
      hoursOverrides: {
        ...DEFAULT_TRADE_DESIGN.hoursOverrides,
        ...(designData?.hoursOverrides || {}),
      },
      rateOverrides: {
        ...DEFAULT_TRADE_DESIGN.rateOverrides,
        ...(designData?.rateOverrides || {}),
      },
    }),
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
      // Handle anti-double-charge logic for shower trim
      if (updates.showerTrimOption === 'valve_head_spout') {
        // Disable separate tub spout when valve_head_spout is selected
        updates.installTubSpout = false;
      }

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
    disabled = false,
  }: {
    label: string;
    description: string;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    disabled?: boolean;
  }) => (
    <div className={`flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-slate-200 ${disabled ? 'opacity-50' : ''}`}>
      <div className='flex-1'>
        <div className='font-medium text-slate-800'>{label}</div>
        <div className='text-sm text-slate-500'>{description}</div>
      </div>
      <ToggleSwitch
        label=''
        enabled={enabled}
        onToggle={disabled ? () => {} : onToggle}
      />
    </div>
  );

  // Quantity item with description
  const QuantityItem = ({
    label,
    description,
    quantity,
    onQuantityChange,
  }: {
    label: string;
    description: string;
    quantity: number;
    onQuantityChange: (qty: number) => void;
  }) => (
    <div className='flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-slate-200'>
      <div className='flex-1'>
        <div className='font-medium text-slate-800'>{label}</div>
        <div className='text-sm text-slate-500'>{description}</div>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
          variant='outline'
          size='sm'
          className='h-8 w-8 p-0'
        >
          -
        </Button>
        <Input
          type='number'
          value={quantity.toString()}
          onChange={(e) => onQuantityChange(Math.max(0, parseInt(e.target.value) || 0))}
          className='w-16 text-center h-8'
        />
        <Button
          onClick={() => onQuantityChange(quantity + 1)}
          variant='outline'
          size='sm'
          className='h-8 w-8 p-0'
        >
          +
        </Button>
      </div>
    </div>
  );

  // Pricing mode selector
  const PricingModeSelector = ({
    category,
    mode,
    onModeChange,
  }: {
    category: 'plumbing' | 'electrical';
    mode: 'flat' | 'hourly';
    onModeChange: (mode: 'flat' | 'hourly') => void;
  }) => (
    <div className='flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-lg'>
      <span className='text-sm font-medium text-slate-700'>Pricing Mode:</span>
      <div className='flex gap-1'>
        <Button
          onClick={() => onModeChange('flat')}
          variant={mode === 'flat' ? 'default' : 'outline'}
          size='sm'
          className={mode === 'flat' ? 'bg-blue-600 text-white' : ''}
        >
          Flat Rate
        </Button>
        <Button
          onClick={() => onModeChange('hourly')}
          variant={mode === 'hourly' ? 'default' : 'outline'}
          size='sm'
          className={mode === 'hourly' ? 'bg-blue-600 text-white' : ''}
        >
          Hourly
        </Button>
      </div>
      {mode === 'hourly' && (
        <div className='flex items-center gap-1 ml-2'>
          <span className='text-sm text-slate-600'>Rate:</span>
          <Input
            type='number'
            value={localDesign.tradeRates[category].toString()}
            onChange={(e) =>
              setDesign({
                tradeRates: {
                  ...localDesign.tradeRates,
                  [category]: parseFloat(e.target.value) || 0,
                },
              })
            }
            className='w-20 h-8 text-center'
          />
          <span className='text-sm text-slate-600'>/hr</span>
        </div>
      )}
    </div>
  );

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-slate-800'>Plumbing Electrical</h2>

      {/* Plumbing Section */}
      <CollapsibleSection title='Plumbing' colorScheme='design'>
        {/* Pricing Mode */}
        <PricingModeSelector
          category='plumbing'
          mode={localDesign.pricingModes.plumbing}
          onModeChange={(mode) =>
            setDesign({
              pricingModes: { ...localDesign.pricingModes, plumbing: mode },
            })
          }
        />

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
              label='Rough-in Diverter'
              description='Install diverter valve rough-in for multi-head shower system'
              enabled={localDesign.roughInDiverter}
              onToggle={(enabled) => setDesign({ roughInDiverter: enabled })}
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
              <div className='font-medium text-slate-800 mb-1'>Vanity Installation</div>
              <div className='text-sm text-slate-500 mb-3'>
                Select vanity type - includes cabinet installation
              </div>
              <div className='flex space-x-2'>
                {[
                  { value: 'none', label: 'None' },
                  { value: 'single', label: 'Single ($475)' },
                  { value: 'double', label: 'Double ($550)' },
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

              {/* Vanity plumbing tasks - shown when vanity type is selected */}
              {localDesign.vanityInstallationType !== 'none' && (
                <div className='mt-4 pl-4 border-l-2 border-slate-200 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='font-medium text-slate-800'>Connect Sink Drain(s)</div>
                      <div className='text-sm text-slate-500'>
                        Connect sink drain(s) to existing plumbing
                        {localDesign.vanityInstallationType === 'double' && ' (qty: 2)'}
                      </div>
                    </div>
                    <ToggleSwitch
                      label=''
                      enabled={localDesign.connectSinkDrains}
                      onToggle={(enabled) => setDesign({ connectSinkDrains: enabled })}
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='font-medium text-slate-800'>Install Faucet & Supply Lines</div>
                      <div className='text-sm text-slate-500'>
                        Install faucet and connect hot/cold water lines
                        {localDesign.vanityInstallationType === 'double' && ' (qty: 2)'}
                      </div>
                    </div>
                    <ToggleSwitch
                      label=''
                      enabled={localDesign.installVanityFaucetSupplyLines}
                      onToggle={(enabled) => setDesign({ installVanityFaucetSupplyLines: enabled })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Shower Trim - Main Option Selector */}
            <div className='p-4 bg-white rounded-lg border border-slate-200'>
              <div className='font-medium text-slate-800 mb-1'>Shower Trim Installation</div>
              <div className='text-sm text-slate-500 mb-3'>
                Select trim package for existing shower valve rough-in
              </div>
              <div className='flex flex-col space-y-2'>
                {[
                  { value: 'none', label: 'None', price: '' },
                  { value: 'valve_head', label: 'Valve Trim + Shower Head', price: '$325' },
                  { value: 'valve_head_spout', label: 'Valve Trim + Shower Head + Tub Spout', price: '$425' },
                ].map((option) => (
                  <Button
                    key={option.value}
                    onClick={() =>
                      setDesign({
                        showerTrimOption: option.value as 'none' | 'valve_head' | 'valve_head_spout',
                      })
                    }
                    variant={localDesign.showerTrimOption === option.value ? 'default' : 'outline'}
                    size='sm'
                    className={`justify-between ${
                      localDesign.showerTrimOption === option.value
                        ? 'bg-blue-600 text-white'
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span>{option.label}</span>
                    {option.price && <span className='ml-2 font-semibold'>{option.price}</span>}
                  </Button>
                ))}
              </div>

              {/* Shower Trim Add-ons */}
              {localDesign.showerTrimOption !== 'none' && (
                <div className='mt-4 pl-4 border-l-2 border-slate-200 space-y-2'>
                  <div className='text-sm font-medium text-slate-700 mb-2'>Optional Add-ons:</div>
                  <div className='grid grid-cols-2 gap-2'>
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
                      Handheld (+$85)
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
                      Rainhead (+$85)
                    </Button>
                  </div>
                </div>
              )}

              {/* Separate Tub Spout - disabled when valve_head_spout is selected */}
              {localDesign.showerTrimOption === 'valve_head' && (
                <div className='mt-4 pl-4 border-l-2 border-slate-200'>
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='font-medium text-slate-800'>Install Tub Spout (Separate)</div>
                      <div className='text-sm text-slate-500'>Install tub spout without shower head combo (+$85)</div>
                    </div>
                    <ToggleSwitch
                      label=''
                      enabled={localDesign.installTubSpout}
                      onToggle={(enabled) => setDesign({ installTubSpout: enabled })}
                    />
                  </div>
                </div>
              )}
              {localDesign.showerTrimOption === 'valve_head_spout' && (
                <div className='mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded'>
                  Tub spout is included in the selected package
                </div>
              )}
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
              description={`Set tub, install faucet, and connect water supply and drain${
                localDesign.addFreestandingTubRoughIn
                  ? ' (Bundle discount applied: -$150 flat / -1hr hourly)'
                  : ''
              }`}
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
        {/* Pricing Mode */}
        <PricingModeSelector
          category='electrical'
          mode={localDesign.pricingModes.electrical}
          onModeChange={(mode) =>
            setDesign({
              pricingModes: { ...localDesign.pricingModes, electrical: mode },
            })
          }
        />

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

            <QuantityItem
              label='Add Recessed Pot Light(s)'
              description='Includes wiring, housing/canless install, and final trim'
              quantity={localDesign.potLightQuantity}
              onQuantityChange={(qty) => setDesign({ potLightQuantity: qty })}
            />

            <QuantityItem
              label='Add Vanity GFCI Outlet(s)'
              description='Includes wiring, box installation, and final GFCI device'
              quantity={localDesign.gfciOutletQuantity}
              onQuantityChange={(qty) => setDesign({ gfciOutletQuantity: qty })}
            />

            <QuantityItem
              label='Add Toilet / Bidet Power Outlet(s)'
              description='Install new outlet location (rough-in + final receptacle install)'
              quantity={localDesign.bidetOutletQuantity}
              onQuantityChange={(qty) => setDesign({ bidetOutletQuantity: qty })}
            />

            <QuantityItem
              label='LED Mirror / Medicine Cabinet Power'
              description='Includes power rough-in and final connection for mirror or cabinet'
              quantity={localDesign.ledMirrorQuantity}
              onQuantityChange={(qty) => setDesign({ ledMirrorQuantity: qty })}
            />
          </div>
        )}

        {/* Electrical Fixture Installation */}
        {electricalTab === 'fixture' && (
          <div className='space-y-3'>
            <ToggleItem
              label='Replace Bathroom Exhaust Fan'
              description='Replace existing fan using current wiring and venting'
              enabled={localDesign.replaceBathroomExhaustFan}
              onToggle={(enabled) => setDesign({ replaceBathroomExhaustFan: enabled })}
            />

            <ToggleItem
              label='Exhaust Fan Control (Timer / Humidity Sensor)'
              description='Includes wiring adjustments and final control installation'
              enabled={localDesign.exhaustFanControl}
              onToggle={(enabled) => setDesign({ exhaustFanControl: enabled })}
            />

            <QuantityItem
              label='Vanity / Wall Light Fixture(s)'
              description='Install client-supplied light fixtures at existing wiring'
              quantity={localDesign.vanityWallLightQuantity}
              onQuantityChange={(qty) => setDesign({ vanityWallLightQuantity: qty })}
            />

            <QuantityItem
              label='Replace Light Switch with Dimmer'
              description='Replace existing light switch with dimmer control'
              quantity={localDesign.dimmerQuantity}
              onQuantityChange={(qty) => setDesign({ dimmerQuantity: qty })}
            />

            <QuantityItem
              label='Replace Switch or Outlet (Finish-Only)'
              description='Replace existing switch or outlet at finished walls'
              quantity={localDesign.switchOutletQuantity}
              onQuantityChange={(qty) => setDesign({ switchOutletQuantity: qty })}
            />

            <QuantityItem
              label='Replace Shower Pot Light (Wet-Rated)'
              description='Replace existing shower pot light with wet-rated fixture'
              quantity={localDesign.showerPotLightQuantity}
              onQuantityChange={(qty) => setDesign({ showerPotLightQuantity: qty })}
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
