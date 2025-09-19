'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { COST_DATA, DEFAULT_TRADE_RATES } from '@/lib/trades-cost-data';

interface DemolitionChoices {
  removeFlooring: 'yes' | 'no';
  removeShowerWall: 'yes' | 'no';
  removeShowerBase: 'yes' | 'no';
  removeTub: 'yes' | 'no';
  removeVanity: 'yes' | 'no';
  removeToilet: 'yes' | 'no';
  removeAccessories: 'yes' | 'no';
  removeWall: 'yes' | 'no';
}

interface LaborItem {
  id: string;
  name: string;
  hours: string;
  rate: string;
  color?: string;
}

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  unit: string;
  color?: string;
}

interface FlatFeeItem {
  id: string;
  name: string;
  price: string;
}

interface DemolitionSectionProps {
  demolitionChoices: DemolitionChoices;
  setDemolitionChoices: (choices: DemolitionChoices) => void;
  debrisDisposal: 'yes' | 'no';
  setDebrisDisposal: (value: 'yes' | 'no') => void;
  isDemolitionFlatFee: 'yes' | 'no';
  setIsDemolitionFlatFee: (value: 'yes' | 'no') => void;
  flatFeeAmount: string;
  setFlatFeeAmount: (value: string) => void;
  flatFeeDescription: string;
  setFlatFeeDescription: (value: string) => void;
  demolitionNotes: string;
  setDemolitionNotes: (value: string) => void;
  laborItems: LaborItem[];
  setLaborItems: (items: LaborItem[]) => void;
  flatFeeItems: FlatFeeItem[];
  setFlatFeeItems: (items: FlatFeeItem[]) => void;
  constructionMaterials: MaterialItem[];
  setConstructionMaterials: (items: MaterialItem[]) => void;
}

const ToggleSwitch = ({
  label,
  isEnabled,
  onToggle,
  disabled = false,
}: {
  label: string;
  isEnabled: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <label
    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
      disabled
        ? 'cursor-not-allowed bg-slate-100/50 border-slate-200 opacity-50'
        : 'cursor-pointer bg-slate-50/50 border-slate-200 hover:bg-slate-100'
    }`}
  >
    <span
      className={`text-sm font-semibold ${
        disabled ? 'text-slate-400' : 'text-slate-700'
      }`}
    >
      {label}
    </span>
    <div className='relative'>
      <input
        type='checkbox'
        checked={isEnabled}
        onChange={(e) => !disabled && onToggle(e.target.checked)}
        disabled={disabled}
        className='sr-only peer'
      />
      <div
        className={`w-11 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
          disabled
            ? 'bg-gray-100 peer-checked:bg-gray-300'
            : 'bg-gray-200 peer-checked:bg-blue-600'
        }`}
      ></div>
    </div>
  </label>
);

// Mapping between demolition choices and cost data keys
const DEMOLITION_TASK_MAPPING: Record<keyof DemolitionChoices, string> = {
  removeFlooring: 'demolish_flooring',
  removeShowerWall: 'demolish_shower_surround',
  removeShowerBase: 'demolish_shower_base',
  removeTub: 'demolish_tub',
  removeVanity: 'demolish_vanity',
  removeToilet: 'demolish_toilet',
  removeAccessories: 'demolish_accessories',
  removeWall: 'demolish_wall',
};

// Demolition materials mapping
const DEMOLITION_MATERIALS = {
  heavyDutyBags: {
    id: 'mat-demo-bags',
    name: 'Heavy-Duty Contractor Bags',
    quantity: '1',
    price: '25.00',
    unit: 'box',
  },
  dustMasks: {
    id: 'mat-demo-masks',
    name: 'Dust Masks',
    quantity: '1',
    price: '20.00',
    unit: 'box',
  },
  debrisDisposal: {
    id: 'mat-demo-disposal',
    name: 'Debris Disposal Fee',
    quantity: '1',
    price: '350.00',
    unit: 'service',
  },
};

export function DemolitionSection({
  demolitionChoices,
  setDemolitionChoices,
  debrisDisposal,
  setDebrisDisposal,
  isDemolitionFlatFee,
  setIsDemolitionFlatFee,
  flatFeeAmount,
  setFlatFeeAmount,
  flatFeeDescription,
  setDemolitionNotes,
  demolitionNotes,
  setFlatFeeDescription,
  laborItems,
  setLaborItems,
  flatFeeItems,
  setFlatFeeItems,
  constructionMaterials,
  setConstructionMaterials,
}: DemolitionSectionProps) {
  const [isScopeOpen, setIsScopeOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const isFlatFeeMode = isDemolitionFlatFee === 'yes';

  // Single effect to handle labor items based on flat fee mode
  useEffect(() => {
    if (isDemolitionFlatFee === 'yes') {
      // Clear all labor items when in flat fee mode
      setLaborItems([]);
    } else {
      // Add labor items based on demolition choices when in hourly mode
      const newLaborItems: LaborItem[] = [];

      Object.entries(demolitionChoices).forEach(([field, value]) => {
        if (value === 'yes') {
          const costKey =
            DEMOLITION_TASK_MAPPING[field as keyof DemolitionChoices];
          const costData = COST_DATA[costKey];

          if (costData?.labor?.[0] && costData.labor[0].hours !== undefined) {
            const laborData = costData.labor[0];
            if (laborData.hours !== undefined) {
              newLaborItems.push({
                id: `lab-${field}-${Date.now()}`,
                name: laborData.name,
                hours: laborData.hours.toString(),
                rate: DEFAULT_TRADE_RATES.demolition.toString(),
              });
            }
          }
        }
      });

      setLaborItems(newLaborItems);
    }
  }, [isDemolitionFlatFee, demolitionChoices, setLaborItems]);

  // Effect to manage demolition materials based on flat-fee and disposal settings
  useEffect(() => {
    const newMaterials: MaterialItem[] = [];
    let updatedMaterials = [...constructionMaterials];

    // Check if any demolition task is selected (for hourly mode)
    const hasAnyDemolitionTask = Object.values(demolitionChoices).some(
      (choice) => choice === 'yes'
    );

    // Handle bags and masks - only add if flat-fee = NO and any demolition task is selected
    if (isDemolitionFlatFee === 'no' && hasAnyDemolitionTask) {
      // Add bags if not already present
      const hasBags = updatedMaterials.some(
        (item) => item.id === DEMOLITION_MATERIALS.heavyDutyBags.id
      );
      if (!hasBags) {
        newMaterials.push(DEMOLITION_MATERIALS.heavyDutyBags);
      }

      // Add masks if not already present
      const hasMasks = updatedMaterials.some(
        (item) => item.id === DEMOLITION_MATERIALS.dustMasks.id
      );
      if (!hasMasks) {
        newMaterials.push(DEMOLITION_MATERIALS.dustMasks);
      }
    } else {
      // Remove bags and masks if conditions are not met
      updatedMaterials = updatedMaterials.filter(
        (item) =>
          item.id !== DEMOLITION_MATERIALS.heavyDutyBags.id &&
          item.id !== DEMOLITION_MATERIALS.dustMasks.id
      );
    }

    // Handle disposal fee - add if disposal = YES, remove if NO
    if (debrisDisposal === 'yes') {
      const hasDisposal = updatedMaterials.some(
        (item) => item.id === DEMOLITION_MATERIALS.debrisDisposal.id
      );
      if (!hasDisposal) {
        newMaterials.push(DEMOLITION_MATERIALS.debrisDisposal);
      }
    } else {
      // Remove disposal fee if disposal = NO
      updatedMaterials = updatedMaterials.filter(
        (item) => item.id !== DEMOLITION_MATERIALS.debrisDisposal.id
      );
    }

    // Update materials if there are changes
    if (
      newMaterials.length > 0 ||
      updatedMaterials.length !== constructionMaterials.length
    ) {
      setConstructionMaterials([...updatedMaterials, ...newMaterials]);
    }
  }, [
    demolitionChoices,
    isDemolitionFlatFee,
    debrisDisposal,
    constructionMaterials,
    setConstructionMaterials,
  ]);

  // Effect to manage flat fee item when flat fee amount changes
  useEffect(() => {
    if (isDemolitionFlatFee === 'yes') {
      // Create or update flat fee item
      const flatFeeItem: FlatFeeItem = {
        id: 'flat-fee-demolition',
        name: flatFeeDescription || 'Demolition & Debris Removal',
        price: flatFeeAmount || '0',
      };

      const existingItem = flatFeeItems.find(
        (item) => item.id === 'flat-fee-demolition'
      );
      if (!existingItem) {
        setFlatFeeItems([...flatFeeItems, flatFeeItem]);
      } else {
        const updatedItems = flatFeeItems.map((item) =>
          item.id === 'flat-fee-demolition' ? flatFeeItem : item
        );
        setFlatFeeItems(updatedItems);
      }
    } else if (isDemolitionFlatFee === 'no') {
      // Remove flat fee item when switching to hourly mode
      const updatedItems = flatFeeItems.filter(
        (item) => item.id !== 'flat-fee-demolition'
      );
      if (updatedItems.length !== flatFeeItems.length) {
        setFlatFeeItems(updatedItems);
      }
    }
  }, [
    isDemolitionFlatFee,
    flatFeeAmount,
    flatFeeDescription,
    flatFeeItems,
    setFlatFeeItems,
  ]);

  const handleChoiceChange = (
    field: keyof DemolitionChoices,
    value: 'yes' | 'no'
  ) => {
    // Don't allow toggling demolition tasks when in flat fee mode
    if (isDemolitionFlatFee === 'yes') {
      return;
    }

    setDemolitionChoices({
      ...demolitionChoices,
      [field]: value,
    });

    // Only manage labor items if not using flat fee
    if (isDemolitionFlatFee === 'no') {
      const costKey = DEMOLITION_TASK_MAPPING[field];
      const costData = COST_DATA[costKey];

      if (value === 'yes' && costData?.labor?.[0]) {
        // Add labor item
        const laborData = costData.labor[0];
        if (laborData.hours !== undefined) {
          const newLaborItem: LaborItem = {
            id: `lab-${field}-${Date.now()}`,
            name: laborData.name,
            hours: laborData.hours.toString(),
            rate: DEFAULT_TRADE_RATES.demolition.toString(),
          };

          setLaborItems([...laborItems, newLaborItem]);
        }
      } else if (value === 'no') {
        // Remove labor item for this task
        setLaborItems(
          laborItems.filter((item) => !item.id.startsWith(`lab-${field}-`))
        );
      }
    }
  };

  // Handle flat fee toggle changes
  const handleFlatFeeToggle = (checked: boolean) => {
    setIsDemolitionFlatFee(checked ? 'yes' : 'no');
    // The useEffect will handle creating/removing the appropriate labor items
  };

  const noteChips = [
    '+ Mold/Asbestos',
    '+ Moving plumbing/electrical',
    '+ Load-Bearing Wall',
    '+ Pre-Demo Photos',
    '+ Protect Finishes',
  ];

  const handleChipClick = (chipText: string) => {
    const textToAdd = chipText.substring(2); // Remove "+ "
    const noteText = `- ${textToAdd}: `;

    // Check if this note already exists
    if (demolitionNotes && demolitionNotes.includes(noteText)) {
      return; // Don't add if already exists
    }

    const newNotes = demolitionNotes
      ? `${demolitionNotes}\n${noteText}`
      : noteText;
    setDemolitionNotes(newNotes);
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-slate-800'>Demolition</h2>

      <section className='space-y-4'>
        <Card>
          <CardContent className='p-4 space-y-3'>
            <ToggleSwitch
              label='Charge Flat Fee for Demolition?'
              isEnabled={isDemolitionFlatFee === 'yes'}
              onToggle={(checked) => {
                handleFlatFeeToggle(checked);
                // Reset flat fee data when switching off
                if (!checked) {
                  setFlatFeeAmount('');
                  setFlatFeeDescription('Demolition & Debris Removal');
                }
              }}
            />
            <ToggleSwitch
              label='Dispose of all demolition debris?'
              isEnabled={debrisDisposal === 'yes'}
              onToggle={(checked) => setDebrisDisposal(checked ? 'yes' : 'no')}
            />
            {isDemolitionFlatFee === 'yes' && (
              <div className='space-y-3 pt-3 border-t border-slate-200'>
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                    Flat Fee Amount ($)
                  </label>
                  <Input
                    type='number'
                    value={flatFeeAmount}
                    onChange={(e) => setFlatFeeAmount(e.target.value)}
                    placeholder='e.g., 1500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                    What&apos;s included in the flat fee?
                  </label>
                  <Textarea
                    id='flat-fee-description'
                    label='Flat Fee Description'
                    value={flatFeeDescription}
                    onChange={(e) => setFlatFeeDescription(e.target.value)}
                    placeholder='e.g., Removal of all bathroom fixtures, flooring, and debris...'
                    rows={3}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {isDemolitionFlatFee === 'no' && (
          <Card>
            <div
              className='cursor-pointer'
              onClick={() => setIsScopeOpen(!isScopeOpen)}
            >
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>Demolition Scope</CardTitle>
                  {isScopeOpen ? (
                    <ChevronUp size={20} className='text-blue-600' />
                  ) : (
                    <ChevronDown size={20} className='text-gray-400' />
                  )}
                </div>
              </CardHeader>
            </div>
            {isScopeOpen && (
              <CardContent className='space-y-3 pt-2 border-t border-slate-200'>
                <ToggleSwitch
                  label='Remove Flooring'
                  isEnabled={demolitionChoices.removeFlooring === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange('removeFlooring', checked ? 'yes' : 'no')
                  }
                  disabled={isFlatFeeMode}
                />
                <ToggleSwitch
                  label='Remove Shower Wall'
                  isEnabled={demolitionChoices.removeShowerWall === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange(
                      'removeShowerWall',
                      checked ? 'yes' : 'no'
                    )
                  }
                  disabled={isFlatFeeMode}
                />
                <ToggleSwitch
                  label='Remove Shower Base'
                  isEnabled={demolitionChoices.removeShowerBase === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange(
                      'removeShowerBase',
                      checked ? 'yes' : 'no'
                    )
                  }
                  disabled={isFlatFeeMode}
                />
                <ToggleSwitch
                  label='Remove Stand Alone/Drop-in Tub'
                  isEnabled={demolitionChoices.removeTub === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange('removeTub', checked ? 'yes' : 'no')
                  }
                  disabled={isFlatFeeMode}
                />
                <ToggleSwitch
                  label='Remove Vanity'
                  isEnabled={demolitionChoices.removeVanity === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange('removeVanity', checked ? 'yes' : 'no')
                  }
                  disabled={isFlatFeeMode}
                />
                <ToggleSwitch
                  label='Remove Toilet'
                  isEnabled={demolitionChoices.removeToilet === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange('removeToilet', checked ? 'yes' : 'no')
                  }
                  disabled={isFlatFeeMode}
                />
                <ToggleSwitch
                  label='Remove Accessories (mirror, towel bars, etc.)'
                  isEnabled={demolitionChoices.removeAccessories === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange(
                      'removeAccessories',
                      checked ? 'yes' : 'no'
                    )
                  }
                  disabled={isFlatFeeMode}
                />
                <ToggleSwitch
                  label='Remove Wall (Partial or Full)'
                  isEnabled={demolitionChoices.removeWall === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange('removeWall', checked ? 'yes' : 'no')
                  }
                  disabled={isFlatFeeMode}
                />
              </CardContent>
            )}
          </Card>
        )}

        <Card>
          <div
            className='cursor-pointer'
            onClick={() => setIsNotesOpen(!isNotesOpen)}
          >
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg'>Notes</CardTitle>
                {isNotesOpen ? (
                  <ChevronUp size={20} className='text-blue-600' />
                ) : (
                  <ChevronDown size={20} className='text-gray-400' />
                )}
              </div>
            </CardHeader>
          </div>
          {isNotesOpen && (
            <CardContent className='space-y-3 pt-2 border-t border-slate-200'>
              <Textarea
                id='demolition-notes'
                label='Demolition Notes'
                value={demolitionNotes}
                onChange={(e) => setDemolitionNotes(e.target.value)}
                placeholder='e.g., heavy mortar, mold, vent under floor'
                rows={4}
              />
              <div className='flex flex-wrap -m-1'>
                {noteChips.map((chip) => {
                  const textToAdd = chip.substring(2); // Remove "+ "
                  const noteText = `- ${textToAdd}: `;
                  const isAlreadyAdded = demolitionNotes.includes(noteText);

                  return (
                    <Button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      variant='outline'
                      size='sm'
                      disabled={isAlreadyAdded}
                      className={`m-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        isAlreadyAdded
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200'
                      }`}
                    >
                      {chip}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      </section>
    </div>
  );
}
