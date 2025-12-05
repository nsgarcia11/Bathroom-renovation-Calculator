'use client';

import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
import { SHOWER_WALLS_MATERIALS_ITEMS, DEFAULT_PRICES } from '@/lib/constants';

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  price: string;
  scope?: string;
  source?: string;
}

interface ShowerWallsDesignData {
  walls: Array<{
    id: string;
    name: string;
    height: { ft: number; inch: number };
    width: { ft: number; inch: number };
  }>;
  design: {
    clientSuppliesBase: 'No' | 'Yes';
    tileSize: string;
    customTileWidth?: string;
    customTileLength?: string;
    tilePattern: string;
    customTilePatternName?: string;
    niche: string;
    showerDoor: string;
    waterproofingSystem: string;
    customWaterproofingName?: string;
    grabBar: string;
    repairWalls: boolean;
    reinsulateWalls: boolean;
    notes?: string;
    constructionNotes?: string;
  };
}

export default function ShowerWallsMaterialsSection() {
  const { getDesignData, getMaterialItems, setMaterialItems, isReloading } =
    useEstimateWorkflowContext();

  // Get design data from context
  const designData = getDesignData(
    'showerWalls'
  ) as ShowerWallsDesignData | null;
  const walls = useMemo(() => designData?.walls || [], [designData]);
  const design = useMemo(
    () =>
      designData?.design || {
        clientSuppliesBase: 'No',
        tileSize: 'Select tile size',
        tilePattern: 'Select Tile Pattern',
        niche: 'None',
        showerDoor: 'None',
        waterproofingSystem: 'None / Select System...',
        grabBar: '0',
        repairWalls: false,
        reinsulateWalls: false,
      },
    [designData]
  );

  // Get context data
  const contextMaterials = getMaterialItems('showerWalls');

  // Local state for immediate UI updates
  const [localMaterials, setLocalMaterials] = useState<MaterialItem[]>([]);
  const [isDesignOpen, setIsDesignOpen] = useState(true);
  const [isConstructionOpen, setIsConstructionOpen] = useState(true);

  // Refs to track user actions and prevent auto-generation interference
  const isUserActionRef = useRef(false);
  const processedChoicesRef = useRef<string>('');

  // Calculate total square footage
  const totalSqft = useMemo(() => {
    if (!walls || !Array.isArray(walls) || walls.length === 0) {
      return 0;
    }

    return walls.reduce((total, wall) => {
      const heightInFeet = wall.height.ft + wall.height.inch / 12;
      const widthInFeet = wall.width.ft + wall.width.inch / 12;
      return total + heightInFeet * widthInFeet;
    }, 0);
  }, [walls]);

  /* // Calculate waste factor based on tile pattern
  const wasteFactor = useMemo(() => {
    switch (design.tilePattern) {
      case 'Herringbone':
        return 1.25;
      case '1/2 Offset':
      case '1/3 Offset':
        return 1.15;
      default:
        return 1.1;
    }
  }, [design.tilePattern]);

  // Calculate tile needed
  const tileNeeded = useMemo(() => {
    if (design.tileSize === 'Select tile size') return 0;
    return totalSqft * wasteFactor;
  }, [totalSqft, wasteFactor, design.tileSize]); */

  // Helper function to generate materials based on shower walls design
  const generateMaterials = useCallback(
    (designData: ShowerWallsDesignData): MaterialItem[] => {
      const materials: MaterialItem[] = [];
      const { walls, design } = designData;

      // Add safety checks to prevent undefined errors
      if (!walls || !Array.isArray(walls) || walls.length === 0) {
        return materials;
      }

      if (!design) {
        return materials;
      }

      const totalSqft = walls.reduce((total, wall) => {
        const heightInFeet = wall.height.ft + wall.height.inch / 12;
        const widthInFeet = wall.width.ft + wall.width.inch / 12;
        return total + heightInFeet * widthInFeet;
      }, 0);

      const wasteFactor = (() => {
        switch (design.tilePattern) {
          case 'Herringbone':
            return 1.25;
          case '1/2 Offset':
          case '1/3 Offset':
            return 1.15;
          default:
            return 1.1;
        }
      })();

      const tileNeeded =
        design.tileSize === 'Select tile size' ? 0 : totalSqft * wasteFactor;

      // Only generate tiling materials if tile size is selected
      if (design.tileSize !== 'Select tile size') {
        // Wall tiles (only if contractor supplies)
        if (design.clientSuppliesBase === 'No') {
          const tileSizeLabel =
            design.tileSize === 'Custom'
              ? `Custom ${design.customTileWidth || ''}x${
                  design.customTileLength || ''
                }"`
              : design.tileSize;

          materials.push({
            ...SHOWER_WALLS_MATERIALS_ITEMS.wallTile,
            name: `Wall Tile (${tileSizeLabel})`,
            quantity: tileNeeded.toFixed(1),
            price: DEFAULT_PRICES.wallTile.toFixed(2),
          });
        }

        // Always add setting materials
        materials.push({
          ...SHOWER_WALLS_MATERIALS_ITEMS.thinset,
          quantity: Math.ceil(totalSqft / 50).toString(),
          price: DEFAULT_PRICES.thinset.toFixed(2),
        });

        materials.push({
          ...SHOWER_WALLS_MATERIALS_ITEMS.grout,
          quantity: Math.max(1, Math.ceil(totalSqft / 100)).toString(),
          price: DEFAULT_PRICES.grout.toFixed(2),
        });

        materials.push({
          ...SHOWER_WALLS_MATERIALS_ITEMS.tileEdge,
          price: DEFAULT_PRICES.tileEdge.toFixed(2),
        });
      }

      // Waterproofing materials
      if (design.waterproofingSystem !== 'None / Select System...') {
        const wpName =
          design.waterproofingSystem === 'Other' &&
          design.customWaterproofingName
            ? design.customWaterproofingName
            : design.waterproofingSystem;

        switch (design.waterproofingSystem) {
          case 'Schluter®-KERDI System':
            materials.push({
              ...SHOWER_WALLS_MATERIALS_ITEMS.wpBoard,
              quantity: Math.ceil(totalSqft / 32).toString(),
              price: DEFAULT_PRICES.kerdiBoard.toFixed(2),
            });
            materials.push({
              ...SHOWER_WALLS_MATERIALS_ITEMS.wpBand,
              price: DEFAULT_PRICES.kerdiBand.toFixed(2),
            });
            materials.push({
              ...SHOWER_WALLS_MATERIALS_ITEMS.wpScrews,
              price: DEFAULT_PRICES.kerdiScrews.toFixed(2),
            });
            break;

          case 'RedGard® Waterproofing Membrane':
          case 'LATICRETE® HYDRO BAN':
            materials.push({
              ...SHOWER_WALLS_MATERIALS_ITEMS.wpLiquid,
              name: `${wpName}`,
              quantity: Math.ceil(totalSqft / 100).toString(),
              price: DEFAULT_PRICES.waterproofingLiquid.toFixed(2),
            });
            materials.push({
              ...SHOWER_WALLS_MATERIALS_ITEMS.wpFabric,
              price: DEFAULT_PRICES.reinforcingFabric.toFixed(2),
            });
            break;

          case 'Drywall and Kerdi membrane':
            materials.push({
              ...SHOWER_WALLS_MATERIALS_ITEMS.wpDrywall,
              quantity: Math.ceil(totalSqft / 32).toString(),
              price: DEFAULT_PRICES.moistureResistantDrywall.toFixed(2),
            });
            materials.push({
              ...SHOWER_WALLS_MATERIALS_ITEMS.wpMembrane,
              quantity: totalSqft.toFixed(1),
              price: DEFAULT_PRICES.kerdiMembrane.toFixed(2),
            });
            break;

          default: // Other
            materials.push({
              ...SHOWER_WALLS_MATERIALS_ITEMS.wpOther,
              name: `Waterproofing: ${wpName}`,
              price: DEFAULT_PRICES.waterproofingOther.toFixed(2),
            });
            break;
        }
      }

      // Other feature materials
      if (design.reinsulateWalls) {
        materials.push({
          ...SHOWER_WALLS_MATERIALS_ITEMS.insulation,
          price: DEFAULT_PRICES.insulation.toFixed(2),
        });
      }

      if (design.niche !== 'None') {
        // Determine niche pricing based on size
        let nicheConfig;
        let nichePrice;

        if (design.niche === '12x12') {
          nicheConfig = SHOWER_WALLS_MATERIALS_ITEMS.niche12x12;
          nichePrice = DEFAULT_PRICES.niche12x12;
        } else if (design.niche === 'Standard (12x24)') {
          nicheConfig = SHOWER_WALLS_MATERIALS_ITEMS.niche12x24;
          nichePrice = DEFAULT_PRICES.niche12x24;
        } else {
          // Custom Size
          nicheConfig = SHOWER_WALLS_MATERIALS_ITEMS.nicheCustom;
          nichePrice = DEFAULT_PRICES.nicheCustom;
        }

        materials.push({
          ...nicheConfig,
          price: nichePrice.toFixed(2),
        });
      }

      if (design.showerDoor !== 'None') {
        const doorType =
          design.showerDoor === 'Custom Glass'
            ? ' (Custom)'
            : ` (${design.showerDoor})`;
        materials.push({
          ...SHOWER_WALLS_MATERIALS_ITEMS.door,
          name: `Shower Door${doorType}`,
          price: DEFAULT_PRICES.showerDoor.toFixed(2),
        });
        materials.push({
          ...SHOWER_WALLS_MATERIALS_ITEMS.doorBlocking,
          price: DEFAULT_PRICES.doorBlocking.toFixed(2),
        });
      }

      const grabBarCount = parseInt(design.grabBar) || 0;
      if (grabBarCount > 0) {
        materials.push({
          ...SHOWER_WALLS_MATERIALS_ITEMS.grabBar,
          quantity: grabBarCount.toString(),
          price: DEFAULT_PRICES.grabBar.toFixed(2),
        });
      }

      return materials;
    },
    []
  );

  // Sync local state with context
  useEffect(() => {
    setLocalMaterials(contextMaterials);
  }, [contextMaterials]);

  // Auto-generate materials when design changes
  useEffect(() => {
    // Don't run if user is currently making changes or if we're reloading data
    if (isUserActionRef.current || isReloading) return;

    // If we have data from context (Supabase), never override it with defaults
    if (contextMaterials && contextMaterials.length > 0) {
      return;
    }

    // Create a key for the current design to prevent reprocessing
    const designKey = JSON.stringify({
      walls,
      design,
      totalSqft,
    });
    if (processedChoicesRef.current === designKey) {
      return;
    }

    const currentMaterials = localMaterials || [];
    const existingAutoItems = currentMaterials.filter(
      (item) => item.source === 'calculated'
    );

    // Only generate if we have design data and no existing auto items
    if (designData && existingAutoItems.length === 0) {
      // Add safety check for designData structure
      if (!designData.walls || !designData.design) {
        return;
      }

      const newAutoItems = generateMaterials(designData);

      if (newAutoItems.length > 0) {
        setMaterialItems('showerWalls', newAutoItems);
        processedChoicesRef.current = designKey;
      }
    }
  }, [
    walls,
    design,
    totalSqft,
    generateMaterials,
    localMaterials,
    contextMaterials,
    isReloading,
    setMaterialItems,
    designData,
  ]);

  // Handlers for materials

  const handleAddDesignMaterial = useCallback(() => {
    const newItem: MaterialItem = {
      id: `custom-design-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      name: 'Custom Design Material',
      quantity: '1',
      unit: 'piece',
      price: '0.00',
      source: 'custom',
      scope: 'showerWalls_design',
    };

    isUserActionRef.current = true;
    setLocalMaterials((prev) => [...prev, newItem]);

    setTimeout(() => {
      setMaterialItems('showerWalls', [...localMaterials, newItem]);
      isUserActionRef.current = false;
    }, 100);
  }, [localMaterials, setMaterialItems]);

  const handleAddConstructionMaterial = useCallback(() => {
    const newItem: MaterialItem = {
      id: `custom-construction-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      name: 'Custom Construction Material',
      quantity: '1',
      unit: 'piece',
      price: '0.00',
      source: 'custom',
      scope: 'showerWalls_construction',
    };

    isUserActionRef.current = true;
    setLocalMaterials((prev) => [...prev, newItem]);

    setTimeout(() => {
      setMaterialItems('showerWalls', [...localMaterials, newItem]);
      isUserActionRef.current = false;
    }, 100);
  }, [localMaterials, setMaterialItems]);

  const handleMaterialChange = useCallback(
    (id: string, field: keyof MaterialItem, value: string) => {
      isUserActionRef.current = true;

      setLocalMaterials((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );

      setTimeout(() => {
        const updatedItems = localMaterials.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        );
        setMaterialItems('showerWalls', updatedItems);
        isUserActionRef.current = false;
      }, 100);
    },
    [localMaterials, setMaterialItems]
  );

  const handleDeleteMaterial = useCallback(
    (id: string) => {
      isUserActionRef.current = true;

      setLocalMaterials((prev) => prev.filter((item) => item.id !== id));

      setTimeout(() => {
        const updatedItems = localMaterials.filter((item) => item.id !== id);
        setMaterialItems('showerWalls', updatedItems);
        isUserActionRef.current = false;
      }, 100);
    },
    [localMaterials, setMaterialItems]
  );

  const materials = localMaterials;

  const renderMaterialItem = useCallback(
    (material: MaterialItem) => {
      return (
        <div
          key={material.id}
          className={`p-3 bg-white rounded-lg border ${
            material.source === 'calculated'
              ? 'bg-blue-50 border-blue-200'
              : 'border-slate-300'
          }`}
        >
          <div className='flex items-center gap-2 mb-2'>
            <Input
              type='text'
              value={material.name}
              onChange={(e) =>
                handleMaterialChange(material.id, 'name', e.target.value)
              }
              placeholder='Supply Name'
              className={`border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent border-blue-300 focus:border-blue-500 focus:outline-none`}
            />
            <Button
              onClick={() => handleDeleteMaterial(material.id)}
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-700 p-1 h-auto'
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs text-slate-500'>Quantity{material.unit ? ` (${material.unit})` : ''}</label>
              <Input
                type='number'
                value={material.quantity}
                onChange={(e) =>
                  handleMaterialChange(material.id, 'quantity', e.target.value)
                }
                placeholder='0'
                className={`text-center border-blue-300 focus:border-blue-500`}
              />
            </div>
            <div>
              <label className='text-xs text-slate-500'>Price/Unit ($)</label>
              <Input
                type='number'
                value={material.price}
                onChange={(e) =>
                  handleMaterialChange(material.id, 'price', e.target.value)
                }
                placeholder='0.00'
                className={`text-center border-blue-300 focus:border-blue-500`}
              />
            </div>
            <div className='col-span-2'>
              <label className='text-xs text-slate-500'>Total</label>
              <div className='w-full p-2 text-center font-semibold text-slate-800 bg-slate-50 rounded-md'>
                $
                {(
                  (parseFloat(material.quantity) || 0) *
                  (parseFloat(material.price) || 0)
                ).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      );
    },
    [handleMaterialChange, handleDeleteMaterial]
  );

  // Separate materials by scope
  const designMaterials = useMemo(() => {
    return materials.filter((item) => item.scope === 'showerWalls_design');
  }, [materials]);

  const constructionMaterials = useMemo(() => {
    return materials.filter(
      (item) => item.scope === 'showerWalls_construction'
    );
  }, [materials]);

  // Calculate totals for design materials
  const designTotal = designMaterials.reduce(
    (sum, item) =>
      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
    0
  );

  // Calculate totals for construction materials
  const constructionTotal = constructionMaterials.reduce(
    (sum, item) =>
      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
    0
  );

  // Calculate overall total (for backward compatibility)
  const total = materials.reduce(
    (sum, item) =>
      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
    0
  );

  return (
    <div className='space-y-5'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-slate-800'>
          Materials & Supplies
        </h2>
        <div className='text-right'>
          <p className='font-bold text-blue-600 text-lg'>${total.toFixed(2)}</p>
        </div>
      </div>

      <div className='space-y-4'>
        {/* Design Materials Section */}
        <Card>
          <CardContent className='p-3 space-y-3'>
            <div
              className='flex justify-between items-center cursor-pointer'
              onClick={() => setIsDesignOpen(!isDesignOpen)}
            >
              <div className='flex items-center gap-2 justify-between w-full'>
                <div className='flex items-center gap-2'>
                  {isDesignOpen ? (
                    <ChevronDown className='h-4 w-4 text-slate-600' />
                  ) : (
                    <ChevronRight className='h-4 w-4 text-slate-600' />
                  )}
                  <h3 className='text-lg font-semibold text-slate-700'>
                    Design Materials
                  </h3>
                </div>
                <p className='font-bold text-blue-600 text-sm'>
                  ${designTotal.toFixed(2)}
                </p>
              </div>
            </div>
            {isDesignOpen && (
              <>
                {designMaterials.length > 0 ? (
                  <div className='space-y-2'>
                    {designMaterials.map(renderMaterialItem)}
                  </div>
                ) : (
                  <p className='text-sm text-slate-500 text-center py-4'>
                    No design materials added yet.
                  </p>
                )}
                <div className='flex justify-center'>
                  <Button
                    onClick={handleAddDesignMaterial}
                    variant='default'
                    className='w-auto mt-2 flex items-center justify-center gap-2 py-2.5 px-4 text-white font-semibold border-blue-200'
                  >
                    <Plus size={16} />
                    Add Item
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Construction Materials Section */}
        <Card>
          <CardContent className='p-3 space-y-3'>
            <div
              className='flex justify-between items-center cursor-pointer'
              onClick={() => setIsConstructionOpen(!isConstructionOpen)}
            >
              <div className='flex items-center gap-2 justify-between w-full'>
                <div className='flex items-center gap-2'>
                  {isConstructionOpen ? (
                    <ChevronDown className='h-4 w-4 text-slate-600' />
                  ) : (
                    <ChevronRight className='h-4 w-4 text-slate-600' />
                  )}
                  <h3 className='text-lg font-semibold text-slate-700'>
                    Construction Materials
                  </h3>
                </div>
                <p className='font-bold text-blue-600 text-sm'>
                  ${constructionTotal.toFixed(2)}
                </p>
              </div>
            </div>
            {isConstructionOpen && (
              <>
                {constructionMaterials.length > 0 ? (
                  <div className='space-y-2'>
                    {constructionMaterials.map(renderMaterialItem)}
                  </div>
                ) : (
                  <p className='text-sm text-slate-500 text-center py-4'>
                    No construction materials added yet.
                  </p>
                )}
                <div className='flex justify-center'>
                  <Button
                    onClick={handleAddConstructionMaterial}
                    variant='default'
                    className='w-auto mt-2 flex items-center justify-center gap-2 py-2.5 px-4 text-white font-semibold border-blue-200'
                  >
                    <Plus size={16} />
                    Add Item
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
