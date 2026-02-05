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
  moveToiletDrainSupplyQuantity: number;
  relocateFixtureDrain: boolean;
  relocateFixtureDrainQuantity: number;
  installNewShowerValve: boolean;
  roughInDiverter: boolean;
  addVanityPlumbingRoughIn: boolean;
  addVanityPlumbingRoughInQuantity: number;
  addFreestandingTubRoughIn: boolean;
  addBidetPlumbingRoughIn: boolean;
  addBidetPlumbingRoughInQuantity: number;

  // Plumbing - Fixture Installation
  vanityInstallationType: 'none' | 'single' | 'double';
  connectSinkDrains: boolean;
  connectSinkDrainsQuantity: number;
  installVanityFaucetSupplyLines: boolean;
  installVanityFaucetSupplyLinesQuantity: number;

  // Shower Trim Components (individual selections)
  showerTrimValve: boolean;
  showerTrimShowerHead: boolean;
  showerTrimHandheld: boolean;
  showerTrimRainhead: boolean;
  showerTrimSpout: boolean;

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
  move_toilet_drain: 1000,
  move_drain: 590,
  install_new_shower_valve: 550,
  rough_in_diverter: 390,
  rough_in_vanity: 560,
  install_standalone_tub_roughin: 550,
  rough_in_bidet: 215,
  // Plumbing Fixture Installation
  install_vanity_single: 475,
  install_vanity_double: 550,
  install_vanity_plumbing: 95,
  install_faucet: 140,
  install_shower_trim: 325,
  install_shower_trim_with_spout: 425,
  install_handheld: 175,
  install_rainhead: 275,
  install_tub_spout: 150,
  install_toilet: 250,
  install_bidet: 200,
  install_standalone_tub_finishing: 650,
  // Electrical Rough-in
  elec_heated_floor_stat: 425,
  install_pot_light: 130,
  install_new_gfci: 175,
  elec_bidet_outlet: 165,
  elec_led_mirror_power: 155,
  // Electrical Fixture Installation
  elec_exhaust_fan_rough_in: 350,
  elec_fan_control_upgrade: 120,
  elec_vanity_wall_light: 160,
  install_dimmer: 110,
  replace_switch_outlet_finish: 75,
  replace_pot_light_wet: 120,
};

// Default hours for tasks (hourly mode)
export const DEFAULT_HOURS = {
  // Plumbing Rough-in
  move_toilet_drain: 5,
  move_drain: 3.5,
  install_new_shower_valve: 3,
  rough_in_diverter: 2.25,
  rough_in_vanity: 2.25,
  install_standalone_tub_roughin: 4,
  rough_in_bidet: 1,
  // Plumbing Fixture Installation
  install_vanity_single: 3,
  install_vanity_double: 3,
  install_vanity_plumbing: 1,
  install_faucet: 1.25,
  install_shower_trim: 1.25,
  install_shower_trim_with_spout: 1.25,
  install_handheld: 1,
  install_rainhead: 1.5,
  install_tub_spout: 0.5,
  install_toilet: 1.5,
  install_bidet: 1,
  install_standalone_tub_finishing: 4,
  // Electrical Rough-in
  elec_heated_floor_stat: 4,
  install_pot_light: 1,
  install_new_gfci: 1.5,
  elec_bidet_outlet: 1.5,
  elec_led_mirror_power: 1.5,
  // Electrical Fixture Installation
  elec_exhaust_fan_rough_in: 3,
  elec_fan_control_upgrade: 0.75,
  elec_vanity_wall_light: 1.5,
  install_dimmer: 0.5,
  replace_switch_outlet_finish: 0.75,
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
  moveToiletDrainSupplyQuantity: 1,
  relocateFixtureDrain: false,
  relocateFixtureDrainQuantity: 1,
  installNewShowerValve: false,
  roughInDiverter: false,
  addVanityPlumbingRoughIn: false,
  addVanityPlumbingRoughInQuantity: 1,
  addFreestandingTubRoughIn: false,
  addBidetPlumbingRoughIn: false,
  addBidetPlumbingRoughInQuantity: 1,
  // Plumbing - Fixture Installation
  vanityInstallationType: 'none',
  connectSinkDrains: false,
  connectSinkDrainsQuantity: 1,
  installVanityFaucetSupplyLines: false,
  installVanityFaucetSupplyLinesQuantity: 1,
  showerTrimValve: false,
  showerTrimShowerHead: false,
  showerTrimHandheld: false,
  showerTrimRainhead: false,
  showerTrimSpout: false,
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

  // Toggle item with quantity
  const ToggleQuantityItem = ({
    label,
    description,
    enabled,
    onToggle,
    quantity,
    onQuantityChange,
  }: {
    label: string;
    description: string;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    quantity: number;
    onQuantityChange: (qty: number) => void;
  }) => (
    <div className='py-3 px-4 bg-white rounded-lg border border-slate-200'>
      <div className='flex items-center justify-between'>
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
      {enabled && (
        <div className='flex items-center justify-between mt-3 pt-3 border-t border-slate-100'>
          <span className='text-sm font-medium text-slate-700'>Quantity</span>
          <div className='flex items-center gap-2'>
            <Button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              variant='outline'
              size='sm'
              className='h-8 w-8 p-0'
            >
              -
            </Button>
            <Input
              type='number'
              value={quantity.toString()}
              onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
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
      )}
    </div>
  );

  // Rate input component with local state to prevent input issues
  const RateInput = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (rate: number) => void;
  }) => {
    const [localValue, setLocalValue] = useState(value.toString());

    // Sync local value when external value changes (e.g., on load)
    useEffect(() => {
      setLocalValue(value.toString());
    }, [value]);

    return (
      <Input
        type='number'
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => {
          const parsed = parseFloat(localValue);
          if (!isNaN(parsed) && parsed > 0) {
            onChange(parsed);
          } else {
            // Reset to previous valid value if invalid
            setLocalValue(value.toString());
          }
        }}
        className='w-20 h-8 text-center'
      />
    );
  };

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
          <RateInput
            value={localDesign.tradeRates[category]}
            onChange={(rate) =>
              setDesign({
                tradeRates: {
                  ...localDesign.tradeRates,
                  [category]: rate,
                },
              })
            }
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
            <ToggleQuantityItem
              label='Move toilet drain and supply'
              description='Relocate toilet drain and water supply to new location'
              enabled={localDesign.moveToiletDrainSupply}
              onToggle={(enabled) => setDesign({ moveToiletDrainSupply: enabled })}
              quantity={localDesign.moveToiletDrainSupplyQuantity}
              onQuantityChange={(qty) => setDesign({ moveToiletDrainSupplyQuantity: qty })}
            />

            <ToggleQuantityItem
              label='Relocate Fixture Drain (Sink / Shower / Tub)'
              description='Relocate existing drain to suit new fixture layout (Sink / Shower / Tub)'
              enabled={localDesign.relocateFixtureDrain}
              onToggle={(enabled) => setDesign({ relocateFixtureDrain: enabled })}
              quantity={localDesign.relocateFixtureDrainQuantity}
              onQuantityChange={(qty) => setDesign({ relocateFixtureDrainQuantity: qty })}
            />

            <ToggleItem
              label='Replace / Install Shower Valve'
              description='Install/replace shower valve rough-in and connect water lines. Client-supplied valve/trim.'
              enabled={localDesign.installNewShowerValve}
              onToggle={(enabled) => setDesign({ installNewShowerValve: enabled })}
            />

            <ToggleItem
              label='Add Shower Diverter (Handheld / Rainhead)'
              description='Rough-in diverter valve for handheld/rainhead upgrades and connect outlet lines. Client-supplied diverter/trim.'
              enabled={localDesign.roughInDiverter}
              onToggle={(enabled) => setDesign({ roughInDiverter: enabled })}
            />

            <ToggleQuantityItem
              label='Add Vanity Plumbing Rough-In'
              description='Add water supply and drain rough-in for new vanity location'
              enabled={localDesign.addVanityPlumbingRoughIn}
              onToggle={(enabled) => setDesign({ addVanityPlumbingRoughIn: enabled })}
              quantity={localDesign.addVanityPlumbingRoughInQuantity}
              onQuantityChange={(qty) => setDesign({ addVanityPlumbingRoughInQuantity: qty })}
            />

            <ToggleItem
              label='Add Freestanding Tub Rough-In'
              description='Add drain and water supply rough-in for freestanding tub'
              enabled={localDesign.addFreestandingTubRoughIn}
              onToggle={(enabled) => setDesign({ addFreestandingTubRoughIn: enabled })}
            />

            <ToggleQuantityItem
              label='Add Bidet Plumbing Rough-In'
              description='Add water supply rough-in for bidet or bidet seat'
              enabled={localDesign.addBidetPlumbingRoughIn}
              onToggle={(enabled) => setDesign({ addBidetPlumbingRoughIn: enabled })}
              quantity={localDesign.addBidetPlumbingRoughInQuantity}
              onQuantityChange={(qty) => setDesign({ addBidetPlumbingRoughInQuantity: qty })}
            />
          </div>
        )}

        {/* Plumbing Fixture Installation */}
        {plumbingTab === 'fixture' && (
          <div className='space-y-4'>
            {/* Vanity Cabinet Installation */}
            <div className='p-4 bg-white rounded-lg border border-slate-200'>
              <div className='font-medium text-slate-800 mb-3'>Vanity Cabinet Installation (Finishing)</div>
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
            </div>

            {/* Connect Sink Drain(s) - standalone with quantity */}
            <ToggleQuantityItem
              label='Connect Sink Drain(s)'
              description='Connect sink drain(s) to existing plumbing'
              enabled={localDesign.connectSinkDrains}
              onToggle={(enabled) => setDesign({ connectSinkDrains: enabled })}
              quantity={localDesign.connectSinkDrainsQuantity}
              onQuantityChange={(qty) => setDesign({ connectSinkDrainsQuantity: qty })}
            />

            {/* Install Vanity Faucet & Supply Lines - standalone with quantity */}
            <ToggleQuantityItem
              label='Install Vanity Faucet & Supply Lines'
              description='Install faucet and connect hot/cold water lines'
              enabled={localDesign.installVanityFaucetSupplyLines}
              onToggle={(enabled) => setDesign({ installVanityFaucetSupplyLines: enabled })}
              quantity={localDesign.installVanityFaucetSupplyLinesQuantity}
              onQuantityChange={(qty) => setDesign({ installVanityFaucetSupplyLinesQuantity: qty })}
            />

            {/* Shower Trim Components */}
            <div className='p-4 bg-white rounded-lg border border-slate-200'>
              <div className='font-medium text-slate-800 mb-1'>Shower Trim Components</div>
              <div className='text-sm text-slate-500 mb-3'>
                Install trim components on existing shower valve rough-in
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  onClick={() => setDesign({ showerTrimValve: !localDesign.showerTrimValve })}
                  variant={localDesign.showerTrimValve ? 'default' : 'outline'}
                  size='sm'
                  className={
                    localDesign.showerTrimValve
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
              label='Finish-only: Freestanding Tub + Faucet Connections'
              description='Finish-only after rough-in: set tub, connect drain & water lines, install faucet trim.'
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

            <ToggleQuantityItem
              label='Add Recessed Pot Light(s)'
              description='Includes wiring, housing/canless install, and final trim.'
              enabled={localDesign.potLightQuantity > 0}
              onToggle={(enabled) => setDesign({ potLightQuantity: enabled ? 1 : 0 })}
              quantity={localDesign.potLightQuantity || 1}
              onQuantityChange={(qty) => setDesign({ potLightQuantity: qty })}
            />

            <ToggleQuantityItem
              label='Add Vanity GFCI Outlet(s)'
              description='Includes wiring, box installation, and final GFCI device'
              enabled={localDesign.gfciOutletQuantity > 0}
              onToggle={(enabled) => setDesign({ gfciOutletQuantity: enabled ? 1 : 0 })}
              quantity={localDesign.gfciOutletQuantity || 1}
              onQuantityChange={(qty) => setDesign({ gfciOutletQuantity: qty })}
            />

            <ToggleQuantityItem
              label='Add Toilet / Bidet Power Outlet'
              description='Install one new outlet location (rough-in + final receptacle install).'
              enabled={localDesign.bidetOutletQuantity > 0}
              onToggle={(enabled) => setDesign({ bidetOutletQuantity: enabled ? 1 : 0 })}
              quantity={localDesign.bidetOutletQuantity || 1}
              onQuantityChange={(qty) => setDesign({ bidetOutletQuantity: qty })}
            />

            <ToggleQuantityItem
              label='LED Mirror / Medicine Cabinet Power'
              description='Includes power rough-in and final connection for mirror or cabinet.'
              enabled={localDesign.ledMirrorQuantity > 0}
              onToggle={(enabled) => setDesign({ ledMirrorQuantity: enabled ? 1 : 0 })}
              quantity={localDesign.ledMirrorQuantity || 1}
              onQuantityChange={(qty) => setDesign({ ledMirrorQuantity: qty })}
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

            <ToggleQuantityItem
              label='Vanity / Wall Light Fixture(s) (finish-only)'
              description='Install client-supplied light fixtures at existing wiring.'
              enabled={localDesign.vanityWallLightQuantity > 0}
              onToggle={(enabled) => setDesign({ vanityWallLightQuantity: enabled ? 1 : 0 })}
              quantity={localDesign.vanityWallLightQuantity || 1}
              onQuantityChange={(qty) => setDesign({ vanityWallLightQuantity: qty })}
            />

            <ToggleQuantityItem
              label='Replace Light Switch with Dimmer (finish-only)'
              description='Replace existing light switch with dimmer control.'
              enabled={localDesign.dimmerQuantity > 0}
              onToggle={(enabled) => setDesign({ dimmerQuantity: enabled ? 1 : 0 })}
              quantity={localDesign.dimmerQuantity || 1}
              onQuantityChange={(qty) => setDesign({ dimmerQuantity: qty })}
            />

            <ToggleQuantityItem
              label='Replace Switch or Outlet (Finish-Only)'
              description='Replace existing switch or outlet at finished walls.'
              enabled={localDesign.switchOutletQuantity > 0}
              onToggle={(enabled) => setDesign({ switchOutletQuantity: enabled ? 1 : 0 })}
              quantity={localDesign.switchOutletQuantity || 1}
              onQuantityChange={(qty) => setDesign({ switchOutletQuantity: qty })}
            />

            <ToggleQuantityItem
              label='Replace Shower Pot Light (Wet-Rated) (finish-only)'
              description='Replace existing shower pot light with wet-rated fixture.'
              enabled={localDesign.showerPotLightQuantity > 0}
              onToggle={(enabled) => setDesign({ showerPotLightQuantity: enabled ? 1 : 0 })}
              quantity={localDesign.showerPotLightQuantity || 1}
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
