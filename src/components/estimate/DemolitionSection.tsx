'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronUp, ChevronDown } from 'lucide-react';

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
}

const ToggleSwitch = ({
  label,
  isEnabled,
  onToggle,
}: {
  label: string;
  isEnabled: boolean;
  onToggle: (checked: boolean) => void;
}) => (
  <label className='flex items-center justify-between cursor-pointer p-3 bg-slate-50/50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors'>
    <span className='text-sm font-semibold text-slate-700'>{label}</span>
    <div className='relative'>
      <input
        type='checkbox'
        checked={isEnabled}
        onChange={(e) => onToggle(e.target.checked)}
        className='sr-only peer'
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </div>
  </label>
);

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
}: DemolitionSectionProps) {
  const [isScopeOpen, setIsScopeOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const handleChoiceChange = (
    field: keyof DemolitionChoices,
    value: 'yes' | 'no'
  ) => {
    setDemolitionChoices({
      ...demolitionChoices,
      [field]: value,
    });
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
                setIsDemolitionFlatFee(checked ? 'yes' : 'no');
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
                />
                <ToggleSwitch
                  label='Remove Stand Alone/Drop-in Tub'
                  isEnabled={demolitionChoices.removeTub === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange('removeTub', checked ? 'yes' : 'no')
                  }
                />
                <ToggleSwitch
                  label='Remove Vanity'
                  isEnabled={demolitionChoices.removeVanity === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange('removeVanity', checked ? 'yes' : 'no')
                  }
                />
                <ToggleSwitch
                  label='Remove Toilet'
                  isEnabled={demolitionChoices.removeToilet === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange('removeToilet', checked ? 'yes' : 'no')
                  }
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
                />
                <ToggleSwitch
                  label='Remove Wall (Partial or Full)'
                  isEnabled={demolitionChoices.removeWall === 'yes'}
                  onToggle={(checked) =>
                    handleChoiceChange('removeWall', checked ? 'yes' : 'no')
                  }
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
