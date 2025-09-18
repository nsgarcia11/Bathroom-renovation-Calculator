'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { OptionToggle } from './OptionToggle';
import { PillToggleButton } from './PillToggleButton';
import { CollapsibleCard } from './CollapsibleCard';
import { FloorChoices, ExtraMeasurement } from '@/types/floor';

interface FloorSectionProps {
  floorChoices: FloorChoices;
  setFloorChoices: (
    choices: FloorChoices | ((prev: FloorChoices) => FloorChoices)
  ) => void;
  totalSqFt: number;
  clientSuppliesTiles: boolean;
  setClientSuppliesTiles: (value: boolean) => void;
  selectedPrepTasks: string[];
  setSelectedPrepTasks: (
    tasks: string[] | ((prev: string[]) => string[])
  ) => void;
  plywoodThickness: string;
  setPlywoodThickness: (thickness: string) => void;
  isHeatedFloor: boolean;
  setIsHeatedFloor: (value: boolean) => void;
  heatedFloorType: string;
  setHeatedFloorType: (type: string) => void;
  customHeatedFloorName: string;
  setCustomHeatedFloorName: (name: string) => void;
}

export function FloorSection({
  floorChoices,
  setFloorChoices,
  totalSqFt,
  clientSuppliesTiles,
  setClientSuppliesTiles,
  selectedPrepTasks,
  setSelectedPrepTasks,
  plywoodThickness,
  setPlywoodThickness,
  isHeatedFloor,
  setIsHeatedFloor,
  heatedFloorType,
  setHeatedFloorType,
  customHeatedFloorName,
  setCustomHeatedFloorName,
}: FloorSectionProps) {
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const [openSections, setOpenSections] = useState({
    measurements: true,
    design: true,
    heatedFloor: true,
    construction: true,
    designNotes: false,
    constructionNotes: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // --- HANDLERS ---
  const handleDimensionChange = (
    field: keyof FloorChoices['dimensions'],
    value: string
  ) => {
    setFloorChoices((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [field]: value },
    }));
  };

  const handleTileSizeChange = (
    field: keyof FloorChoices['tileSize'],
    value: string
  ) => {
    setFloorChoices((prev) => ({
      ...prev,
      tileSize: { ...prev.tileSize, [field]: value },
    }));
  };

  const handleTileSizeOptionChange = (value: string) => {
    if (value === 'select_option') {
      setFloorChoices((prev) => ({
        ...prev,
        selectedTileSizeOption: 'select_option',
        tileSize: { width: '', length: '' },
      }));
    } else if (value !== 'custom') {
      const [width, length] = value.split('x');
      setFloorChoices((prev) => ({
        ...prev,
        selectedTileSizeOption: value,
        tileSize: { width, length },
      }));
    } else {
      setFloorChoices((prev) => ({
        ...prev,
        selectedTileSizeOption: 'custom',
        tileSize: { width: '', length: '' },
      }));
    }
  };

  const handleInputChange = (field: keyof FloorChoices, value: string) => {
    setFloorChoices((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSide = () => {
    setFloorChoices((prev) => ({
      ...prev,
      extraMeasurements: [
        ...prev.extraMeasurements,
        { id: Date.now(), label: '', width: '', length: '' },
      ],
    }));
  };

  const handleExtraMeasurementChange = (
    id: number,
    field: keyof ExtraMeasurement,
    value: string
  ) => {
    setFloorChoices((prev) => ({
      ...prev,
      extraMeasurements: prev.extraMeasurements.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  };

  const handleDeleteMeasurement = (id: number) => {
    setFloorChoices((prev) => ({
      ...prev,
      extraMeasurements: prev.extraMeasurements.filter((m) => m.id !== id),
    }));
  };

  const handlePrepTaskToggle = (task: string) => {
    setSelectedPrepTasks((prev) =>
      prev.includes(task)
        ? prev.filter((item) => item !== task)
        : [...prev, task]
    );
  };

  const handleNoteHelperClick = (label: string) => {
    const currentNotes = floorChoices.notes;
    const newNote = `${label}: `;
    const updatedNotes = currentNotes ? `${currentNotes}\n${newNote}` : newNote;
    setFloorChoices((prev) => ({ ...prev, notes: updatedNotes }));
    if (notesRef.current) {
      notesRef.current.focus();
    }
  };

  // --- OPTIONS (Memoized for performance) ---
  const {
    tilePatternOptions,
    tileSizeOptions,
    prepAndStructuralOptions,
    plywoodThicknessOptions,
    heatedFloorOptions,
    noteHelpers,
  } = useMemo(
    () => ({
      tilePatternOptions: [
        { value: 'select_option', label: 'Select a Pattern...' },
        { value: 'stacked', label: 'Stacked' },
        { value: '1/2_offset', label: '1/2 Offset' },
        { value: '1/3_offset', label: '1/3 Offset' },
        { value: 'herringbone', label: 'Herringbone' },
        { value: 'other', label: 'Other...' },
      ],
      tileSizeOptions: [
        { value: 'select_option', label: 'Select a Tile Size...' },
        { value: '12x24', label: '12" x 24"' },
        { value: '12x12', label: '12" x 12"' },
        { value: '6x24', label: '6" x 24"' },
        { value: '24x24', label: '24" x 24"' },
        { value: '6x6', label: '6" x 6"' },
        { value: 'custom', label: 'Custom Size...' },
      ],
      prepAndStructuralOptions: [
        { value: 'self_leveling', label: 'Self-Leveling' },
        { value: 'ditra', label: 'Install Ditra Membrane' },
        { value: 'ditra_xl', label: 'Install Ditra XL Membrane' },
        { value: 'add_plywood', label: 'Add Plywood for Subfloor support' },
        { value: 'repair_subfloor', label: 'Repair portion of subfloor' },
        { value: 'repair_joist', label: 'Repair Floor Joist' },
      ],
      plywoodThicknessOptions: [
        { value: '1/2', label: '1/2"' },
        { value: '5/8', label: '5/8"' },
        { value: '3/4', label: '3/4"' },
      ],
      heatedFloorOptions: [
        { value: 'schluter', label: 'Schluter-DITRA-HEAT' },
        { value: 'nuheat', label: 'Nuheat Cable System' },
        { value: 'custom', label: 'Custom...' },
      ],
      noteHelpers: [
        'Tile Direction Horizontal / vertical',
        'Heated Floor',
        'Tile Transition Leveling',
        'Tiled baseboard',
        'grout color',
      ],
    }),
    []
  );

  return (
    <div className='space-y-6'>
      <div className='pt-2'>
        <h1 className='text-4xl font-bold text-slate-800 text-left'>Floor</h1>
      </div>

      <CollapsibleCard
        title='Floor Measurements'
        isOpen={openSections.measurements}
        onToggle={() => toggleSection('measurements')}
        headerContent={
          <div className='flex items-center justify-end w-full'>
            <span className='text-xl font-bold text-blue-600'>
              {totalSqFt.toFixed(2)} sq/ft
            </span>
          </div>
        }
      >
        <div className='flex items-start gap-3 -mt-4 mb-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <p className='text-xs text-slate-500'>
            Enter the main room dimensions to calculate materials and labor
          </p>
        </div>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                Width (in)
              </label>
              <Input
                type='number'
                value={floorChoices.dimensions.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                placeholder='e.g., 60'
                className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                Length (in)
              </label>
              <Input
                type='number'
                value={floorChoices.dimensions.length}
                onChange={(e) =>
                  handleDimensionChange('length', e.target.value)
                }
                placeholder='e.g., 96'
                className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          <div className='pt-4 border-t border-slate-200 space-y-3'>
            <div className='flex justify-end items-center'>
              <Button
                onClick={handleAddSide}
                className='inline-flex items-center justify-center gap-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors'
              >
                <Plus className='w-4 h-4' />
                ADD SIDE
              </Button>
            </div>
            {floorChoices.extraMeasurements.map((m) => (
              <div
                key={m.id}
                className='p-3 bg-slate-50 rounded-lg border border-slate-300 animate-fade-in'
              >
                <div className='flex justify-between items-center mb-2'>
                  <Input
                    type='text'
                    value={m.label}
                    placeholder='e.g., Closet'
                    onChange={(e) =>
                      handleExtraMeasurementChange(
                        m.id,
                        'label',
                        e.target.value
                      )
                    }
                    className='w-full p-1 text-slate-800 font-semibold border-b-2 border-transparent focus:border-blue-500 focus:outline-none bg-transparent'
                  />
                  <Button
                    onClick={() => handleDeleteMeasurement(m.id)}
                    className='p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors'
                    variant='ghost'
                    size='sm'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
                <div className='grid grid-cols-2 gap-2 pt-2'>
                  <Input
                    type='number'
                    value={m.width}
                    onChange={(e) =>
                      handleExtraMeasurementChange(
                        m.id,
                        'width',
                        e.target.value
                      )
                    }
                    placeholder='Width (in)'
                    className='w-full p-2 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
                  />
                  <Input
                    type='number'
                    value={m.length}
                    onChange={(e) =>
                      handleExtraMeasurementChange(
                        m.id,
                        'length',
                        e.target.value
                      )
                    }
                    placeholder='Length (in)'
                    className='w-full p-2 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        title='Design'
        isOpen={openSections.design}
        onToggle={() => toggleSection('design')}
      >
        <div className='space-y-4'>
          <PillToggleButton
            label='Will the client supply the tiles?'
            isSelected={clientSuppliesTiles}
            onToggle={setClientSuppliesTiles}
          />
          {clientSuppliesTiles && (
            <div className='pb-4 border-b border-slate-200'>
              <p className='text-xs text-slate-500 px-1'>
                Client-supplied tiles. Still enter tile size and pattern for
                grout and thinset calculation.
              </p>
            </div>
          )}
          <Dropdown
            label='Tile Size'
            options={tileSizeOptions}
            selectedOption={floorChoices.selectedTileSizeOption}
            onSelect={handleTileSizeOptionChange}
          />
          {floorChoices.selectedTileSizeOption === 'custom' && (
            <div className='grid grid-cols-2 gap-4 pt-2 animate-fade-in'>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                  Tile Width (in)
                </label>
                <Input
                  type='number'
                  value={floorChoices.tileSize.width}
                  onChange={(e) =>
                    handleTileSizeChange('width', e.target.value)
                  }
                  placeholder='e.g., 8'
                  className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                  Tile Length (in)
                </label>
                <Input
                  type='number'
                  value={floorChoices.tileSize.length}
                  onChange={(e) =>
                    handleTileSizeChange('length', e.target.value)
                  }
                  placeholder='e.g., 8'
                  className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
          )}
          <Dropdown
            label='Tile Pattern'
            options={tilePatternOptions}
            selectedOption={floorChoices.tilePattern}
            onSelect={(v) => handleInputChange('tilePattern', v)}
          />
          {floorChoices.tilePattern === 'stacked' && (
            <div className='mt-2 text-red-600 text-xs animate-fade-in'>
              Note: A <strong>10% waste factor</strong> has been applied for
              this pattern and added to the materials list.
            </div>
          )}
          {(floorChoices.tilePattern === '1/2_offset' ||
            floorChoices.tilePattern === '1/3_offset') && (
            <div className='mt-2 text-red-600 text-xs animate-fade-in'>
              Note: A <strong>20% waste factor</strong> has been applied for
              this pattern and added to the materials list.
            </div>
          )}
          {floorChoices.tilePattern === 'herringbone' && (
            <div className='mt-2 text-red-600 text-xs animate-fade-in'>
              Note: A <strong>25% waste factor</strong> has been applied for
              this pattern and added to the materials list.
            </div>
          )}
          {floorChoices.tilePattern === 'other' && (
            <div className='pt-2 animate-fade-in'>
              <Input
                type='text'
                value={floorChoices.customPattern}
                onChange={(e) =>
                  handleInputChange('customPattern', e.target.value)
                }
                placeholder='Specify custom pattern...'
                className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          )}
          <div className='pt-4 border-t border-slate-200'>
            <Button
              onClick={() => toggleSection('designNotes')}
              className='w-full flex justify-between items-center py-2'
              variant='ghost'
            >
              <h3 className='text-lg font-bold text-blue-700'>Notes</h3>
              <svg
                className={`w-5 h-5 text-slate-500 transition-transform ${
                  openSections.designNotes ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </Button>
            {openSections.designNotes && (
              <div className='mt-2 animate-fade-in'>
                <Textarea
                  id='design-notes'
                  label='Design Notes'
                  value={floorChoices.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder='Add design notes...'
                  className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  rows={3}
                />
                <div className='flex flex-wrap gap-2 mt-2'>
                  {noteHelpers.map((helper) => (
                    <Button
                      key={helper}
                      onClick={() => handleNoteHelperClick(helper)}
                      className='rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors'
                      variant='ghost'
                      size='sm'
                    >
                      + {helper}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        title='Heated Floors'
        isOpen={openSections.heatedFloor}
        onToggle={() => toggleSection('heatedFloor')}
      >
        <div className='space-y-4'>
          <OptionToggle
            label='Install Heated Floor System'
            isEnabled={isHeatedFloor}
            onToggle={() => setIsHeatedFloor(!isHeatedFloor)}
          />
          {isHeatedFloor && (
            <div className='pt-3 pl-4 animate-fade-in space-y-4'>
              <p className='text-sm text-amber-800 bg-amber-100 p-3 rounded-lg'>
                <b>Important:</b> Heated floor calculations are derived from the
                dimensions entered in the <b>Floor Measurements</b> card. Please
                ensure these are accurate for the area to be heated.
              </p>
              <Dropdown
                label='System Type'
                options={heatedFloorOptions}
                selectedOption={heatedFloorType}
                onSelect={setHeatedFloorType}
              />
              {heatedFloorType === 'schluter' && (
                <p className='text-xs text-slate-500 px-1'>
                  <b>Note:</b> Costs are estimated based on standard DITRA-HEAT
                  kits. Please verify the final price and labor hours in the
                  Materials & Labor tabs.
                </p>
              )}
              {heatedFloorType === 'nuheat' && (
                <p className='text-xs text-slate-500 px-1'>
                  <b>Note:</b> Costs are estimated based on standard Nuheat
                  kits. Please verify the final price and labor hours in the
                  Materials & Labor tabs.
                </p>
              )}
              {heatedFloorType === 'custom' && (
                <div className='pt-2'>
                  <Input
                    type='text'
                    value={customHeatedFloorName}
                    onChange={(e) => setCustomHeatedFloorName(e.target.value)}
                    placeholder='Enter system name...'
                    className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <p className='text-xs text-slate-500 mt-2 px-1'>
                    Remember to update material costs and labor hours for this
                    custom system.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        title='Construction'
        isOpen={openSections.construction}
        onToggle={() => toggleSection('construction')}
      >
        <div className='space-y-4'>
          {prepAndStructuralOptions.map((task) => (
            <div key={task.value}>
              <OptionToggle
                label={task.label}
                isEnabled={selectedPrepTasks.includes(task.value)}
                onToggle={() => handlePrepTaskToggle(task.value)}
              />
              {task.value === 'add_plywood' &&
                selectedPrepTasks.includes('add_plywood') && (
                  <div className='pt-3 pl-4 animate-fade-in'>
                    <Dropdown
                      label='Plywood Thickness'
                      options={plywoodThicknessOptions}
                      selectedOption={plywoodThickness}
                      onSelect={setPlywoodThickness}
                    />
                  </div>
                )}
            </div>
          ))}
          <div className='pt-4 border-t border-slate-200'>
            <Button
              onClick={() => toggleSection('constructionNotes')}
              className='w-full flex justify-between items-center py-2'
              variant='ghost'
            >
              <h3 className='text-lg font-bold text-blue-700'>Notes</h3>
              <svg
                className={`w-5 h-5 text-slate-500 transition-transform ${
                  openSections.constructionNotes ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </Button>
            {openSections.constructionNotes && (
              <div className='mt-2 animate-fade-in'>
                <Textarea
                  id='construction-notes'
                  label='Construction Notes'
                  value={floorChoices.constructionNotes}
                  onChange={(e) =>
                    handleInputChange('constructionNotes', e.target.value)
                  }
                  placeholder='Add construction notes...'
                  className='w-full p-2.5 bg-slate-50 border border-blue-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
      </CollapsibleCard>
    </div>
  );
}
