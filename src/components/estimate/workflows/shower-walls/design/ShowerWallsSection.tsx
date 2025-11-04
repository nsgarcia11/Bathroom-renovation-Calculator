'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { ToggleSwitch } from '@/components/estimate/shared/ToggleSwitch';
import { CollapsibleSection } from '@/components/estimate/shared/CollapsibleSection';
import { WorkflowNotesSection } from '@/components/estimate/shared/WorkflowNotesSection';
import { EditDimensionsModal } from '@/components/estimate/shared/EditDimensionsModal';
import { WallRow } from '@/components/estimate/shared/WallRow';
import { AlertTriangle, X } from 'lucide-react';
import { useShowerWallsCalculations } from '@/hooks/use-shower-walls-calculations';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';

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
  designContractorNotes: string;
  designClientNotes: string;
  constructionContractorNotes: string;
  constructionClientNotes: string;
  clientSuppliesBase: string;
  repairWalls: boolean;
  reinsulateWalls: boolean;
}

export function ShowerWallsSection() {
  const { getDesignData, updateDesign } = useEstimateWorkflowContext();

  // Get design data from context
  const designData = getDesignData('showerWalls') as {
    walls: Wall[];
    design: ShowerWallsDesign;
  } | null;

  const walls = useMemo(() => designData?.walls || [], [designData]);
  const design = useMemo(
    () =>
      designData?.design || {
        tileSize: 'Select tile size',
        customTileWidth: '',
        customTileLength: '',
        tilePattern: 'Select Tile Pattern',
        customTilePatternName: '',
        niche: 'None',
        showerDoor: 'None',
        waterproofingSystem: 'None / Select System...',
        customWaterproofingName: '',
        grabBar: '0',
        notes: '',
        constructionNotes: '',
        designContractorNotes: '',
        designClientNotes: '',
        constructionContractorNotes: '',
        constructionClientNotes: '',
        clientSuppliesBase: 'No',
        repairWalls: false,
        reinsulateWalls: false,
      },
    [designData]
  );

  // Context update functions
  const setWalls = useCallback(
    (newWalls: Wall[] | ((prev: Wall[]) => Wall[])) => {
      const wallsArray =
        typeof newWalls === 'function' ? newWalls(walls) : newWalls;
      updateDesign('showerWalls', { walls: wallsArray });
    },
    [walls, updateDesign]
  );

  const setDesign = (
    newDesign:
      | ShowerWallsDesign
      | ((prev: ShowerWallsDesign) => ShowerWallsDesign)
  ) => {
    const designObj =
      typeof newDesign === 'function' ? newDesign(design) : newDesign;
    updateDesign('showerWalls', { design: designObj });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWall, setEditingWall] = useState<Wall | null>(null);
  const [editingField, setEditingField] = useState<'height' | 'width' | null>(
    null
  );
  const [showWasteNote, setShowWasteNote] = useState(true);
  const [showClientSuppliesNote, setShowClientSuppliesNote] = useState(true);
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());

  // Use the calculator hook for all calculations
  const { totalSqft, wasteNote: calculatedWasteNote, warnings } =
    useShowerWallsCalculations({
      walls,
      design,
    });

  // Initialize default walls if none exist
  useEffect(() => {
    if (walls.length === 0) {
      const defaultWalls: Wall[] = [
        {
          id: 'wall-1',
          name: 'Wall 1',
          height: { ft: 8, inch: 0 },
          width: { ft: 3, inch: 0 },
        },
        {
          id: 'wall-2',
          name: 'Wall 2',
          height: { ft: 8, inch: 0 },
          width: { ft: 3, inch: 0 },
        },
        {
          id: 'wall-3',
          name: 'Wall 3',
          height: { ft: 8, inch: 0 },
          width: { ft: 3, inch: 0 },
        },
      ];
      setWalls(defaultWalls);
    }
  }, [walls.length, setWalls]);

  useEffect(() => {
    if (calculatedWasteNote) {
      setShowWasteNote(true);
    }
  }, [calculatedWasteNote]);

  useEffect(() => {
    if (design.clientSuppliesBase === 'No') {
      setShowClientSuppliesNote(true);
    }
  }, [design.clientSuppliesBase]);

  // Calculate square footage for each wall for display
  const wallsWithSqft = walls.map((wall) => {
    const heightInFeet = wall.height.ft + wall.height.inch / 12;
    const widthInFeet = wall.width.ft + wall.width.inch / 12;
    return { ...wall, sqft: heightInFeet * widthInFeet };
  });

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

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-slate-800'>Shower Walls</h2>
      {/* Measurements Section */}
      <div className='px-0'>
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
      <div className='px-0 space-y-4'>
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
                      onClick={() =>
                        setDesign((prev) => ({
                          ...prev,
                          clientSuppliesBase: option,
                        }))
                      }
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
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
                <Select
                  id='tileSize'
                  label=''
                  value={design.tileSize}
                  onChange={(e) =>
                    setDesign((prev) => ({ ...prev, tileSize: e.target.value }))
                  }
                  className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                >
                  <option value='Select tile size'>Select tile size</option>
                  <option value='12x24'>12x24</option>
                  <option value='24x24'>24x24</option>
                  <option value='Subway (3"x6" or small size tile)'>
                    Subway (3&quot;x6&quot; or small size tile)
                  </option>
                  <option value='Custom'>Custom</option>
                </Select>
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
                          setDesign((prev) => ({
                            ...prev,
                            customTileWidth: e.target.value,
                          }))
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
                          setDesign((prev) => ({
                            ...prev,
                            customTileLength: e.target.value,
                          }))
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
                <Select
                  id='tilePattern'
                  label=''
                  value={design.tilePattern}
                  onChange={(e) =>
                    setDesign((prev) => ({
                      ...prev,
                      tilePattern: e.target.value,
                    }))
                  }
                  className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                >
                  <option value='Select Tile Pattern'>
                    Select Tile Pattern
                  </option>
                  <option value='Stacked'>Stacked</option>
                  <option value='1/2 Offset'>1/2 Offset</option>
                  <option value='1/3 Offset'>1/3 Offset</option>
                  <option value='Herringbone'>Herringbone</option>
                  <option value='Custom'>Custom</option>
                </Select>
                {design.tilePattern === 'Custom' && (
                  <Input
                    type='text'
                    value={design.customTilePatternName}
                    onChange={(e) =>
                      setDesign((prev) => ({
                        ...prev,
                        customTilePatternName: e.target.value,
                      }))
                    }
                    placeholder='Enter custom pattern'
                    className='w-full mt-2 p-2 border border-slate-300 rounded-md'
                  />
                )}
              </div>
            </div>
            {calculatedWasteNote && showWasteNote && (
              <div className='text-orange-500 text-xs flex items-start space-x-2 mt-2'>
                <AlertTriangle className='w-5 h-5 flex-shrink-0 mt-0.5' />
                <div className='flex-grow'>{calculatedWasteNote}</div>
                <button
                  onClick={() => setShowWasteNote(false)}
                  className='text-orange-600 hover:text-orange-800 p-0.5 rounded-full hover:bg-orange-100 -mt-1 -mr-1'
                  title='Close note'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            )}

            {/* Display warnings for large-format tiles */}
            {warnings && warnings.length > 0 && (
              <div className='space-y-2 mt-2'>
                {warnings.map((warning, index) => {
                  const warningKey = `warning-${index}`;
                  if (dismissedWarnings.has(warningKey)) return null;

                  return (
                    <div
                      key={warningKey}
                      className='bg-yellow-50 border border-yellow-300 text-yellow-800 text-xs flex items-start space-x-2 p-3 rounded-md'
                    >
                      <AlertTriangle className='w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-600' />
                      <div className='flex-grow font-medium'>{warning}</div>
                      <button
                        onClick={() => {
                          setDismissedWarnings(prev => {
                            const newSet = new Set(prev);
                            newSet.add(warningKey);
                            return newSet;
                          });
                        }}
                        className='text-yellow-700 hover:text-yellow-900 p-0.5 rounded-full hover:bg-yellow-200 -mt-1 -mr-1'
                        title='Dismiss warning'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className='border-t border-slate-200 pt-4 space-y-4'>
              <div>
                <Label className='block text-sm font-medium text-slate-600 mb-1'>
                  Niche
                </Label>
                <Select
                  id='niche'
                  label=''
                  value={design.niche}
                  onChange={(e) =>
                    setDesign((prev) => ({ ...prev, niche: e.target.value }))
                  }
                  className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                >
                  <option value='None'>None</option>
                  <option value='12x12'>12x12</option>
                  <option value='Standard (12x24)'>Standard (12x24)</option>
                  <option value='Custom Size'>Custom Size</option>
                </Select>
              </div>
              <div>
                <Label className='block text-sm font-medium text-slate-600 mb-1'>
                  Shower Door
                </Label>
                <Select
                  id='showerDoor'
                  label=''
                  value={design.showerDoor}
                  onChange={(e) =>
                    setDesign((prev) => ({
                      ...prev,
                      showerDoor: e.target.value,
                    }))
                  }
                  className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                >
                  <option value='None'>None</option>
                  <option value='Sliding Glass Door'>Sliding Glass Door</option>
                  <option value='Pivot Glass Door'>Pivot Glass Door</option>
                  <option value='Custom Glass'>Custom Glass</option>
                </Select>
              </div>
              <div className='flex items-center justify-between'>
                <Label className='font-medium text-slate-800'>
                  Number of Grab Bars
                </Label>
                <Input
                  type='number'
                  value={design.grabBar.toString()}
                  onChange={(e) =>
                    setDesign((prev) => ({ ...prev, grabBar: e.target.value }))
                  }
                  className='w-24 bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-slate-800 text-center focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  aria-label='Number of Grab Bars'
                />
              </div>
            </div>

            <WorkflowNotesSection
              contractorNotes={design.designContractorNotes}
              clientNotes={design.designClientNotes}
              onContractorNotesChange={(notes) => {
                setDesign((prev) => ({
                  ...prev,
                  designContractorNotes: notes,
                }));
              }}
              onClientNotesChange={(notes) => {
                setDesign((prev) => ({ ...prev, designClientNotes: notes }));
              }}
              title='Design Notes'
              placeholder='Add design-specific notes here...'
              contractorTags={[
                'Wall not square',
                'Valve not centered to layout',
                'Blocking needed for niche or glass',
                'Tile layout to align with feature wall',
                'Recommend upgraded waterproofing system',
              ]}
              clientTags={[
                'Trim Style / Color',
                'Grout Color',
                'Accent or Border details',
                'Shower Fixtures color/Finishing',
                'Tile Name',
              ]}
              useTabs={true}
              alwaysExpanded={true}
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
              <Select
                id='waterproofingSystem'
                label=''
                value={design.waterproofingSystem}
                onChange={(e) =>
                  setDesign((prev) => ({
                    ...prev,
                    waterproofingSystem: e.target.value,
                  }))
                }
                className='w-full appearance-none bg-slate-50 border border-blue-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
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
              </Select>
              {design.waterproofingSystem === 'Other' && (
                <div className='mt-2 space-y-2'>
                  <Input
                    type='text'
                    value={design.customWaterproofingName}
                    onChange={(e) =>
                      setDesign((prev) => ({
                        ...prev,
                        customWaterproofingName: e.target.value,
                      }))
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
              onToggle={(value) =>
                setDesign((prev) => ({ ...prev, reinsulateWalls: value }))
              }
              className='pb-4 border-b border-slate-200'
            />
            <ToggleSwitch
              label='Repair Walls'
              enabled={design.repairWalls}
              onToggle={(value) =>
                setDesign((prev) => ({ ...prev, repairWalls: value }))
              }
              className='pb-4 border-b border-slate-200'
            />
            <WorkflowNotesSection
              contractorNotes={design.constructionContractorNotes}
              clientNotes={design.constructionClientNotes}
              onContractorNotesChange={(notes) => {
                setDesign((prev) => ({
                  ...prev,
                  constructionContractorNotes: notes,
                }));
              }}
              onClientNotesChange={(notes) => {
                setDesign((prev) => ({
                  ...prev,
                  constructionClientNotes: notes,
                }));
              }}
              title='Construction Notes'
              placeholder='Add construction-specific notes here...'
              contractorTags={[
                'Moisture or Mold issue',
                'Uneven walls / floor',
                'Existing walls uneven',
                'Valve height or alignment off',
              ]}
              clientTags={['Grab bar details', 'Grout sealant']}
              useTabs={true}
              alwaysExpanded={true}
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
