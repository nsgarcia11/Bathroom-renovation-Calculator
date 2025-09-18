'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleSwitch } from './ToggleSwitch';
import { CollapsibleSection } from './CollapsibleSection';
import { CollapsibleNotesSection } from './CollapsibleNotesSection';
import { AlertTriangle, X } from 'lucide-react';

interface ShowerBaseDesign {
  baseType: string;
  clientSuppliesBase: string;
  baseInstallationBy: string;
  entryType: string;
  drainType: string;
  drainLocation: string;
  notes: string;
}

interface ShowerBaseConstruction {
  tiledBaseSystem: string;
  repairSubfloor: boolean;
  modifyJoists: boolean;
  notes: string;
}

interface ShowerBaseSectionProps {
  design: ShowerBaseDesign;
  setDesign: (
    design: ShowerBaseDesign | ((prev: ShowerBaseDesign) => ShowerBaseDesign)
  ) => void;
  construction: ShowerBaseConstruction;
  setConstruction: (
    construction:
      | ShowerBaseConstruction
      | ((prev: ShowerBaseConstruction) => ShowerBaseConstruction)
  ) => void;
  measurements: {
    width: number;
    length: number;
  };
  setMeasurements: (measurements: { width: number; length: number }) => void;
}

export function ShowerBaseSection({
  design,
  setDesign,
  construction,
  setConstruction,
  measurements,
  setMeasurements,
}: ShowerBaseSectionProps) {
  const [showTiledBaseNote, setShowTiledBaseNote] = useState(true);
  const [showTradeInstallNote, setShowTradeInstallNote] = useState(true);
  const [showClientSuppliesNote, setShowClientSuppliesNote] = useState(true);

  // Calculate square footage
  const sqft = (measurements.width * measurements.length) / 144;

  const updateDesign = (key: keyof ShowerBaseDesign, value: string) => {
    setDesign((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateConstruction = (
    key: keyof ShowerBaseConstruction,
    value: string | boolean
  ) => {
    setConstruction((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateMeasurements = (field: 'width' | 'length', value: string) => {
    const numValue = parseFloat(value) || 0;
    setMeasurements({
      ...measurements,
      [field]: numValue,
    });
  };

  // Show/hide notes based on selections
  useEffect(() => {
    if (design.baseType === 'Tiled Base') {
      setShowTiledBaseNote(true);
    }
  }, [design.baseType]);

  useEffect(() => {
    if (design.baseInstallationBy === 'trade') {
      setShowTradeInstallNote(true);
    }
  }, [design.baseInstallationBy]);

  useEffect(() => {
    if (design.clientSuppliesBase === 'yes') {
      setShowClientSuppliesNote(true);
    }
  }, [design.clientSuppliesBase]);

  return (
    <div className='space-y-4'>
      {/* Measurements Section */}
      <div className='px-4'>
        <CollapsibleSection
          title='Measurements'
          colorScheme='neutral'
          summary={
            <span className='text-blue-900 font-bold text-lg'>
              {sqft.toFixed(2)} sq/ft
            </span>
          }
        >
          <div className='space-y-2'>
            <p className='text-sm text-slate-600 pb-2'>
              Enter the base dimensions to calculate materials and labor.
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <Label className='block text-sm font-medium text-slate-600 mb-1.5'>
                  Width (in)
                </Label>
                <Input
                  type='number'
                  value={measurements.width.toString() || ''}
                  onChange={(e) => updateMeasurements('width', e.target.value)}
                  placeholder='e.g., 32'
                  className='form-input block w-full px-3 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1'
                />
              </div>
              <div>
                <Label className='block text-sm font-medium text-slate-600 mb-1.5'>
                  Length (in)
                </Label>
                <Input
                  type='number'
                  value={measurements.length.toString() || ''}
                  onChange={(e) => updateMeasurements('length', e.target.value)}
                  placeholder='e.g., 60'
                  className='form-input block w-full px-3 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-1'
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* Design Section */}
      <div className='px-4 space-y-4'>
        <CollapsibleSection title='Design' colorScheme='design'>
          <div className='space-y-6'>
            <div>
              <Label className='block text-sm font-medium text-slate-600 mb-1.5'>
                Base Type
              </Label>
              <select
                value={design.baseType}
                onChange={(e) => updateDesign('baseType', e.target.value)}
                className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                aria-label='Base Type'
              >
                <option value=''>Select a Base Type...</option>
                <option value='Tub'>Tub</option>
                <option value='Acrylic Base'>Acrylic Base</option>
                <option value='Tiled Base'>Tiled Base</option>
              </select>
            </div>

            {/* Tiled Base Note */}
            {design.baseType === 'Tiled Base' && showTiledBaseNote && (
              <div className='text-blue-500 text-sm p-3 flex items-start space-x-3 bg-blue-50 rounded-lg border border-blue-200'>
                <AlertTriangle className='w-5 h-5 flex-shrink-0 mt-0.5' />
                <div className='flex-grow'>
                  <span className='font-semibold text-blue-700'>
                    Next Step:
                  </span>{' '}
                  To calculate costs for your tiled base, please open the
                  &apos;Construction&apos; card below and select a waterproofing
                  system.
                </div>
                <button
                  onClick={() => setShowTiledBaseNote(false)}
                  className='text-blue-600 hover:text-blue-800 p-0.5 rounded-full hover:bg-blue-100 flex-shrink-0 -mt-1'
                  title='Close note'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            )}

            {/* Options for Tub or Acrylic Base */}
            {(design.baseType === 'Tub' ||
              design.baseType === 'Acrylic Base') && (
              <div className='space-y-4'>
                <div className='bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm font-medium text-slate-600'>
                      Will the client supply the base?
                    </Label>
                    <div className='flex items-center space-x-2'>
                      {['no', 'yes'].map((option) => (
                        <button
                          key={option}
                          onClick={() =>
                            updateDesign('clientSuppliesBase', option)
                          }
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                            design.clientSuppliesBase === option
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {option === 'no' ? 'No' : 'Yes'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <hr className='border-slate-100' />
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm font-medium text-slate-600'>
                      Installation By:
                    </Label>
                    <div className='flex items-center space-x-2'>
                      {['me', 'trade'].map((option) => (
                        <button
                          key={option}
                          onClick={() =>
                            updateDesign('baseInstallationBy', option)
                          }
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                            design.baseInstallationBy === option
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {option === 'me' ? 'Me' : 'Trade'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Client Supplies Note */}
                {design.clientSuppliesBase === 'yes' &&
                  showClientSuppliesNote && (
                    <div className='text-orange-500 text-xs flex items-start space-x-2'>
                      <AlertTriangle className='w-4 h-4 flex-shrink-0 mt-0.5' />
                      <div className='flex-grow'>
                        <span className='font-semibold'>Note:</span> Base will
                        be removed from the Materials screen.
                      </div>
                      <button
                        onClick={() => setShowClientSuppliesNote(false)}
                        className='text-orange-600 hover:text-orange-800 p-0.5 rounded-full hover:bg-orange-100 flex-shrink-0 -mt-1'
                        title='Close note'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  )}

                {/* Trade Install Note */}
                {design.baseInstallationBy === 'trade' &&
                  showTradeInstallNote && (
                    <div className='text-orange-500 text-xs flex items-start space-x-2'>
                      <AlertTriangle className='w-4 h-4 flex-shrink-0 mt-0.5' />
                      <div className='flex-grow'>
                        <span className='font-semibold'>Note:</span> The cost
                        for installation by a trade professional should be added
                        on the Trades screen.
                      </div>
                      <button
                        onClick={() => setShowTradeInstallNote(false)}
                        className='text-orange-600 hover:text-orange-800 p-0.5 rounded-full hover:bg-orange-100 flex-shrink-0 -mt-1'
                        title='Close note'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  )}
              </div>
            )}

            {/* Options for Tiled Base */}
            {design.baseType === 'Tiled Base' && (
              <div className='space-y-6'>
                <div className='space-y-3 pt-1 bg-slate-50 p-4 rounded-lg border border-slate-200'>
                  <div className='grid grid-cols-3 items-center gap-4'>
                    <Label className='text-sm font-medium text-slate-600 col-span-1'>
                      Entry
                    </Label>
                    <div className='flex items-center space-x-2 justify-end col-span-2'>
                      {['curb', 'curbless'].map((option) => (
                        <button
                          key={option}
                          onClick={() => updateDesign('entryType', option)}
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                            design.entryType === option
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {option === 'curb' ? 'Curb' : 'Curbless'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <hr className='border-slate-100' />
                  <div className='grid grid-cols-3 items-center gap-4'>
                    <Label className='text-sm font-medium text-slate-600 col-span-1'>
                      Drain Type
                    </Label>
                    <div className='flex items-center space-x-2 justify-end col-span-2'>
                      {['regular', 'linear'].map((option) => (
                        <button
                          key={option}
                          onClick={() => updateDesign('drainType', option)}
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                            design.drainType === option
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {option === 'regular' ? 'Regular' : 'Linear'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <hr className='border-slate-100' />
                  <div className='grid grid-cols-3 items-center gap-4'>
                    <Label className='text-sm font-medium text-slate-600 col-span-1'>
                      Drain Location
                    </Label>
                    <div className='flex items-center space-x-2 justify-end col-span-2'>
                      {['left', 'center', 'right'].map((option) => (
                        <button
                          key={option}
                          onClick={() => updateDesign('drainLocation', option)}
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                            design.drainLocation === option
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <CollapsibleNotesSection
              title='Notes'
              value={design.notes}
              onChange={(value: string) => updateDesign('notes', value)}
              placeholder='e.g., Client wants a specific tile...'
              helpers={[
                'Tile Selection',
                'Drain Preference',
                'Accessibility',
                'Custom Features',
              ]}
            />
          </div>
        </CollapsibleSection>

        {/* Construction Section */}
        <CollapsibleSection title='Construction' colorScheme='construction'>
          <div className='space-y-4'>
            {/* Tiled Base Construction Options */}
            {design.baseType === 'Tiled Base' && (
              <div className='space-y-4'>
                <div>
                  <Label className='block text-sm font-medium text-slate-600 mb-1.5'>
                    Waterproofing System
                  </Label>
                  <select
                    value={construction.tiledBaseSystem}
                    onChange={(e) =>
                      updateConstruction('tiledBaseSystem', e.target.value)
                    }
                    className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    aria-label='Waterproofing System'
                  >
                    <option value=''>Select a system...</option>
                    <option value='Schluter'>Schluter</option>
                    <option value='Mortar Bed'>Mortar Bed</option>
                    <option value='Wedi'>Wedi</option>
                    <option value='Laticrete'>Laticrete</option>
                  </select>
                </div>
              </div>
            )}

            <ToggleSwitch
              label='Repair Subfloor'
              enabled={construction.repairSubfloor}
              onToggle={(value) => updateConstruction('repairSubfloor', value)}
              className='bg-slate-50 p-3 rounded-lg'
            />

            <ToggleSwitch
              label='Modify Floor Joists'
              enabled={construction.modifyJoists}
              onToggle={(value) => updateConstruction('modifyJoists', value)}
              className='bg-slate-50 p-3 rounded-lg'
            />

            <CollapsibleNotesSection
              title='Notes'
              value={construction.notes}
              onChange={(value: string) => updateConstruction('notes', value)}
              placeholder='e.g., Subfloor is rotten...'
              helpers={[
                'Subfloor Issues',
                'Joist Modifications',
                'Drainage',
                'Accessibility',
              ]}
            />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
