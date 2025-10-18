'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { NotesCard } from '@/components/estimate/shared/NotesCard';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';

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

export function DemolitionSection() {
  const { getDesignData, getNotes, updateDesign, updateNotes } =
    useEstimateWorkflowContext();

  // Get current data from context
  const contextDesign = getDesignData<{
    demolitionChoices: DemolitionChoices;
    debrisDisposal: 'yes' | 'no';
    isDemolitionFlatFee: 'yes' | 'no';
    flatFeeAmount: string;
    flatFeeDescription: string;
  }>('demolition');

  const contextNotes = getNotes('demolition');

  // Use context data directly for UI
  const demolitionChoices = useMemo(
    () =>
      contextDesign?.demolitionChoices || {
        removeFlooring: 'no' as const,
        removeShowerWall: 'no' as const,
        removeShowerBase: 'no' as const,
        removeTub: 'no' as const,
        removeVanity: 'no' as const,
        removeToilet: 'no' as const,
        removeAccessories: 'no' as const,
        removeWall: 'no' as const,
      },
    [contextDesign?.demolitionChoices]
  );
  const debrisDisposal = contextDesign?.debrisDisposal || 'no';
  const isDemolitionFlatFee = contextDesign?.isDemolitionFlatFee || 'no';
  const flatFeeAmount = contextDesign?.flatFeeAmount || '';
  const flatFeeDescription =
    contextDesign?.flatFeeDescription || 'Demolition & Debris Removal';
  const contractorNotes = contextNotes?.contractorNotes || '';
  const clientNotes = contextNotes?.clientNotes || '';

  const [isScopeOpen, setIsScopeOpen] = useState(true);
  const isFlatFeeMode = isDemolitionFlatFee === 'yes';

  const handleChoiceChange = useCallback(
    (field: keyof DemolitionChoices, value: 'yes' | 'no') => {
      const newChoices = {
        ...demolitionChoices,
        [field]: value,
      };

      // Update design choices - labor and materials will be updated by their respective components
      updateDesign('demolition', {
        demolitionChoices: newChoices,
      });
    },
    [isDemolitionFlatFee, demolitionChoices, updateDesign]
  );

  const handleFlatFeeToggle = useCallback(
    (checked: boolean) => {
      updateDesign('demolition', {
        isDemolitionFlatFee: checked ? 'yes' : 'no',
      });

      if (checked) {
        // Switching to flat fee mode - set flat fee item
        // Note: Flat fee items will be managed by the labor component
      } else {
        // Switching to hourly mode - clear flat fee items
        // Note: Labor items will be managed by the labor component
      }
    },
    [updateDesign]
  );

  const handleDebrisDisposalToggle = useCallback(
    (checked: boolean) => {
      updateDesign('demolition', { debrisDisposal: checked ? 'yes' : 'no' });
    },
    [updateDesign]
  );

  const handleFlatFeeAmountChange = useCallback(
    (value: string) => {
      updateDesign('demolition', { flatFeeAmount: value });
    },
    [updateDesign]
  );

  const handleFlatFeeDescriptionChange = useCallback(
    (value: string) => {
      updateDesign('demolition', { flatFeeDescription: value });
    },
    [updateDesign]
  );

  const handleContractorNotesChange = useCallback(
    (notes: string) => {
      updateNotes('demolition', { contractorNotes: notes });
    },
    [updateNotes]
  );

  const handleClientNotesChange = useCallback(
    (notes: string) => {
      updateNotes('demolition', { clientNotes: notes });
    },
    [updateNotes]
  );

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
                  updateDesign('demolition', {
                    flatFeeAmount: '',
                    flatFeeDescription: 'Demolition & Debris Removal',
                  });
                }
              }}
            />
            <ToggleSwitch
              label='Dispose of all demolition debris?'
              isEnabled={debrisDisposal === 'yes'}
              onToggle={handleDebrisDisposalToggle}
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
                    onChange={(e) => handleFlatFeeAmountChange(e.target.value)}
                    placeholder='e.g., 1500'
                    className='border-blue-300 focus:border-blue-500 focus:ring-blue-500'
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
                    onChange={(e) =>
                      handleFlatFeeDescriptionChange(e.target.value)
                    }
                    placeholder='e.g., Removal of all bathroom fixtures, flooring, and debris...'
                    rows={3}
                    className='border-blue-300 focus:border-blue-500 focus:ring-blue-500'
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

        {/* Notes Card */}
        <NotesCard
          contractorNotes={contractorNotes}
          clientNotes={clientNotes}
          onContractorNotesChange={handleContractorNotesChange}
          onClientNotesChange={handleClientNotesChange}
          title='Notes'
          placeholder='Add demolition-specific notes...'
          contractorTags={[
            'Check plumbing/electrical disconnect',
            'Confirm dump/bin access',
            'Verify floor layers/subfloor',
            'Set dust barriers',
            'Note hidden damage/mold',
          ]}
          clientTags={[
            'Removal of old fixtures & debris',
            'Includes dust control & cleanup',
            'Hidden issues may affect cost',
            'Disposal fees included',
            'Area prepped for rebuild',
          ]}
          useTabs={true}
        />
      </section>
    </div>
  );
}
