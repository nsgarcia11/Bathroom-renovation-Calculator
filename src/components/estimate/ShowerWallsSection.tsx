'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleSwitch } from './ToggleSwitch';
import { CollapsibleSection } from './CollapsibleSection';
import { CollapsibleNotesSection } from './CollapsibleNotesSection';
import { EditDimensionsModal } from './EditDimensionsModal';
import { WallRow } from './WallRow';
import { AlertTriangle, X } from 'lucide-react';

interface Wall {
  id: string;
  name: string;
  height: { ft: number; inch: number };
  width: { ft: number; inch: number };
  sqft?: number;
}

interface ShowerWallsDesign {
  tileSize: string;
  customTileWidth: string;
  customTileLength: string;
  tilePattern: string;
  customTilePatternName: string;
  niche: string;
  showerDoor: string;
  waterproofingSystem: string;
  customWaterproofingName: string;
  grabBar: string;
  notes: string;
  constructionNotes: string;
  clientSuppliesBase: string;
  repairWalls: boolean;
  reinsulateWalls: boolean;
}

interface ShowerWallsSectionProps {
  walls: Wall[];
  setWalls: (walls: Wall[] | ((prev: Wall[]) => Wall[])) => void;
  design: ShowerWallsDesign;
  setDesign: (
    design: ShowerWallsDesign | ((prev: ShowerWallsDesign) => ShowerWallsDesign)
  ) => void;
  wasteNote?: string;
}

export function ShowerWallsSection({
  walls,
  setWalls,
  design,
  setDesign,
  wasteNote,
}: ShowerWallsSectionProps) {
  const [totalSqft, setTotalSqft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWall, setEditingWall] = useState<Wall | null>(null);
  const [editingField, setEditingField] = useState<'height' | 'width' | null>(
    null
  );
  const [showWasteNote, setShowWasteNote] = useState(true);
  const [showClientSuppliesNote, setShowClientSuppliesNote] = useState(true);

  useEffect(() => {
    if (wasteNote) {
      setShowWasteNote(true);
    }
  }, [wasteNote]);

  useEffect(() => {
    if (design.clientSuppliesBase === 'No') {
      setShowClientSuppliesNote(true);
    }
  }, [design.clientSuppliesBase]);

  // Calculate square footage for each wall
  const wallsWithSqft = walls.map((wall) => {
    const heightInFeet = wall.height.ft + wall.height.inch / 12;
    const widthInFeet = wall.width.ft + wall.width.inch / 12;
    return { ...wall, sqft: heightInFeet * widthInFeet };
  });

  useEffect(() => {
    const total = wallsWithSqft.reduce((acc, wall) => acc + wall.sqft, 0);
    setTotalSqft(total);
  }, [wallsWithSqft]);

  const handleEdit = (wallId: string, field: 'height' | 'width') => {
    const wall = walls.find((w) => w.id === wallId);
    if (wall) {
      setEditingWall(wall);
      setEditingField(field);
      setIsModalOpen(true);
    }
  };

  const handleAddWall = () => {
    const newWall: Wall = {
      id: `wall-${Date.now()}-${walls.length + 1}`,
      name: `Wall ${walls.length + 1}`,
      height: { ft: 8, inch: 0 },
      width: { ft: 3, inch: 0 },
    };
    setWalls([...walls, newWall]);
  };

  const handleDeleteWall = (wallId: string) => {
    setWalls(walls.filter((wall) => wall.id !== wallId));
  };

  const handleDimensionChange = (newDimension: {
    ft: number;
    inch: number;
  }) => {
    if (editingWall && editingField) {
      setWalls(
        walls.map((wall) => {
          if (wall.id === editingWall.id) {
            return { ...wall, [editingField]: newDimension };
          }
          return wall;
        })
      );
    }
  };

  const updateDesign = (
    key: keyof ShowerWallsDesign,
    value: string | boolean
  ) => {
    setDesign((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className='space-y-4'>
      {/* Measurements Section */}
      <div className='px-4'>
        <CollapsibleSection
          title='Measurements'
          colorScheme='neutral'
          summary={
            <span className='text-blue-900 font-bold text-lg'>
              {totalSqft.toFixed(2)} sq/ft
            </span>
          }
        >
          <div className='space-y-2'>
            <p className='text-sm text-slate-600 pb-2'>
              Enter the base dimensions to calculate materials and labor.
            </p>
            {wallsWithSqft.map((wall) => (
              <WallRow
                key={wall.id}
                wall={wall}
                onEdit={handleEdit}
                onDelete={handleDeleteWall}
              />
            ))}
            <div className='flex justify-end mt-2'>
              <Button
                onClick={handleAddWall}
                className='bg-blue-600 text-white font-semibold py-1.5 px-5 rounded-lg hover:bg-blue-700 transition-colors text-sm'
              >
                + ADD WALL
              </Button>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* Design Section */}
      <div className='px-4 space-y-4'>
        <CollapsibleSection title='Design' colorScheme='design'>
          <div className='space-y-4'>
            <div className='pb-4 border-b border-slate-200'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-slate-800'>
                  Will the client supply the tiles?
                </span>
                <div className='flex items-center space-x-2'>
                  {['No', 'Yes'].map((option) => (
                    <button
                      key={option}
                      onClick={() => updateDesign('clientSuppliesBase', option)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        design.clientSuppliesBase === option
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              {design.clientSuppliesBase === 'Yes' &&
                showClientSuppliesNote && (
                  <div className='text-orange-500 text-xs flex items-start space-x-2 mt-2'>
                    <AlertTriangle className='w-4 h-4 flex-shrink-0 mt-0.5' />
                    <div className='flex-grow'>
                      Client is providing tiles, which will be removed from the
                      materials list. Please select the tile size and pattern to
                      ensure accurate labor and material calculations.
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
            </div>
            <div className='text-xs text-slate-600'>
              Labor costs change based on tile size and pattern. You can edit
              these values on the Labor screen.
            </div>
            <div className='flex flex-row space-x-4'>
              <div className='flex-1'>
                <Label className='block text-sm font-medium text-slate-600 mb-1'>
                  Tile Size
                </Label>
                <select
                  value={design.tileSize}
                  onChange={(e) => updateDesign('tileSize', e.target.value)}
                  className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  aria-label='Tile Size'
                >
                  <option value='Select tile size'>Select tile size</option>
                  <option value='12x24'>12x24</option>
                  <option value='24x24'>24x24</option>
                  <option value='Subway (3"x6" or small size tile)'>
                    Subway (3&quot;x6&quot; or small size tile)
                  </option>
                  <option value='Custom'>Custom</option>
                </select>
                {design.tileSize === 'Custom' && (
                  <div className='flex items-center space-x-2 mt-2'>
                    <div className='flex-1'>
                      <Label className='text-xs text-slate-500'>
                        Width (in)
                      </Label>
                      <Input
                        type='number'
                        value={design.customTileWidth}
                        onChange={(e) =>
                          updateDesign('customTileWidth', e.target.value)
                        }
                        placeholder='e.g., 8'
                        className='w-full p-2 border border-slate-300 rounded-md'
                      />
                    </div>
                    <div className='flex-1'>
                      <Label className='text-xs text-slate-500'>
                        Length (in)
                      </Label>
                      <Input
                        type='number'
                        value={design.customTileLength}
                        onChange={(e) =>
                          updateDesign('customTileLength', e.target.value)
                        }
                        placeholder='e.g., 16'
                        className='w-full p-2 border border-slate-300 rounded-md'
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className='flex-1'>
                <Label className='block text-sm font-medium text-slate-600 mb-1'>
                  Tile Pattern
                </Label>
                <select
                  value={design.tilePattern}
                  onChange={(e) => updateDesign('tilePattern', e.target.value)}
                  className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  aria-label='Tile Pattern'
                >
                  <option value='Select Tile Pattern'>
                    Select Tile Pattern
                  </option>
                  <option value='Stacked'>Stacked</option>
                  <option value='1/2 Offset'>1/2 Offset</option>
                  <option value='1/3 Offset'>1/3 Offset</option>
                  <option value='Herringbone'>Herringbone</option>
                  <option value='Custom'>Custom</option>
                </select>
                {design.tilePattern === 'Custom' && (
                  <Input
                    type='text'
                    value={design.customTilePatternName}
                    onChange={(e) =>
                      updateDesign('customTilePatternName', e.target.value)
                    }
                    placeholder='Enter custom pattern'
                    className='w-full mt-2 p-2 border border-slate-300 rounded-md'
                  />
                )}
              </div>
            </div>
            {wasteNote && showWasteNote && (
              <div className='text-orange-500 text-sm p-3 flex items-start space-x-3 mt-2'>
                <AlertTriangle className='w-5 h-5 flex-shrink-0 mt-0.5' />
                <div className='flex-grow'>{wasteNote}</div>
                <button
                  onClick={() => setShowWasteNote(false)}
                  className='text-orange-600 hover:text-orange-800 p-0.5 rounded-full hover:bg-orange-100 -mt-1 -mr-1'
                  title='Close note'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            )}

            <div className='border-t border-slate-200 pt-4 space-y-4'>
              <div>
                <Label className='block text-sm font-medium text-slate-600 mb-1'>
                  Niche
                </Label>
                <select
                  value={design.niche}
                  onChange={(e) => updateDesign('niche', e.target.value)}
                  className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  aria-label='Niche'
                >
                  <option value='None'>None</option>
                  <option value='12x12'>12x12</option>
                  <option value='Standard (12x24)'>Standard (12x24)</option>
                  <option value='Custom Size'>Custom Size</option>
                </select>
              </div>
              <div>
                <Label className='block text-sm font-medium text-slate-600 mb-1'>
                  Shower Door
                </Label>
                <select
                  value={design.showerDoor}
                  onChange={(e) => updateDesign('showerDoor', e.target.value)}
                  className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  aria-label='Shower Door'
                >
                  <option value='None'>None</option>
                  <option value='Sliding Glass Door'>Sliding Glass Door</option>
                  <option value='Pivot Glass Door'>Pivot Glass Door</option>
                  <option value='Custom Glass'>Custom Glass</option>
                </select>
              </div>
              <div className='flex items-center justify-between'>
                <Label className='font-medium text-slate-800'>
                  Number of Grab Bars
                </Label>
                <input
                  type='number'
                  value={design.grabBar}
                  onChange={(e) => updateDesign('grabBar', e.target.value)}
                  className='w-24 bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-slate-800 text-center focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  min={0}
                  aria-label='Number of Grab Bars'
                />
              </div>
            </div>

            <CollapsibleNotesSection
              title='Notes'
              value={design.notes}
              onChange={(value: string) => updateDesign('notes', value)}
              placeholder='Add any project-specific notes here...'
              helpers={[
                'Trim Style',
                'Grout Color',
                'Niche Details',
                'Accent Wall',
                'Shower Fixtures',
              ]}
            />
          </div>
        </CollapsibleSection>

        {/* Construction Section */}
        <CollapsibleSection title='Construction' colorScheme='construction'>
          <div className='space-y-4'>
            <div className='pb-4 border-b border-slate-200'>
              <Label className='block text-sm font-medium text-slate-600 mb-1'>
                Waterproofing
              </Label>
              <select
                value={design.waterproofingSystem}
                onChange={(e) =>
                  updateDesign('waterproofingSystem', e.target.value)
                }
                className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                aria-label='Waterproofing System'
              >
                <option value='None / Select System...'>
                  None / Select System...
                </option>
                <option value='Schluter®-KERDI System'>
                  Schluter®-KERDI System
                </option>
                <option value='RedGard® Waterproofing Membrane'>
                  RedGard® Waterproofing Membrane
                </option>
                <option value='LATICRETE® HYDRO BAN'>
                  LATICRETE® HYDRO BAN
                </option>
                <option value='Drywall and Kerdi membrane'>
                  Drywall and Kerdi membrane
                </option>
                <option value='Other'>Other</option>
              </select>
              {design.waterproofingSystem === 'Other' && (
                <div className='mt-2 space-y-2'>
                  <Input
                    type='text'
                    value={design.customWaterproofingName}
                    onChange={(e) =>
                      updateDesign('customWaterproofingName', e.target.value)
                    }
                    placeholder='Enter custom system name'
                    className='w-full p-2 border border-slate-300 rounded-md'
                  />
                  <p className='text-sm text-amber-800 bg-amber-50 p-3 rounded-md border border-amber-200'>
                    <b>Note:</b> Ensure you update the Materials and Labor
                    screens for custom systems.
                  </p>
                </div>
              )}
            </div>
            <ToggleSwitch
              label='Re-insulate exterior walls?'
              enabled={design.reinsulateWalls}
              onToggle={(value) => updateDesign('reinsulateWalls', value)}
              className='pb-4 border-b border-slate-200'
            />
            <ToggleSwitch
              label='Repair Walls'
              enabled={design.repairWalls}
              onToggle={(value) => updateDesign('repairWalls', value)}
              className='pb-4 border-b border-slate-200'
            />
            <CollapsibleNotesSection
              title='Notes'
              value={design.constructionNotes}
              onChange={(value: string) =>
                updateDesign('constructionNotes', value)
              }
              placeholder='e.g., Add blocking for grab bars, move plumbing...'
              helpers={[
                'Blocking',
                'Plumbing Move',
                'Electrical',
                'Ventilation',
              ]}
            />
          </div>
        </CollapsibleSection>
      </div>

      <EditDimensionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dimension={
          editingWall
            ? editingWall[editingField || 'height']
            : { ft: 0, inch: 0 }
        }
        setDimension={handleDimensionChange}
      />
    </div>
  );
}
