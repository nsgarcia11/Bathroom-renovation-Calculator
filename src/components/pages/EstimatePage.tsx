'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useProject } from '@/hooks/use-projects';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Hammer,
  ShowerHead,
  Layers,
  Paintbrush,
} from 'lucide-react';
import { ShowerBaseIcon } from '@/components/icons/ShowerBaseIcon';
import { TradeIcon } from '@/components/icons/TradeIcon';
import { StructuralIcon } from '@/components/icons/StructuralIcon';
import { useRouter } from 'next/navigation';
import { DemolitionSection } from '@/components/estimate/DemolitionSection';
import { ShowerBaseSection } from '@/components/estimate/ShowerBaseSection';
import { ShowerWallsSection } from '@/components/estimate/ShowerWallsSection';
import { ShowerWallsAutoUpdate } from '@/components/estimate/ShowerWallsAutoUpdate';
import { ShowerBaseAutoUpdate } from '@/components/estimate/ShowerBaseAutoUpdate';
import { FloorSection } from '@/components/estimate/FloorSection';
import { FloorAutoUpdate } from '@/components/estimate/FloorAutoUpdate';
import { FloorLaborSection } from '@/components/estimate/FloorLaborSection';
import { FloorMaterialsSection } from '@/components/estimate/FloorMaterialsSection';
import type { StructuralItem } from '@/types/structural';
import type { TradeItem, TradeSelection } from '@/types/trades';
import { FinishingsSection } from '@/components/estimate/FinishingsSection';
import { StructuralSection } from '@/components/estimate/StructuralSection';
import { TradesSection } from '@/components/estimate/TradesSection';
import { MaterialsSection } from '@/components/estimate/MaterialsSection';
import { LaborSection } from '@/components/estimate/LaborSection';
import ShowerWallsLaborSection from '@/components/estimate/ShowerWallsLaborSection';
import ShowerWallsMaterialsSection from '@/components/estimate/ShowerWallsMaterialsSection';
import ShowerBaseLaborSection from '@/components/estimate/ShowerBaseLaborSection';
import ShowerBaseMaterialsSection from '@/components/estimate/ShowerBaseMaterialsSection';
import WorkflowSection from '@/components/estimate/WorkflowSection';
import { EstimateSummary } from '@/components/estimate/EstimateSummary';
import { useEstimate } from '@/contexts/EstimateContext';
import type { ConstructionCategory } from '@/contexts/EstimateContext';
import {
  useEstimateData,
  useSaveEstimateData,
} from '@/hooks/use-estimate-data';
import { Save } from 'lucide-react';

interface EstimatePageProps {
  projectId: string;
}

const CATEGORIES = [
  {
    id: 'demolition',
    name: 'Demolition',
    icon: Hammer,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'shower-walls',
    name: 'Shower Walls',
    icon: ShowerHead,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'shower-base',
    name: 'Shower Base',
    icon: ShowerBaseIcon,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'floors',
    name: 'Floors',
    icon: Layers,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'finishings',
    name: 'Finishings',
    icon: Paintbrush,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'structural',
    name: 'Structural',
    icon: StructuralIcon,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'trades',
    name: 'Trades',
    icon: TradeIcon,
    color: 'bg-gray-100 text-gray-600',
  },
];

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
  scope?: string;
}

interface FlatFeeItem {
  id: string;
  name: string;
  price: string;
}

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  unit: string;
  color?: string;
  scope?: string;
}

export function EstimatePage({ projectId }: EstimatePageProps) {
  const router = useRouter();
  const { data: project, isLoading } = useProject(projectId);
  const {
    activeSection,
    setActiveSection,
    selectedCategory,
    setSelectedCategory,
  } = useEstimate();

  // Save functionality
  const { data: savedData, isLoading: isLoadingData } =
    useEstimateData(projectId);
  const saveEstimateData = useSaveEstimateData();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [wasteNote] = useState('');

  // Demolition state
  const [demolitionChoices, setDemolitionChoices] = useState<DemolitionChoices>(
    {
      removeFlooring: 'no',
      removeShowerWall: 'no',
      removeShowerBase: 'no',
      removeTub: 'no',
      removeVanity: 'no',
      removeToilet: 'no',
      removeAccessories: 'no',
      removeWall: 'no',
    }
  );
  const [debrisDisposal, setDebrisDisposal] = useState<'yes' | 'no'>('no');
  const [demolitionNotes, setDemolitionNotes] = useState('');
  const [isDemolitionFlatFee, setIsDemolitionFlatFee] = useState<'yes' | 'no'>(
    'no'
  );
  const [flatFeeAmount, setFlatFeeAmount] = useState('');
  const [flatFeeDescription, setFlatFeeDescription] = useState(
    'Demolition & Debris Removal'
  );

  // Shower Base state
  const [showerBase, setShowerBase] = useState({
    measurements: {
      width: 0,
      length: 0,
    },
    design: {
      baseType: '',
      clientSuppliesBase: 'no',
      baseInstallationBy: 'me',
      entryType: 'curb',
      drainType: 'regular',
      drainLocation: 'center',
      notes: '',
    },
    construction: {
      tiledBaseSystem: '',
      repairSubfloor: false,
      modifyJoists: false,
      notes: '',
    },
  });

  // Shower Walls state
  const [showerWalls, setShowerWalls] = useState({
    walls: [
      {
        id: `wall-${Date.now()}-1`,
        name: 'Back Wall',
        height: { ft: 8, inch: 0 },
        width: { ft: 5, inch: 0 },
      },
      {
        id: `wall-${Date.now()}-2`,
        name: 'Left Wall',
        height: { ft: 8, inch: 0 },
        width: { ft: 3, inch: 0 },
      },
      {
        id: `wall-${Date.now()}-3`,
        name: 'Right Wall',
        height: { ft: 8, inch: 0 },
        width: { ft: 3, inch: 0 },
      },
    ],
    design: {
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
      clientSuppliesBase: 'No',
      repairWalls: false,
      reinsulateWalls: false,
    },
  });

  // Floor state
  const [floorData, setFloorData] = useState({
    measurements: {
      width: 0,
      length: 0,
      extraMeasurements: [] as Array<{
        id: number;
        label: string;
        width: number;
        length: number;
      }>,
    },
    design: {
      tilePattern: 'select_option',
      customPattern: '',
      selectedTileSizeOption: 'select_option',
      tileSize: { width: '', length: '' },
      notes: '',
      constructionNotes: '',
    },
    construction: {
      clientSuppliesTiles: false,
      selectedPrepTasks: [] as string[],
      plywoodThickness: '3/4',
      isHeatedFloor: false,
      heatedFloorType: 'schluter',
      customHeatedFloorName: '',
    },
  });

  // Finishings state
  const [finishingsData, setFinishingsData] = useState({
    designChoices: {
      dimensions: { width: '60', length: '96', height: '96' },
    },
    finishingsScope: {
      fixWalls: { selected: true },
      priming: { selected: true },
      paintWalls: { selected: true },
      paintCeiling: { selected: true },
      paintTrim: { selected: false },
      paintDoor: { selected: false },
      installBaseboard: { selected: false },
      installVanity: { selected: true, sinks: 1 },
      installLights: { selected: true, quantity: 2 },
      installAccessories: { selected: false },
      installMirror: { selected: true },
      installDoor: { selected: false },
      installToilet: { selected: true },
      installFan: { selected: true },
      installSinkFaucet: { selected: true, quantity: 1 },
      installShowerFaucet: { selected: false },
      installShowerDoor: { selected: false },
      installTubDrain: { selected: false },
      installShowerDrain: { selected: false },
      plumbingPerformedBy: 'me' as 'me' | 'trade',
      electricalPerformedBy: 'me' as 'me' | 'trade',
    },
    accentWalls: [
      {
        id: `aw-${Date.now()}`,
        dimensions: { width: '60', height: '96' },
        finishType: 'tile' as 'tile' | 'wainscot' | 'paint',
      },
    ],
  });

  // Structural state
  const [structuralData, setStructuralData] = useState({
    choices: {
      wall: [] as string[],
      floor: [] as string[],
      windowDoor: [] as string[],
      plywoodThickness: '3/4',
      notes: '',
    },
    laborItems: {
      wall: [] as StructuralItem[],
      floor: [] as StructuralItem[],
      windowDoor: [] as StructuralItem[],
    },
    materialItems: {
      wall: [] as StructuralItem[],
      floor: [] as StructuralItem[],
      windowDoor: [] as StructuralItem[],
    },
    taxRate: 13, // Default HST for Ontario, Canada
    contingencyRate: 10, // Default 10% contingency
  });

  // Trades state
  const [tradesData] = useState({
    choices: {
      demolition: [] as TradeSelection[],
      flooring: [] as TradeSelection[],
      plumbing: [] as TradeSelection[],
      electrical: [] as TradeSelection[],
      hvac: [] as TradeSelection[],
      notes: '',
    },
    laborItems: {
      demolition: [] as TradeItem[],
      flooring: [] as TradeItem[],
      plumbing: [] as TradeItem[],
      electrical: [] as TradeItem[],
      hvac: [] as TradeItem[],
    },
    materialItems: {
      demolition: [] as TradeItem[],
      flooring: [] as TradeItem[],
      plumbing: [] as TradeItem[],
      electrical: [] as TradeItem[],
      hvac: [] as TradeItem[],
    },
    tradeRates: {
      demolition: 75,
      flooring: 85,
      plumbing: 110,
      electrical: 95,
      hvac: 120,
    },
    province: 'ON',
  });

  // Project notes state
  const [projectNotes, setProjectNotes] = useState('');

  // Category-specific data structure for labor, materials, and estimates
  type CategoryWorkflowData = {
    labor: { laborItems: LaborItem[]; flatFeeItems: FlatFeeItem[] };
    materials: { constructionMaterials: MaterialItem[] };
    estimate: { projectNotes: string };
  };

  const [categoryWorkflowData, setCategoryWorkflowData] = useState<
    Record<ConstructionCategory, CategoryWorkflowData>
  >({
    demolition: {
      labor: { laborItems: [], flatFeeItems: [] },
      materials: { constructionMaterials: [] },
      estimate: { projectNotes: '' },
    },
    'shower-base': {
      labor: { laborItems: [], flatFeeItems: [] },
      materials: { constructionMaterials: [] },
      estimate: { projectNotes: '' },
    },
    'shower-walls': {
      labor: { laborItems: [], flatFeeItems: [] },
      materials: { constructionMaterials: [] },
      estimate: { projectNotes: '' },
    },
    floors: {
      labor: { laborItems: [], flatFeeItems: [] },
      materials: { constructionMaterials: [] },
      estimate: { projectNotes: '' },
    },
    finishings: {
      labor: { laborItems: [], flatFeeItems: [] },
      materials: { constructionMaterials: [] },
      estimate: { projectNotes: '' },
    },
    structural: {
      labor: { laborItems: [], flatFeeItems: [] },
      materials: { constructionMaterials: [] },
      estimate: { projectNotes: '' },
    },
    trades: {
      labor: { laborItems: [], flatFeeItems: [] },
      materials: { constructionMaterials: [] },
      estimate: { projectNotes: '' },
    },
  });

  // Memoized helper functions to get/set category-specific workflow data
  const getCategoryWorkflowData = useCallback(
    (
      category: ConstructionCategory,
      section: 'labor' | 'materials' | 'estimate'
    ) => {
      return categoryWorkflowData[category][section];
    },
    [categoryWorkflowData]
  );

  const updateCategoryWorkflowData = useCallback(
    (
      category: ConstructionCategory,
      section: 'labor' | 'materials' | 'estimate',
      data: CategoryWorkflowData[keyof CategoryWorkflowData]
    ) => {
      setCategoryWorkflowData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [section]: data,
        },
      }));
    },
    []
  );

  // Initialize category workflow data for new categories
  useEffect(() => {
    const categoriesToInit = [
      'floors',
      'finishings',
      'structural',
      'trades',
    ] as ConstructionCategory[];
    categoriesToInit.forEach((category) => {
      if (!categoryWorkflowData[category]) {
        setCategoryWorkflowData((prev) => ({
          ...prev,
          [category]: {
            labor: { laborItems: [], flatFeeItems: [] },
            materials: { constructionMaterials: [] },
            estimate: { projectNotes: '' },
          },
        }));
      }
    });
  }, [categoryWorkflowData]);

  // Memoized Labor Handlers - Category-specific
  const handleAddLaborItem = useCallback(
    (category: ConstructionCategory) => {
      const currentData = getCategoryWorkflowData(
        category,
        'labor'
      ) as CategoryWorkflowData['labor'];
      updateCategoryWorkflowData(category, 'labor', {
        ...currentData,
        laborItems: [
          ...currentData.laborItems,
          { id: `custom-${Date.now()}`, name: '', hours: '1', rate: '95' },
        ],
      });
    },
    [getCategoryWorkflowData, updateCategoryWorkflowData]
  );

  const handleDeleteLaborItem = useCallback(
    (category: ConstructionCategory, id: string) => {
      const currentData = getCategoryWorkflowData(
        category,
        'labor'
      ) as CategoryWorkflowData['labor'];
      updateCategoryWorkflowData(category, 'labor', {
        ...currentData,
        laborItems: currentData.laborItems.filter(
          (item: LaborItem) => item.id !== id
        ),
      });
    },
    [getCategoryWorkflowData, updateCategoryWorkflowData]
  );

  const handleLaborItemChange = useCallback(
    (
      category: ConstructionCategory,
      id: string,
      field: string,
      value: string
    ) => {
      const currentData = getCategoryWorkflowData(
        category,
        'labor'
      ) as CategoryWorkflowData['labor'];
      updateCategoryWorkflowData(category, 'labor', {
        ...currentData,
        laborItems: currentData.laborItems.map((item: LaborItem) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      });
    },
    [getCategoryWorkflowData, updateCategoryWorkflowData]
  );

  // Memoized Flat Fee Handlers - Category-specific
  const handleAddFlatFeeItem = useCallback(
    (category: ConstructionCategory) => {
      const currentData = getCategoryWorkflowData(
        category,
        'labor'
      ) as CategoryWorkflowData['labor'];
      updateCategoryWorkflowData(category, 'labor', {
        ...currentData,
        flatFeeItems: [
          ...currentData.flatFeeItems,
          { id: `flat-${Date.now()}`, name: '', price: '' },
        ],
      });
    },
    [getCategoryWorkflowData, updateCategoryWorkflowData]
  );

  const handleDeleteFlatFeeItem = useCallback(
    (category: ConstructionCategory, id: string) => {
      const currentData = getCategoryWorkflowData(
        category,
        'labor'
      ) as CategoryWorkflowData['labor'];
      updateCategoryWorkflowData(category, 'labor', {
        ...currentData,
        flatFeeItems: currentData.flatFeeItems.filter(
          (item: FlatFeeItem) => item.id !== id
        ),
      });
    },
    [getCategoryWorkflowData, updateCategoryWorkflowData]
  );

  const handleFlatFeeItemChange = useCallback(
    (
      category: ConstructionCategory,
      id: string,
      field: keyof FlatFeeItem,
      value: string
    ) => {
      const currentData = getCategoryWorkflowData(
        category,
        'labor'
      ) as CategoryWorkflowData['labor'];
      updateCategoryWorkflowData(category, 'labor', {
        ...currentData,
        flatFeeItems: currentData.flatFeeItems.map((item: FlatFeeItem) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      });
    },
    [getCategoryWorkflowData, updateCategoryWorkflowData]
  );

  // Memoized Supply Handlers - Category-specific
  const handleDeleteSupply = useCallback(
    (category: ConstructionCategory, id: string) => {
      const currentData = getCategoryWorkflowData(
        category,
        'materials'
      ) as CategoryWorkflowData['materials'];
      updateCategoryWorkflowData(category, 'materials', {
        constructionMaterials: currentData.constructionMaterials.filter(
          (item: MaterialItem) => item.id !== id
        ),
      });
    },
    [getCategoryWorkflowData, updateCategoryWorkflowData]
  );

  const handleAddMaterialItem = useCallback(
    (category: ConstructionCategory) => {
      const currentData = getCategoryWorkflowData(
        category,
        'materials'
      ) as CategoryWorkflowData['materials'];
      if (currentData) {
        const newItem = {
          id: crypto.randomUUID(),
          name: 'New Material',
          quantity: '1',
          price: '0',
          unit: 'each',
          color: undefined,
        };
        updateCategoryWorkflowData(category, 'materials', {
          ...currentData,
          constructionMaterials: [
            ...currentData.constructionMaterials,
            newItem,
          ],
        });
      }
    },
    [getCategoryWorkflowData, updateCategoryWorkflowData]
  );

  const handleMaterialItemChange = useCallback(
    (
      category: ConstructionCategory,
      id: string,
      field: string,
      value: string | number
    ) => {
      const currentData = getCategoryWorkflowData(
        category,
        'materials'
      ) as CategoryWorkflowData['materials'];
      if (currentData) {
        const updatedMaterials = currentData.constructionMaterials.map(
          (item: MaterialItem) => {
            if (item.id === id) {
              const updatedItem = { ...item, [field]: value.toString() };
              return updatedItem;
            }
            return item;
          }
        );
        updateCategoryWorkflowData(category, 'materials', {
          ...currentData,
          constructionMaterials: updatedMaterials,
        });
      }
    },
    [getCategoryWorkflowData, updateCategoryWorkflowData]
  );

  const handleDeleteMaterialItem = useCallback(
    (category: ConstructionCategory, id: string) => {
      const currentData = getCategoryWorkflowData(
        category,
        'materials'
      ) as CategoryWorkflowData['materials'];
      if (currentData) {
        updateCategoryWorkflowData(category, 'materials', {
          ...currentData,
          constructionMaterials: currentData.constructionMaterials.filter(
            (item: MaterialItem) => item.id !== id
          ),
        });
      }
    },
    [getCategoryWorkflowData, updateCategoryWorkflowData]
  );

  // Memoized calculation for category totals
  const categoryTotals = useMemo(() => {
    const totals: Record<ConstructionCategory, number> = {} as Record<
      ConstructionCategory,
      number
    >;

    Object.keys(categoryWorkflowData).forEach((category) => {
      const cat = category as ConstructionCategory;
      const laborData = categoryWorkflowData[cat].labor;
      const materialsData = categoryWorkflowData[cat].materials;

      // Calculate labor total (flat fee and hourly are mutually exclusive)
      const flatFeeTotal = laborData.flatFeeItems.reduce(
        (sum, item) => sum + (parseFloat(item.price) || 0),
        0
      );

      // If we have flat fee items, ignore hourly labor items (they are mutually exclusive)
      const hourlyLaborTotal =
        laborData.flatFeeItems.length > 0
          ? 0
          : laborData.laborItems.reduce(
              (sum, item) =>
                sum +
                (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
              0
            );

      const laborTotal = flatFeeTotal + hourlyLaborTotal;

      // Calculate materials total
      const materialsTotal = materialsData.constructionMaterials.reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

      totals[cat] = laborTotal + materialsTotal;
    });

    return totals;
  }, [categoryWorkflowData]);

  // Memoized grand total calculation - only include selected category for now
  // TODO: In the future, we might want to include all categories
  const grandTotal = useMemo(() => {
    return categoryTotals[selectedCategory] || 0;
  }, [categoryTotals, selectedCategory]);

  const renderWorkflowSection = (category: ConstructionCategory) => {
    const laborData = getCategoryWorkflowData(
      category,
      'labor'
    ) as CategoryWorkflowData['labor'];
    const materialsData = getCategoryWorkflowData(
      category,
      'materials'
    ) as CategoryWorkflowData['materials'];

    // Convert MaterialItem to WorkflowMaterialItem
    const workflowMaterials = materialsData.constructionMaterials.map(
      (item) => ({
        id: item.id,
        name: item.name,
        quantity: parseFloat(item.quantity) || 0,
        price: parseFloat(item.price) || 0,
        total: (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        scope: (item as MaterialItem & { scope?: string }).scope || category,
      })
    );

    return (
      <WorkflowSection
        category={category}
        laborItems={laborData.laborItems}
        materialItems={workflowMaterials}
        onAddLaborItem={() => handleAddLaborItem(category)}
        onLaborItemChange={(id, field, value) =>
          handleLaborItemChange(category, id, field, value)
        }
        onDeleteLaborItem={(id) => handleDeleteLaborItem(category, id)}
        onAddMaterialItem={() => handleAddMaterialItem(category)}
        onMaterialItemChange={(id, field, value) =>
          handleMaterialItemChange(category, id, field, value)
        }
        onDeleteMaterialItem={(id) => handleDeleteMaterialItem(category, id)}
        wasteNote={category === 'shower-walls' ? wasteNote : undefined}
      />
    );
  };

  // Load saved data when available
  useEffect(() => {
    if (savedData) {
      setDemolitionChoices(
        savedData.demolitionChoices || {
          removeFlooring: 'no',
          removeShowerWall: 'no',
          removeShowerBase: 'no',
          removeTub: 'no',
          removeVanity: 'no',
          removeToilet: 'no',
          removeAccessories: 'no',
          removeWall: 'no',
        }
      );
      setDebrisDisposal(savedData.debrisDisposal || 'no');
      setIsDemolitionFlatFee(savedData.isDemolitionFlatFee || 'no');
      setFlatFeeAmount(savedData.flatFeeAmount || '');
      setFlatFeeDescription(
        savedData.flatFeeDescription || 'Demolition & Debris Removal'
      );
      setDemolitionNotes(savedData.demolitionNotes || '');
      setProjectNotes(savedData.projectNotes || '');

      // Load category workflow data if available
      if (savedData.categoryWorkflowData) {
        setCategoryWorkflowData(savedData.categoryWorkflowData);
      }
    }
  }, [savedData]);

  // Memoized manual save function
  const handleManualSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveEstimateData.mutateAsync({
        projectId,
        data: {
          demolitionChoices,
          debrisDisposal,
          isDemolitionFlatFee,
          flatFeeAmount,
          flatFeeDescription,
          demolitionNotes,
          projectNotes,
          categoryWorkflowData,
        },
      });
      setSaveError(null);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveError('Save failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [
    saveEstimateData,
    projectId,
    demolitionChoices,
    debrisDisposal,
    isDemolitionFlatFee,
    flatFeeAmount,
    flatFeeDescription,
    demolitionNotes,
    projectNotes,
    categoryWorkflowData,
  ]);

  if (isLoading || isLoadingData) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!project) {
    router.push('/');
    return null;
  }

  return (
    <div className='bg-white min-h-screen'>
      {/* Project Header */}
      <div className='p-4 sm:p-6 lg:p-8 border-b border-slate-200 max-w-7xl mx-auto'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <h1 className='text-xl font-bold text-slate-800'>
              {project.project_name}
            </h1>
          </div>
          <div className='flex items-center space-x-2'>
            {!isSaving ? (
              <Button
                onClick={handleManualSave}
                disabled={isSaving}
                size='sm'
                className={`${
                  saveError
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Save size={16} />
              </Button>
            ) : (
              <div className='flex items-center justify-center p-2'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
              </div>
            )}
            <Button
              onClick={() => router.back()}
              variant='ghost'
              size='sm'
              title='Back'
              aria-label='Go back'
              className='p-3 sm:p-2'
            >
              <ArrowLeft size={28} className='sm:w-[20px] sm:h-[20px]' />
            </Button>
          </div>
        </div>
        <p className='text-sm text-slate-600 ml-8'>{project.client_name}</p>
      </div>

      {/* Top Navigation for Construction Categories - Always visible */}
      <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
        <div className='flex space-x-4 overflow-x-auto pb-2'>
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id as ConstructionCategory);
                  setActiveSection('design'); // Reset bottom nav to scope when changing category
                }}
                className={`flex-shrink-0 w-24 h-20 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <Icon
                  size={24}
                  className={isSelected ? 'text-blue-600' : 'text-gray-600'}
                />
                <span
                  className={`text-xs font-medium ${
                    isSelected ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className='p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto'>
        {/* Demolition Category - Complete Workflow */}
        {selectedCategory === 'demolition' && (
          <>
            {activeSection === 'design' && (
              <DemolitionSection
                demolitionChoices={demolitionChoices}
                setDemolitionChoices={setDemolitionChoices}
                debrisDisposal={debrisDisposal}
                setDebrisDisposal={setDebrisDisposal}
                isDemolitionFlatFee={isDemolitionFlatFee}
                setIsDemolitionFlatFee={setIsDemolitionFlatFee}
                flatFeeAmount={flatFeeAmount}
                setFlatFeeAmount={setFlatFeeAmount}
                flatFeeDescription={flatFeeDescription}
                setFlatFeeDescription={setFlatFeeDescription}
                demolitionNotes={demolitionNotes}
                setDemolitionNotes={setDemolitionNotes}
                laborItems={
                  (
                    getCategoryWorkflowData(
                      'demolition',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).laborItems
                }
                setLaborItems={(items) =>
                  updateCategoryWorkflowData('demolition', 'labor', {
                    ...(getCategoryWorkflowData(
                      'demolition',
                      'labor'
                    ) as CategoryWorkflowData['labor']),
                    laborItems: items,
                  })
                }
                flatFeeItems={
                  (
                    getCategoryWorkflowData(
                      'demolition',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).flatFeeItems
                }
                setFlatFeeItems={(items) =>
                  updateCategoryWorkflowData('demolition', 'labor', {
                    ...(getCategoryWorkflowData(
                      'demolition',
                      'labor'
                    ) as CategoryWorkflowData['labor']),
                    flatFeeItems: items,
                  })
                }
                constructionMaterials={
                  (
                    getCategoryWorkflowData(
                      'demolition',
                      'materials'
                    ) as CategoryWorkflowData['materials']
                  ).constructionMaterials
                }
                setConstructionMaterials={(items) =>
                  updateCategoryWorkflowData('demolition', 'materials', {
                    ...(getCategoryWorkflowData(
                      'demolition',
                      'materials'
                    ) as CategoryWorkflowData['materials']),
                    constructionMaterials: items,
                  })
                }
              />
            )}
            {activeSection === 'labor' && (
              <LaborSection
                laborItems={
                  (
                    getCategoryWorkflowData(
                      'demolition',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).laborItems
                }
                setLaborItems={(items) =>
                  updateCategoryWorkflowData('demolition', 'labor', {
                    ...(getCategoryWorkflowData(
                      'demolition',
                      'labor'
                    ) as CategoryWorkflowData['labor']),
                    laborItems: items,
                  })
                }
                flatFeeItems={
                  (
                    getCategoryWorkflowData(
                      'demolition',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).flatFeeItems
                }
                setFlatFeeItems={(items) =>
                  updateCategoryWorkflowData('demolition', 'labor', {
                    ...(getCategoryWorkflowData(
                      'demolition',
                      'labor'
                    ) as CategoryWorkflowData['labor']),
                    flatFeeItems: items,
                  })
                }
                handleAddLaborItem={() => handleAddLaborItem('demolition')}
                handleLaborItemChange={(id, field, value) =>
                  handleLaborItemChange('demolition', id, field, value)
                }
                handleDeleteLaborItem={(id) =>
                  handleDeleteLaborItem('demolition', id)
                }
                handleAddFlatFeeItem={() => handleAddFlatFeeItem('demolition')}
                handleFlatFeeItemChange={(id, field, value) =>
                  handleFlatFeeItemChange('demolition', id, field, value)
                }
                handleDeleteFlatFeeItem={(id) =>
                  handleDeleteFlatFeeItem('demolition', id)
                }
                isDemolitionFlatFee={isDemolitionFlatFee}
              />
            )}
            {activeSection === 'materials' && (
              <MaterialsSection
                constructionMaterials={
                  (
                    getCategoryWorkflowData(
                      'demolition',
                      'materials'
                    ) as CategoryWorkflowData['materials']
                  ).constructionMaterials
                }
                setConstructionMaterials={(materials) =>
                  updateCategoryWorkflowData('demolition', 'materials', {
                    constructionMaterials: materials,
                  })
                }
                handleDeleteSupply={(id) =>
                  handleDeleteSupply('demolition', id)
                }
              />
            )}
            {activeSection === 'estimate' && (
              <EstimateSummary
                total={grandTotal}
                notes={
                  (
                    getCategoryWorkflowData(
                      'demolition',
                      'estimate'
                    ) as CategoryWorkflowData['estimate']
                  ).projectNotes
                }
                setNotes={(notes) =>
                  updateCategoryWorkflowData('demolition', 'estimate', {
                    projectNotes: notes,
                  })
                }
              />
            )}
          </>
        )}

        {/* Shower Base Category - Complete Workflow */}
        {selectedCategory === 'shower-base' && (
          <>
            {/* Auto-update labor and materials based on shower base design changes */}
            <ShowerBaseAutoUpdate
              measurements={showerBase.measurements}
              design={showerBase.design}
              construction={showerBase.construction}
              currentLaborItems={
                (
                  getCategoryWorkflowData(
                    'shower-base',
                    'labor'
                  ) as CategoryWorkflowData['labor']
                ).laborItems
              }
              currentMaterialItems={
                (
                  getCategoryWorkflowData(
                    'shower-base',
                    'materials'
                  ) as CategoryWorkflowData['materials']
                ).constructionMaterials
              }
              onUpdateLabor={(items) =>
                updateCategoryWorkflowData('shower-base', 'labor', {
                  ...(getCategoryWorkflowData(
                    'shower-base',
                    'labor'
                  ) as CategoryWorkflowData['labor']),
                  laborItems: items,
                })
              }
              onUpdateMaterials={(items) =>
                updateCategoryWorkflowData('shower-base', 'materials', {
                  constructionMaterials: items,
                })
              }
            />

            {activeSection === 'design' && (
              <ShowerBaseSection
                measurements={showerBase.measurements}
                setMeasurements={(measurements) =>
                  setShowerBase((prev) => ({ ...prev, measurements }))
                }
                design={showerBase.design}
                setDesign={(design) =>
                  setShowerBase((prev) => ({
                    ...prev,
                    design:
                      typeof design === 'function'
                        ? design(prev.design)
                        : design,
                  }))
                }
                construction={showerBase.construction}
                setConstruction={(construction) =>
                  setShowerBase((prev) => ({
                    ...prev,
                    construction:
                      typeof construction === 'function'
                        ? construction(prev.construction)
                        : construction,
                  }))
                }
              />
            )}
            {activeSection === 'labor' && (
              <ShowerBaseLaborSection
                laborItems={
                  (
                    getCategoryWorkflowData(
                      'shower-base',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).laborItems
                }
                onAddLaborItem={() => handleAddLaborItem('shower-base')}
                onLaborItemChange={(id, field, value) =>
                  handleLaborItemChange('shower-base', id, field, value)
                }
                onDeleteLaborItem={(id) =>
                  handleDeleteLaborItem('shower-base', id)
                }
              />
            )}
            {activeSection === 'materials' && (
              <ShowerBaseMaterialsSection
                materialItems={
                  (
                    getCategoryWorkflowData(
                      'shower-base',
                      'materials'
                    ) as CategoryWorkflowData['materials']
                  ).constructionMaterials
                }
                onAddMaterialItem={() => handleAddMaterialItem('shower-base')}
                onMaterialItemChange={(id, field, value) =>
                  handleMaterialItemChange('shower-base', id, field, value)
                }
                onDeleteMaterialItem={(id) =>
                  handleDeleteMaterialItem('shower-base', id)
                }
              />
            )}
            {activeSection === 'estimate' && (
              <EstimateSummary
                total={grandTotal}
                notes={
                  (
                    getCategoryWorkflowData(
                      'shower-base',
                      'estimate'
                    ) as CategoryWorkflowData['estimate']
                  ).projectNotes
                }
                setNotes={(notes) =>
                  updateCategoryWorkflowData('shower-base', 'estimate', {
                    projectNotes: notes,
                  })
                }
              />
            )}
          </>
        )}

        {/* Auto-update labor and materials based on shower walls design changes */}
        <ShowerWallsAutoUpdate
          walls={showerWalls.walls}
          design={showerWalls.design}
          currentLaborItems={
            (
              getCategoryWorkflowData(
                'shower-walls',
                'labor'
              ) as CategoryWorkflowData['labor']
            ).laborItems
          }
          currentMaterialItems={
            (
              getCategoryWorkflowData(
                'shower-walls',
                'materials'
              ) as CategoryWorkflowData['materials']
            ).constructionMaterials
          }
          onUpdateLabor={(items) =>
            updateCategoryWorkflowData('shower-walls', 'labor', {
              ...(getCategoryWorkflowData(
                'shower-walls',
                'labor'
              ) as CategoryWorkflowData['labor']),
              laborItems: items,
            })
          }
          onUpdateMaterials={(items) =>
            updateCategoryWorkflowData('shower-walls', 'materials', {
              constructionMaterials: items,
            })
          }
        />

        {/* Shower Walls Category - Complete Workflow */}
        {selectedCategory === 'shower-walls' && (
          <>
            {activeSection === 'design' && (
              <ShowerWallsSection
                walls={showerWalls.walls}
                setWalls={(walls) =>
                  setShowerWalls((prev) => ({
                    ...prev,
                    walls:
                      typeof walls === 'function' ? walls(prev.walls) : walls,
                  }))
                }
                design={showerWalls.design}
                setDesign={(design) =>
                  setShowerWalls((prev) => ({
                    ...prev,
                    design:
                      typeof design === 'function'
                        ? design(prev.design)
                        : design,
                  }))
                }
                wasteNote={undefined}
              />
            )}
            {/* ShowerWallsAutoUpdate - Always active to update labor/materials */}
            <ShowerWallsAutoUpdate
              walls={showerWalls.walls}
              design={showerWalls.design}
              currentLaborItems={
                (
                  getCategoryWorkflowData(
                    'shower-walls',
                    'labor'
                  ) as CategoryWorkflowData['labor']
                ).laborItems
              }
              currentMaterialItems={
                (
                  getCategoryWorkflowData(
                    'shower-walls',
                    'materials'
                  ) as CategoryWorkflowData['materials']
                ).constructionMaterials
              }
              onUpdateLabor={(items) =>
                updateCategoryWorkflowData('shower-walls', 'labor', {
                  ...(getCategoryWorkflowData(
                    'shower-walls',
                    'labor'
                  ) as CategoryWorkflowData['labor']),
                  laborItems: items,
                })
              }
              onUpdateMaterials={(items) =>
                updateCategoryWorkflowData('shower-walls', 'materials', {
                  ...(getCategoryWorkflowData(
                    'shower-walls',
                    'materials'
                  ) as CategoryWorkflowData['materials']),
                  constructionMaterials: items,
                })
              }
            />

            {activeSection === 'labor' &&
              selectedCategory === 'shower-walls' && (
                <ShowerWallsLaborSection
                  laborItems={
                    (
                      getCategoryWorkflowData(
                        'shower-walls',
                        'labor'
                      ) as CategoryWorkflowData['labor']
                    ).laborItems
                  }
                  onAddLaborItem={() => handleAddLaborItem('shower-walls')}
                  onLaborItemChange={(id, field, value) =>
                    handleLaborItemChange('shower-walls', id, field, value)
                  }
                  onDeleteLaborItem={(id) =>
                    handleDeleteLaborItem('shower-walls', id)
                  }
                />
              )}
            {activeSection === 'labor' &&
              selectedCategory !== 'shower-walls' &&
              renderWorkflowSection(selectedCategory)}
            {activeSection === 'materials' &&
              selectedCategory === 'shower-walls' && (
                <ShowerWallsMaterialsSection
                  materialItems={
                    (
                      getCategoryWorkflowData(
                        'shower-walls',
                        'materials'
                      ) as CategoryWorkflowData['materials']
                    ).constructionMaterials
                  }
                  onAddMaterialItem={() =>
                    handleAddMaterialItem('shower-walls')
                  }
                  onMaterialItemChange={(id, field, value) =>
                    handleMaterialItemChange('shower-walls', id, field, value)
                  }
                  onDeleteMaterialItem={(id) =>
                    handleDeleteMaterialItem('shower-walls', id)
                  }
                />
              )}
            {activeSection === 'materials' &&
              selectedCategory !== 'shower-walls' &&
              renderWorkflowSection(selectedCategory)}
            {activeSection === 'estimate' && (
              <EstimateSummary
                total={grandTotal}
                notes={
                  (
                    getCategoryWorkflowData(
                      'shower-walls',
                      'estimate'
                    ) as CategoryWorkflowData['estimate']
                  ).projectNotes
                }
                setNotes={(notes) =>
                  updateCategoryWorkflowData('shower-walls', 'estimate', {
                    projectNotes: notes,
                  })
                }
              />
            )}
          </>
        )}

        {/* Floor Category - Complete Workflow */}
        {selectedCategory === 'floors' && (
          <>
            {/* Auto-update labor and materials based on floor design changes */}
            <FloorAutoUpdate
              measurements={floorData.measurements}
              design={floorData.design}
              construction={floorData.construction}
              currentLaborItems={
                (
                  getCategoryWorkflowData(
                    'floors',
                    'labor'
                  ) as CategoryWorkflowData['labor']
                ).laborItems
              }
              currentMaterialItems={
                (
                  getCategoryWorkflowData(
                    'floors',
                    'materials'
                  ) as CategoryWorkflowData['materials']
                ).constructionMaterials
              }
              onUpdateLabor={(items) =>
                updateCategoryWorkflowData('floors', 'labor', {
                  ...(getCategoryWorkflowData(
                    'floors',
                    'labor'
                  ) as CategoryWorkflowData['labor']),
                  laborItems: items,
                })
              }
              onUpdateMaterials={(items) =>
                updateCategoryWorkflowData('floors', 'materials', {
                  constructionMaterials: items,
                })
              }
            />

            {activeSection === 'design' && (
              <FloorSection
                measurements={floorData.measurements}
                setMeasurements={(measurements) =>
                  setFloorData((prev) => ({
                    ...prev,
                    measurements:
                      typeof measurements === 'function'
                        ? measurements(prev.measurements)
                        : measurements,
                  }))
                }
                design={floorData.design}
                setDesign={(design) =>
                  setFloorData((prev) => ({
                    ...prev,
                    design:
                      typeof design === 'function'
                        ? design(prev.design)
                        : design,
                  }))
                }
                construction={floorData.construction}
                setConstruction={(construction) =>
                  setFloorData((prev) => ({
                    ...prev,
                    construction:
                      typeof construction === 'function'
                        ? construction(prev.construction)
                        : construction,
                  }))
                }
              />
            )}
            {activeSection === 'labor' && (
              <FloorLaborSection
                laborItems={
                  (
                    getCategoryWorkflowData(
                      'floors',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).laborItems
                }
                onAddLaborItem={() => handleAddLaborItem('floors')}
                onLaborItemChange={(id, field, value) =>
                  handleLaborItemChange('floors', id, field, value)
                }
                onDeleteLaborItem={(id) => handleDeleteLaborItem('floors', id)}
              />
            )}
            {activeSection === 'materials' && (
              <FloorMaterialsSection
                materialItems={
                  (
                    getCategoryWorkflowData(
                      'floors',
                      'materials'
                    ) as CategoryWorkflowData['materials']
                  ).constructionMaterials
                }
                onAddMaterialItem={() => handleAddMaterialItem('floors')}
                onMaterialItemChange={(id, field, value) =>
                  handleMaterialItemChange('floors', id, field, value)
                }
                onDeleteMaterialItem={(id) =>
                  handleDeleteMaterialItem('floors', id)
                }
              />
            )}
            {activeSection === 'estimate' && (
              <EstimateSummary
                total={grandTotal}
                notes={
                  (
                    getCategoryWorkflowData(
                      'floors',
                      'estimate'
                    ) as CategoryWorkflowData['estimate']
                  ).projectNotes
                }
                setNotes={(notes) =>
                  updateCategoryWorkflowData('floors', 'estimate', {
                    projectNotes: notes,
                  })
                }
              />
            )}
          </>
        )}

        {/* Finishings Category - Complete Workflow */}
        {selectedCategory === 'finishings' && (
          <>
            {activeSection === 'design' && (
              <FinishingsSection
                designChoices={finishingsData.designChoices}
                setDesignChoices={(choices) =>
                  setFinishingsData((prev) => ({
                    ...prev,
                    designChoices:
                      typeof choices === 'function'
                        ? choices(prev.designChoices)
                        : choices,
                  }))
                }
                finishingsScope={finishingsData.finishingsScope}
                setFinishingsScope={(scope) =>
                  setFinishingsData((prev) => ({
                    ...prev,
                    finishingsScope:
                      typeof scope === 'function'
                        ? scope(prev.finishingsScope)
                        : scope,
                  }))
                }
                accentWalls={finishingsData.accentWalls}
                setAccentWalls={(walls) =>
                  setFinishingsData((prev) => ({
                    ...prev,
                    accentWalls:
                      typeof walls === 'function'
                        ? walls(prev.accentWalls)
                        : walls,
                  }))
                }
              />
            )}
            {activeSection === 'labor' && (
              <LaborSection
                laborItems={
                  (
                    getCategoryWorkflowData(
                      'finishings',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).laborItems
                }
                setLaborItems={(items) =>
                  updateCategoryWorkflowData('finishings', 'labor', {
                    ...(getCategoryWorkflowData(
                      'finishings',
                      'labor'
                    ) as CategoryWorkflowData['labor']),
                    laborItems: items,
                  })
                }
                flatFeeItems={
                  (
                    getCategoryWorkflowData(
                      'finishings',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).flatFeeItems
                }
                setFlatFeeItems={(items) =>
                  updateCategoryWorkflowData('finishings', 'labor', {
                    ...(getCategoryWorkflowData(
                      'finishings',
                      'labor'
                    ) as CategoryWorkflowData['labor']),
                    flatFeeItems: items,
                  })
                }
                handleAddLaborItem={() => handleAddLaborItem('finishings')}
                handleLaborItemChange={(id, field, value) =>
                  handleLaborItemChange('finishings', id, field, value)
                }
                handleDeleteLaborItem={(id) =>
                  handleDeleteLaborItem('finishings', id)
                }
                handleAddFlatFeeItem={() => handleAddFlatFeeItem('finishings')}
                handleFlatFeeItemChange={(id, field, value) =>
                  handleFlatFeeItemChange('finishings', id, field, value)
                }
                handleDeleteFlatFeeItem={(id) =>
                  handleDeleteFlatFeeItem('finishings', id)
                }
                isDemolitionFlatFee={'no'}
              />
            )}
            {activeSection === 'materials' && (
              <MaterialsSection
                constructionMaterials={
                  (
                    getCategoryWorkflowData(
                      'finishings',
                      'materials'
                    ) as CategoryWorkflowData['materials']
                  ).constructionMaterials
                }
                setConstructionMaterials={(materials) =>
                  updateCategoryWorkflowData('finishings', 'materials', {
                    constructionMaterials: materials,
                  })
                }
                handleDeleteSupply={(id) =>
                  handleDeleteSupply('finishings', id)
                }
              />
            )}
            {activeSection === 'estimate' && (
              <EstimateSummary
                total={grandTotal}
                notes={
                  (
                    getCategoryWorkflowData(
                      'finishings',
                      'estimate'
                    ) as CategoryWorkflowData['estimate']
                  ).projectNotes
                }
                setNotes={(notes) =>
                  updateCategoryWorkflowData('finishings', 'estimate', {
                    projectNotes: notes,
                  })
                }
              />
            )}
          </>
        )}

        {/* Structural Category - Complete Workflow */}
        {selectedCategory === 'structural' && (
          <>
            {activeSection === 'design' && (
              <StructuralSection
                choices={structuralData.choices}
                onTaskToggle={(category, taskId) => {
                  // Handle task toggle logic here
                  console.log('Task toggle:', category, taskId);
                }}
                onPlywoodChange={(thickness) => {
                  setStructuralData((prev) => ({
                    ...prev,
                    choices: { ...prev.choices, plywoodThickness: thickness },
                  }));
                }}
                onNotesChange={(notes) => {
                  setStructuralData((prev) => ({
                    ...prev,
                    choices: { ...prev.choices, notes },
                  }));
                }}
              />
            )}
            {activeSection === 'labor' && (
              <LaborSection
                laborItems={
                  (
                    getCategoryWorkflowData(
                      'structural',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).laborItems
                }
                setLaborItems={(items) =>
                  updateCategoryWorkflowData('structural', 'labor', {
                    ...(getCategoryWorkflowData(
                      'structural',
                      'labor'
                    ) as CategoryWorkflowData['labor']),
                    laborItems: items,
                  })
                }
                flatFeeItems={
                  (
                    getCategoryWorkflowData(
                      'structural',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).flatFeeItems
                }
                setFlatFeeItems={(items) =>
                  updateCategoryWorkflowData('structural', 'labor', {
                    ...(getCategoryWorkflowData(
                      'structural',
                      'labor'
                    ) as CategoryWorkflowData['labor']),
                    flatFeeItems: items,
                  })
                }
                handleAddLaborItem={() => handleAddLaborItem('structural')}
                handleLaborItemChange={(id, field, value) =>
                  handleLaborItemChange('structural', id, field, value)
                }
                handleDeleteLaborItem={(id) =>
                  handleDeleteLaborItem('structural', id)
                }
                handleAddFlatFeeItem={() => handleAddFlatFeeItem('structural')}
                handleFlatFeeItemChange={(id, field, value) =>
                  handleFlatFeeItemChange('structural', id, field, value)
                }
                handleDeleteFlatFeeItem={(id) =>
                  handleDeleteFlatFeeItem('structural', id)
                }
                isDemolitionFlatFee={'no'}
              />
            )}
            {activeSection === 'materials' && (
              <MaterialsSection
                constructionMaterials={
                  (
                    getCategoryWorkflowData(
                      'structural',
                      'materials'
                    ) as CategoryWorkflowData['materials']
                  ).constructionMaterials
                }
                setConstructionMaterials={(materials) =>
                  updateCategoryWorkflowData('structural', 'materials', {
                    constructionMaterials: materials,
                  })
                }
                handleDeleteSupply={(id) =>
                  handleDeleteSupply('structural', id)
                }
              />
            )}
            {activeSection === 'estimate' && (
              <EstimateSummary
                total={grandTotal}
                notes={
                  (
                    getCategoryWorkflowData(
                      'structural',
                      'estimate'
                    ) as CategoryWorkflowData['estimate']
                  ).projectNotes
                }
                setNotes={(notes) =>
                  updateCategoryWorkflowData('structural', 'estimate', {
                    projectNotes: notes,
                  })
                }
              />
            )}
          </>
        )}

        {/* Trades Category - Complete Workflow */}
        {selectedCategory === 'trades' && (
          <>
            {activeSection === 'design' && (
              <TradesSection
                choices={tradesData.choices}
                onTaskChange={(category, taskId, hasQuantity, newQuantity) => {
                  // Handle task change logic here
                  console.log(
                    'Task change:',
                    category,
                    taskId,
                    hasQuantity,
                    newQuantity
                  );
                }}
              />
            )}
            {activeSection === 'labor' && (
              <LaborSection
                laborItems={
                  (
                    getCategoryWorkflowData(
                      'trades',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).laborItems
                }
                setLaborItems={(items) =>
                  updateCategoryWorkflowData('trades', 'labor', {
                    ...(getCategoryWorkflowData(
                      'trades',
                      'labor'
                    ) as CategoryWorkflowData['labor']),
                    laborItems: items,
                  })
                }
                flatFeeItems={
                  (
                    getCategoryWorkflowData(
                      'trades',
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).flatFeeItems
                }
                setFlatFeeItems={(items) =>
                  updateCategoryWorkflowData('trades', 'labor', {
                    ...(getCategoryWorkflowData(
                      'trades',
                      'labor'
                    ) as CategoryWorkflowData['labor']),
                    flatFeeItems: items,
                  })
                }
                handleAddLaborItem={() => handleAddLaborItem('trades')}
                handleLaborItemChange={(id, field, value) =>
                  handleLaborItemChange('trades', id, field, value)
                }
                handleDeleteLaborItem={(id) =>
                  handleDeleteLaborItem('trades', id)
                }
                handleAddFlatFeeItem={() => handleAddFlatFeeItem('trades')}
                handleFlatFeeItemChange={(id, field, value) =>
                  handleFlatFeeItemChange('trades', id, field, value)
                }
                handleDeleteFlatFeeItem={(id) =>
                  handleDeleteFlatFeeItem('trades', id)
                }
                isDemolitionFlatFee={'no'}
              />
            )}
            {activeSection === 'materials' && (
              <MaterialsSection
                constructionMaterials={
                  (
                    getCategoryWorkflowData(
                      'trades',
                      'materials'
                    ) as CategoryWorkflowData['materials']
                  ).constructionMaterials
                }
                setConstructionMaterials={(materials) =>
                  updateCategoryWorkflowData('trades', 'materials', {
                    constructionMaterials: materials,
                  })
                }
                handleDeleteSupply={(id) => handleDeleteSupply('trades', id)}
              />
            )}
            {activeSection === 'estimate' && (
              <EstimateSummary
                total={grandTotal}
                notes={
                  (
                    getCategoryWorkflowData(
                      'trades',
                      'estimate'
                    ) as CategoryWorkflowData['estimate']
                  ).projectNotes
                }
                setNotes={(notes) =>
                  updateCategoryWorkflowData('trades', 'estimate', {
                    projectNotes: notes,
                  })
                }
              />
            )}
          </>
        )}

        {/* Other Categories - Complete Workflow */}
        {![
          'demolition',
          'shower-base',
          'shower-walls',
          'floors',
          'finishings',
          'structural',
          'trades',
        ].includes(selectedCategory) && (
          <>
            {activeSection === 'design' && (
              <div className='space-y-6'>
                <Card>
                  <CardContent className='p-6 text-center'>
                    <h2 className='text-lg font-semibold mb-2'>
                      {
                        CATEGORIES.find((cat) => cat.id === selectedCategory)
                          ?.name
                      }{' '}
                      Scope
                    </h2>
                    <p className='text-slate-500 mb-4'>
                      {
                        CATEGORIES.find((cat) => cat.id === selectedCategory)
                          ?.name
                      }{' '}
                      scope section coming soon!
                    </p>
                    <div className='text-sm text-slate-400'>
                      This will contain the specific scope details for this
                      category.
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {activeSection === 'labor' && (
              <LaborSection
                laborItems={
                  (
                    getCategoryWorkflowData(
                      selectedCategory,
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).laborItems
                }
                setLaborItems={(items) =>
                  updateCategoryWorkflowData(selectedCategory, 'labor', {
                    ...getCategoryWorkflowData(selectedCategory, 'labor'),
                    laborItems: items,
                  })
                }
                flatFeeItems={
                  (
                    getCategoryWorkflowData(
                      selectedCategory,
                      'labor'
                    ) as CategoryWorkflowData['labor']
                  ).flatFeeItems
                }
                setFlatFeeItems={(items) =>
                  updateCategoryWorkflowData(selectedCategory, 'labor', {
                    ...getCategoryWorkflowData(selectedCategory, 'labor'),
                    flatFeeItems: items,
                  })
                }
                handleAddLaborItem={() => handleAddLaborItem(selectedCategory)}
                handleLaborItemChange={(id, field, value) =>
                  handleLaborItemChange(selectedCategory, id, field, value)
                }
                handleDeleteLaborItem={(id) =>
                  handleDeleteLaborItem(selectedCategory, id)
                }
                handleAddFlatFeeItem={() =>
                  handleAddFlatFeeItem(selectedCategory)
                }
                handleFlatFeeItemChange={(id, field, value) =>
                  handleFlatFeeItemChange(selectedCategory, id, field, value)
                }
                handleDeleteFlatFeeItem={(id) =>
                  handleDeleteFlatFeeItem(selectedCategory, id)
                }
                isDemolitionFlatFee={'no'}
              />
            )}
            {activeSection === 'materials' &&
              selectedCategory !== 'shower-walls' &&
              renderWorkflowSection(selectedCategory)}
            {activeSection === 'estimate' && (
              <EstimateSummary
                total={grandTotal}
                notes={
                  (
                    getCategoryWorkflowData(
                      selectedCategory,
                      'estimate'
                    ) as CategoryWorkflowData['estimate']
                  ).projectNotes
                }
                setNotes={(notes) =>
                  updateCategoryWorkflowData(selectedCategory, 'estimate', {
                    projectNotes: notes,
                  })
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
