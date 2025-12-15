/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useEstimateData } from '@/hooks/useEstimateData';
import { useSaveEstimate, useLoadEstimate } from '@/hooks/useEstimateSupabase';
import { useContractor } from '@/hooks/use-contractor';
import { supabase } from '@/lib/supabase';
import {
  DEMOLITION_LABOR_ITEMS,
  DEMOLITION_MATERIALS_ITEMS,
  SHOWER_BASE_LABOR_ITEMS,
  SHOWER_BASE_MATERIALS_ITEMS,
  FLOORS_LABOR_ITEMS,
  FLOORS_MATERIALS_ITEMS,
  FLOORS_CONFIG,
  HEATED_FLOOR_CONFIG,
} from '@/lib/constants';
import {
  EstimateData,
  WorkflowType,
  WorkflowData,
  LaborItem,
  MaterialItem,
  FlatFeeItem,
  WorkflowNotes,
} from '@/types/estimate';
import type { ShowerWallsDesign } from '@/lib/shower-walls-calculator';

interface EstimateWorkflowContextType {
  // Data
  estimateData: EstimateData;
  isLoading: boolean;
  isSaving: boolean;
  isReloading: boolean;
  error: string | null;
  lastSaved: Date | null;

  // Workflow data getters
  getWorkflowData: (workflowType: WorkflowType) => WorkflowData | null;
  getDesignData: <T = unknown>(workflowType: WorkflowType) => T | null;
  getLaborItems: (workflowType: WorkflowType) => LaborItem[];
  getFlatFeeItems: (workflowType: WorkflowType) => FlatFeeItem[];
  getMaterialItems: (workflowType: WorkflowType) => MaterialItem[];
  getNotes: (workflowType: WorkflowType) => WorkflowNotes | null;

  // Design updates
  updateDesign: <T = unknown>(
    workflowType: WorkflowType,
    updates: Partial<T>
  ) => void;

  // Labor updates
  addLaborItem: (
    workflowType: WorkflowType,
    item: Omit<LaborItem, 'id'>
  ) => void;
  updateLaborItem: (
    workflowType: WorkflowType,
    id: string,
    updates: Partial<LaborItem>
  ) => void;
  deleteLaborItem: (workflowType: WorkflowType, id: string) => void;
  setLaborItems: (workflowType: WorkflowType, items: LaborItem[]) => void;

  // Flat fee updates
  addFlatFeeItem: (
    workflowType: WorkflowType,
    item: Omit<FlatFeeItem, 'id'>
  ) => void;
  updateFlatFeeItem: (
    workflowType: WorkflowType,
    id: string,
    updates: Partial<FlatFeeItem>
  ) => void;
  deleteFlatFeeItem: (workflowType: WorkflowType, id: string) => void;
  setFlatFeeItems: (workflowType: WorkflowType, items: FlatFeeItem[]) => void;

  // Material updates
  addMaterialItem: (
    workflowType: WorkflowType,
    item: Omit<MaterialItem, 'id'>
  ) => void;
  updateMaterialItem: (
    workflowType: WorkflowType,
    id: string,
    updates: Partial<MaterialItem>
  ) => void;
  deleteMaterialItem: (workflowType: WorkflowType, id: string) => void;
  setMaterialItems: (workflowType: WorkflowType, items: MaterialItem[]) => void;

  // Notes updates
  updateNotes: (
    workflowType: WorkflowType,
    notes: Partial<WorkflowNotes>
  ) => void;

  // Persistence
  saveData: () => Promise<void>;
  loadData: () => Promise<void>;

  // Totals
  getWorkflowTotals: (workflowType: WorkflowType) => {
    laborTotal: number;
    materialsTotal: number;
    grandTotal: number;
  };
  getAllTotals: () => {
    totalLabor: number;
    totalMaterials: number;
    grandTotal: number;
  };
}

const EstimateWorkflowContext = createContext<
  EstimateWorkflowContextType | undefined
>(undefined);

interface EstimateWorkflowProviderProps {
  children: React.ReactNode;
  projectId: string;
  initialData?: EstimateData;
}

export function EstimateWorkflowProvider({
  children,
  projectId,
  initialData,
}: EstimateWorkflowProviderProps) {
  const { estimateData, actions } = useEstimateData(projectId, initialData);
  const saveEstimateMutation = useSaveEstimate();
  const {
    data: loadedData,
    isLoading: isLoadingData,
    refetch: refetchEstimate,
  } = useLoadEstimate(projectId);
  const { data: contractor } = useContractor();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReloading, setIsReloading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Autosave functionality
  const autosaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const AUTOSAVE_INTERVAL = 5000; // 5 seconds interval

  // Track previous loadedData to detect changes
  const prevLoadedDataRef = useRef<EstimateData | null>(null);

  // Refetch on mount to get latest data
  useEffect(() => {
    refetchEstimate();
  }, [refetchEstimate]);

  // Load data when it changes (after refetch)
  useEffect(() => {
    if (
      loadedData &&
      !initialData &&
      prevLoadedDataRef.current !== loadedData
    ) {
      actions.importData(loadedData);
      prevLoadedDataRef.current = loadedData;
    }
  }, [loadedData, initialData, actions]);

  // Auto-generate labor items when design choices change
  useEffect(() => {
    if (estimateData.workflows?.demolition) {
      const demolitionData = estimateData.workflows.demolition;
      const designData = demolitionData.design;

      if (designData?.demolitionChoices) {
        const demolitionChoices = designData.demolitionChoices;
        const isDemolitionFlatFee = designData.isDemolitionFlatFee === 'yes';

        const currentWorkflow = demolitionData.workflow;
        if (currentWorkflow) {
          if (isDemolitionFlatFee) {
            // Flat fee mode
            const flatFeeAmount = designData.flatFeeAmount || '0';
            const flatFeeItems: FlatFeeItem[] = [
              {
                id: 'flat-fee-demolition',
                name: 'Demolition Flat Fee',
                unitPrice: flatFeeAmount,
              },
            ];

            const hasHourlyItems =
              (currentWorkflow.labor?.hourlyItems?.length || 0) > 0;
            const needsFlatFeeUpdate =
              (currentWorkflow.labor?.flatFeeItems?.length || 0) !== 1 ||
              currentWorkflow.labor?.flatFeeItems?.[0]?.unitPrice !==
                flatFeeAmount;

            if (hasHourlyItems || needsFlatFeeUpdate) {
              actions.updateWorkflowData('demolition', {
                ...currentWorkflow,
                labor: {
                  ...currentWorkflow.labor,
                  flatFeeItems,
                  hourlyItems: [],
                },
              });
            }
          } else {
            // Hourly mode: generate items based on design choices
            const contractorHourlyRate = contractor?.hourly_rate || 0;
            const laborConfigs = DEMOLITION_LABOR_ITEMS(contractorHourlyRate);

            const existingLaborItems = currentWorkflow.labor?.hourlyItems || [];
            const customItems = existingLaborItems.filter((item) =>
              item.id.startsWith('custom-')
            );

            // Get existing auto-generated items
            const existingAutoItems = existingLaborItems.filter(
              (item) => !item.id.startsWith('custom-')
            );

            // Build expected labor items based on design choices
            const expectedAutoItems: LaborItem[] = [];
            Object.entries(demolitionChoices).forEach(([choice, value]) => {
              if (
                value === 'yes' &&
                laborConfigs[choice as keyof typeof laborConfigs]
              ) {
                const laborConfig =
                  laborConfigs[choice as keyof typeof laborConfigs];
                expectedAutoItems.push({
                  id: laborConfig.id,
                  name: laborConfig.name,
                  hours: laborConfig.hours,
                  rate: laborConfig.rate,
                  scope: 'demolition',
                });
              }
            });

            // Merge existing and expected items
            const mergedAutoItems: LaborItem[] = [];
            expectedAutoItems.forEach((expectedItem) => {
              const existingItem = existingAutoItems.find(
                (item) => item.id === expectedItem.id
              );
              if (existingItem) {
                mergedAutoItems.push(existingItem);
              } else {
                mergedAutoItems.push(expectedItem);
              }
            });

            // Update only if there's a difference
            const expectedCount = customItems.length + mergedAutoItems.length;
            if (existingLaborItems.length !== expectedCount) {
              actions.updateWorkflowData('demolition', {
                ...currentWorkflow,
                labor: {
                  ...currentWorkflow.labor,
                  hourlyItems: [...customItems, ...mergedAutoItems],
                  flatFeeItems: [],
                },
              });
            }
          }
        }
      }
    }
  }, [estimateData.workflows, actions, contractor]);

  // Auto-generate labor items for shower walls when design changes
  useEffect(() => {
    if (estimateData.workflows?.showerWalls) {
      const showerWallsData = estimateData.workflows.showerWalls;
      const designData = showerWallsData.design as {
        walls?: Array<{
          id: string;
          name: string;
          height: { ft: number; inch: number };
          width: { ft: number; inch: number };
        }>;
        design?: ShowerWallsDesign;
      };

      if (
        designData?.walls &&
        designData?.design?.tileSize &&
        designData.design.tileSize !== 'Select tile size' &&
        designData.design.tilePattern !== 'Select Tile Pattern'
      ) {
        const currentWorkflow = showerWallsData.workflow;
        if (currentWorkflow) {
          // Import calculator dynamically
          import('../lib/shower-walls-calculator').then(({ ShowerWallsCalculator }) => {
            const contractorHourlyRate = contractor?.hourly_rate || 85;
            const calculations = ShowerWallsCalculator.calculate(
              designData.walls || [],
              designData.design as ShowerWallsDesign,
              contractorHourlyRate
            );

            const existingLaborItems = currentWorkflow.labor?.hourlyItems || [];
            const customItems = existingLaborItems.filter(
              (item) => !item.isAutoGenerated && !item.id?.startsWith('sw-')
            );

            // Format auto-generated labor items
            const autoLaborItems = calculations.laborItems.map((item) => ({
              ...item,
              hours: item.hours.toString(),
              rate: item.rate.toString(),
            }));

            // Get existing custom material items
            const existingMaterialItems = currentWorkflow.materials?.items || [];
            const customMaterialItems = existingMaterialItems.filter(
              (item) => !item.isAutoGenerated
            );

            // Format auto-generated material items
            const autoMaterialItems = calculations.materialItems.map((item) => ({
              ...item,
              quantity: item.quantity.toString(),
              price: item.price.toString(),
            }));

            // Check if items have changed (using unique IDs)
            const expectedLaborCount = customItems.length + autoLaborItems.length;
            const expectedMaterialCount = customMaterialItems.length + autoMaterialItems.length;

            // Check if any auto-generated item IDs are missing or different (handles pattern/config changes)
            const existingAutoItems = existingLaborItems.filter(
              (item) => item.isAutoGenerated || item.id?.startsWith('sw-')
            );
            const existingAutoIds = new Set(existingAutoItems.map(item => item.id));
            const newAutoIds = new Set(autoLaborItems.map(item => item.id));

            // Check if IDs have changed (e.g., sw-tiling-stacked -> sw-tiling-1-2-offset)
            const idsChanged =
              existingAutoIds.size !== newAutoIds.size ||
              Array.from(newAutoIds).some(id => !existingAutoIds.has(id));

            // Check if hours have changed (for wall dimension changes)
            const hoursChanged = autoLaborItems.some(newItem => {
              const existingItem = existingLaborItems.find(item => item.id === newItem.id);
              if (!existingItem) return true;
              // Compare as numbers (convert from string if needed)
              const existingHours = typeof existingItem.hours === 'string'
                ? parseFloat(existingItem.hours)
                : existingItem.hours;
              const newHours = typeof newItem.hours === 'string'
                ? parseFloat(newItem.hours)
                : newItem.hours;
              return Math.abs(existingHours - newHours) > 0.01; // Allow small floating point differences
            });

            // Check if quantities have changed (for wall dimension changes)
            const quantitiesChanged = autoMaterialItems.some(newItem => {
              const existingItem = existingMaterialItems.find(item => item.id === newItem.id);
              if (!existingItem) return true;
              // Compare as numbers (convert from string if needed)
              const existingQty = typeof existingItem.quantity === 'string'
                ? parseFloat(existingItem.quantity)
                : existingItem.quantity;
              const newQty = typeof newItem.quantity === 'string'
                ? parseFloat(newItem.quantity)
                : newItem.quantity;
              return Math.abs(existingQty - newQty) > 0.01;
            });

            // Update if there's a difference in count, IDs, hours, or quantities
            if (
              existingLaborItems.length !== expectedLaborCount ||
              existingMaterialItems.length !== expectedMaterialCount ||
              idsChanged ||
              hoursChanged ||
              quantitiesChanged
            ) {
              actions.updateWorkflowData('showerWalls', {
                ...currentWorkflow,
                labor: {
                  ...currentWorkflow.labor,
                  hourlyItems: [...customItems, ...autoLaborItems],
                },
                materials: {
                  ...currentWorkflow.materials,
                  items: [...customMaterialItems, ...autoMaterialItems],
                },
              });
            }
          });
        }
      }
    }
  }, [estimateData.workflows, actions]);

  // Auto-generate labor and material items for shower base when design changes
  useEffect(() => {
    if (estimateData.workflows?.showerBase) {
      const showerBaseData = estimateData.workflows.showerBase;
      const designData = showerBaseData.design as {
        width?: string;
        length?: string;
        baseType?: string;
        drainType?: string;
        waterproofingSystem?: string;
        entryType?: string;
        drainLocation?: string;
        subfloorRepair?: boolean;
        joistModification?: boolean;
        clientSuppliesBase?: string;
        installationBy?: string;
      } | null;

      // Check if construction options are enabled (these work independently of base type)
      const hasConstructionOptions = designData?.subfloorRepair || designData?.joistModification;

      // Skip if no base type selected AND no construction options enabled
      if ((!designData?.baseType || designData.baseType === 'Select base type') && !hasConstructionOptions) {
        return;
      }

      const currentWorkflow = showerBaseData.workflow || {
        labor: { hourlyItems: [], flatFeeItems: [] },
        materials: { items: [] },
        notes: { contractorNotes: '', clientNotes: '' },
        estimate: {
          laborTotal: 0,
          materialsTotal: 0,
          grandTotal: 0,
          lastUpdated: new Date().toISOString(),
        },
      };

      // Always process if we have construction options or a valid base type
      {
        const contractorHourlyRate = contractor?.hourly_rate || 85;
        const laborItemsMap = SHOWER_BASE_LABOR_ITEMS(contractorHourlyRate);
        const materialsMap = SHOWER_BASE_MATERIALS_ITEMS;

        // Generate labor items based on design
        const autoLaborItems: LaborItem[] = [];
        const autoMaterialItems: MaterialItem[] = [];

        const baseType = designData.baseType;
        const drainType = designData.drainType || 'regular';
        const waterproofingSystem = designData.waterproofingSystem || 'none';
        const entryType = designData.entryType || 'curb';
        const subfloorRepair = designData.subfloorRepair || false;
        const joistModification = designData.joistModification || false;
        const clientSuppliesBase = designData.clientSuppliesBase || 'No';
        const installationBy = designData.installationBy || 'Me';
        const baseLengthIn = parseFloat(designData.length || '0');
        const baseWidthIn = parseFloat(designData.width || '0');
        const baseSqFt = (baseLengthIn * baseWidthIn) / 144;

        // Base Type Logic - Tub or Acrylic Base
        if (baseType === 'Tub') {
          if (installationBy === 'Me') {
            autoLaborItems.push({
              ...laborItemsMap.installTub,
              id: 'sb-lab-install-tub',
            });
          } else {
            autoLaborItems.push({
              ...laborItemsMap.installTubByTrade,
              id: 'sb-lab-install-tub-trade',
            });
          }
          // Materials for Tub
          if (clientSuppliesBase === 'No') {
            autoMaterialItems.push({
              ...materialsMap.tub,
              id: 'sb-mat-tub',
            });
          }
        } else if (baseType === 'Acrylic Base') {
          if (installationBy === 'Me') {
            autoLaborItems.push({
              ...laborItemsMap.installAcrylicBase,
              id: 'sb-lab-install-acrylic',
            });
          } else {
            autoLaborItems.push({
              ...laborItemsMap.installAcrylicBaseByTrade,
              id: 'sb-lab-install-acrylic-trade',
            });
          }
          // Materials for Acrylic Base
          if (clientSuppliesBase === 'No') {
            autoMaterialItems.push({
              ...materialsMap.acrylicBase,
              id: 'sb-mat-acrylic',
            });
          }
        } else if (baseType === 'Tiled Base') {
          // ===== DESIGN LABOR =====
          // Tile Shower Base (always for Tiled Base)
          autoLaborItems.push({
            ...laborItemsMap.tileBase,
            id: 'sb-lab-tile-base',
          });

          // Drain Type Labor (Design)
          if (drainType === 'linear') {
            autoLaborItems.push({
              ...laborItemsMap.installLinearDrain,
              id: 'sb-lab-drain-linear',
            });
          } else {
            // Regular drain
            autoLaborItems.push({
              ...laborItemsMap.installRegularDrain,
              id: 'sb-lab-drain-regular',
            });
          }

          // ===== DESIGN MATERIALS =====
          // Shower Floor Tile (Mosaic) with 15% waste
          if (baseSqFt > 0) {
            const tileQty = Math.ceil(baseSqFt * 1.15);
            autoMaterialItems.push({
              id: 'sb-mat-floor-tile',
              name: 'Shower Floor Tile (Mosaic)',
              quantity: tileQty.toString(),
              unit: 'sq ft',
              price: '20',
              scope: 'design',
              isAutoGenerated: true,
            });
            // Floor Grout
            autoMaterialItems.push({
              id: 'sb-mat-floor-grout',
              name: 'Floor Grout',
              quantity: '1',
              unit: 'bag',
              price: '35',
              scope: 'design',
              isAutoGenerated: true,
            });
          }

          // Drain Materials (Design)
          if (drainType === 'linear') {
            autoMaterialItems.push({
              ...materialsMap.linearDrain,
              id: 'sb-mat-drain-linear',
            });
          } else {
            autoMaterialItems.push({
              ...materialsMap.standardDrain,
              id: 'sb-mat-drain-standard',
            });
          }

          // ===== CONSTRUCTION LABOR =====
          // Perform Flood Test (always for Tiled Base)
          autoLaborItems.push({
            ...laborItemsMap.performFloodTest,
            id: 'sb-lab-flood-test',
          });

          // Entry Type Logic (Construction)
          if (entryType === 'curbless') {
            autoLaborItems.push({
              ...laborItemsMap.createCurblessEntry,
              id: 'sb-lab-curbless',
            });
          } else {
            autoLaborItems.push({
              ...laborItemsMap.buildCurb,
              id: 'sb-lab-curb',
            });
          }

          // Waterproofing System Labor (Construction)
          if (waterproofingSystem === 'schluter') {
            autoLaborItems.push({
              ...laborItemsMap.installSchluterSystem,
              id: 'sb-lab-schluter',
            });
          } else if (waterproofingSystem === 'mortar') {
            autoLaborItems.push({
              ...laborItemsMap.installMortarBed,
              id: 'sb-lab-mortar',
            });
          } else if (waterproofingSystem === 'wedi') {
            autoLaborItems.push({
              ...laborItemsMap.installWediSystem,
              id: 'sb-lab-wedi',
            });
          } else if (waterproofingSystem === 'laticrete') {
            autoLaborItems.push({
              ...laborItemsMap.installLaticreteSystem,
              id: 'sb-lab-laticrete',
            });
          }

          // ===== CONSTRUCTION MATERIALS =====
          // Entry Type Materials
          if (entryType === 'curbless') {
            autoMaterialItems.push({
              ...materialsMap.plywoodRecessedFloor,
              id: 'sb-mat-plywood-recessed',
            });
            autoMaterialItems.push({
              ...materialsMap.lumberJoistCleats,
              id: 'sb-mat-lumber-joist-cleats',
            });
            autoMaterialItems.push({
              ...materialsMap.constructionAdhesive,
              id: 'sb-mat-construction-adhesive',
            });
          } else {
            autoMaterialItems.push({
              ...materialsMap.lumberCurb,
              id: 'sb-mat-lumber-curb',
            });
          }

          // Waterproofing System Materials (Construction)
          if (waterproofingSystem === 'schluter') {
            // Schluter kit depends on drain type
            if (drainType === 'linear') {
              autoMaterialItems.push({
                ...materialsMap.schluterKitLinear,
                id: 'sb-mat-schluter-kit-linear',
              });
            } else {
              autoMaterialItems.push({
                ...materialsMap.schluterKitCenter,
                id: 'sb-mat-schluter-kit-center',
              });
            }
            autoMaterialItems.push({
              ...materialsMap.schluterThinset,
              id: 'sb-mat-schluter-thinset',
            });
          } else if (waterproofingSystem === 'mortar') {
            // Mortar Bed System - calculate mortar quantity
            const mortarQty = Math.ceil(baseSqFt / 4) + 1;
            autoMaterialItems.push({
              ...materialsMap.mortarMix,
              id: 'sb-mat-mortar-mix',
              quantity: mortarQty.toString(),
            });
            autoMaterialItems.push({
              ...materialsMap.pvcPanLiner,
              id: 'sb-mat-pvc-pan-liner',
            });
            autoMaterialItems.push({
              ...materialsMap.drainWaterproofingAccessories,
              id: 'sb-mat-drain-accessories',
            });
          } else if (waterproofingSystem === 'wedi') {
            autoMaterialItems.push({
              ...materialsMap.wediFundoKit,
              id: 'sb-mat-wedi-fundo-kit',
            });
            // Calculate sealant quantity based on area
            const sealantQty = baseSqFt <= 20 ? 2 : 2 + Math.ceil((baseSqFt - 20) / 15);
            autoMaterialItems.push({
              ...materialsMap.wediJointSealant,
              id: 'sb-mat-wedi-sealant',
              quantity: sealantQty.toString(),
            });
          } else if (waterproofingSystem === 'laticrete') {
            autoMaterialItems.push({
              ...materialsMap.laticretePreSlopedPan,
              id: 'sb-mat-laticrete-pan',
            });
            // Calculate sealant quantity based on area
            const sealantQty = baseSqFt <= 20 ? 2 : 2 + Math.ceil((baseSqFt - 20) / 15);
            autoMaterialItems.push({
              ...materialsMap.laticreteAdhesiveSealant,
              id: 'sb-mat-laticrete-adhesive',
              quantity: sealantQty.toString(),
            });
            autoMaterialItems.push({
              ...materialsMap.hydrobanliquidMembrane,
              id: 'sb-mat-hydroban-membrane',
            });
          }
        }

        // ===== OPTIONAL STRUCTURAL (ANY BASE TYPE) =====
        if (subfloorRepair) {
          autoLaborItems.push({
            ...laborItemsMap.repairSubfloor,
            id: 'sb-lab-subfloor',
          });
          // Plywood/OSB Sheathing - Qty 1 - $70
          autoMaterialItems.push({
            ...materialsMap.subfloorPlywoodOSB,
            id: 'sb-mat-subfloor-plywood',
          });
          // Lumber (2x4) - Qty 3 - $6
          autoMaterialItems.push({
            ...materialsMap.subfloorLumber2x4,
            id: 'sb-mat-subfloor-lumber',
          });
        }

        if (joistModification) {
          autoLaborItems.push({
            ...laborItemsMap.modifyFloorJoists,
            id: 'sb-lab-joist',
          });
          // Lumber (2x4) - Qty 5 - $6
          autoMaterialItems.push({
            ...materialsMap.joistLumber2x4,
            id: 'sb-mat-joist-lumber',
          });
        }

        // Get existing custom items (preserve user-added items)
        const existingLaborItems = currentWorkflow.labor?.hourlyItems || [];
        const customLaborItems = existingLaborItems.filter(
          (item) => !item.isAutoGenerated && !item.id?.startsWith('sb-')
        );

        const existingMaterialItems = currentWorkflow.materials?.items || [];
        const customMaterialItems = existingMaterialItems.filter(
          (item) => !item.isAutoGenerated && !item.id?.startsWith('sb-')
        );

        // Check if items have changed
        const existingAutoLaborIds = new Set(
          existingLaborItems.filter((item) => item.id?.startsWith('sb-')).map((item) => item.id)
        );
        const newAutoLaborIds = new Set(autoLaborItems.map((item) => item.id));

        const existingAutoMaterialIds = new Set(
          existingMaterialItems.filter((item) => item.id?.startsWith('sb-')).map((item) => item.id)
        );
        const newAutoMaterialIds = new Set(autoMaterialItems.map((item) => item.id));

        const laborIdsChanged =
          existingAutoLaborIds.size !== newAutoLaborIds.size ||
          Array.from(newAutoLaborIds).some((id) => !existingAutoLaborIds.has(id));

        const materialIdsChanged =
          existingAutoMaterialIds.size !== newAutoMaterialIds.size ||
          Array.from(newAutoMaterialIds).some((id) => !existingAutoMaterialIds.has(id));

        // Also check if quantities have changed (for tile sq ft calculations)
        const quantitiesChanged = autoMaterialItems.some((newItem) => {
          const existingItem = existingMaterialItems.find((item) => item.id === newItem.id);
          if (!existingItem) return false;
          return existingItem.quantity !== newItem.quantity;
        });

        // Update if there's a difference
        if (laborIdsChanged || materialIdsChanged || quantitiesChanged) {
          actions.updateWorkflowData('showerBase', {
            ...currentWorkflow,
            labor: {
              ...currentWorkflow.labor,
              hourlyItems: [...customLaborItems, ...autoLaborItems],
            },
            materials: {
              ...currentWorkflow.materials,
              items: [...customMaterialItems, ...autoMaterialItems],
            },
          });
        }
      }
    }
  }, [estimateData.workflows, actions, contractor]);

  // Auto-generate labor and material items for floors when design changes
  useEffect(() => {
    if (estimateData.workflows?.floors) {
      const floorsData = estimateData.workflows.floors;
      const designData = floorsData.design as {
        width?: string;
        length?: string;
        extraMeasurements?: Array<{
          id: number;
          label: string;
          width: string;
          length: string;
        }>;
        clientSuppliesTiles?: boolean;
        selectedTileSizeOption?: string;
        tileSize?: { width: string; length: string };
        tilePattern?: string;
        isHeatedFloor?: boolean;
        heatedFloorType?: string;
        customHeatedFloorName?: string;
        selectedPrepTasks?: string[];
        plywoodThickness?: string;
        joistCount?: number;
      } | null;

      // Skip if no design data or no dimensions
      if (!designData) {
        return;
      }

      // Calculate total square footage
      let totalSqFt = 0;
      const mainWidth = parseFloat(designData.width || '0');
      const mainLength = parseFloat(designData.length || '0');
      if (mainWidth > 0 && mainLength > 0) {
        totalSqFt += (mainWidth * mainLength) / 144;
      }
      if (designData.extraMeasurements && Array.isArray(designData.extraMeasurements)) {
        designData.extraMeasurements.forEach((m) => {
          const sideWidth = parseFloat(m.width) || 0;
          const sideLength = parseFloat(m.length) || 0;
          if (sideWidth > 0 && sideLength > 0) {
            totalSqFt += (sideWidth * sideLength) / 144;
          }
        });
      }

      // Check if there are any prep tasks or heated floor selected
      const hasPrepTasks = designData.selectedPrepTasks && designData.selectedPrepTasks.length > 0;
      const hasHeatedFloor = designData.isHeatedFloor;
      const hasTileSelection = designData.selectedTileSizeOption && designData.selectedTileSizeOption !== 'select_option';

      // Skip if no area and no prep tasks
      if (totalSqFt <= 0 && !hasPrepTasks && !hasHeatedFloor) {
        return;
      }

      const currentWorkflow = floorsData.workflow || {
        labor: { hourlyItems: [], flatFeeItems: [] },
        materials: { items: [] },
        notes: { contractorNotes: '', clientNotes: '' },
        estimate: {
          laborTotal: 0,
          materialsTotal: 0,
          grandTotal: 0,
          lastUpdated: new Date().toISOString(),
        },
      };

      const contractorHourlyRate = contractor?.hourly_rate || 85;
      const laborItemsMap = FLOORS_LABOR_ITEMS(contractorHourlyRate);
      const materialsMap = FLOORS_MATERIALS_ITEMS;

      const autoLaborItems: LaborItem[] = [];
      const autoMaterialItems: MaterialItem[] = [];

      // Get design values
      const tileSize = designData.selectedTileSizeOption || 'custom';
      const tilePattern = designData.tilePattern || 'other';
      const tileWastePct = FLOORS_CONFIG.patternWastePct[tilePattern] || FLOORS_CONFIG.patternWastePct.other;
      const selectedPrepTasks = designData.selectedPrepTasks || [];

      // ===== DESIGN MATERIALS =====
      if (totalSqFt > 0 && hasTileSelection) {
        const tileAreaWithWaste = totalSqFt * (1 + tileWastePct);

        // Floor tile (only if client doesn't supply)
        if (!designData.clientSuppliesTiles) {
          const tileBoxCoverage = FLOORS_CONFIG.tileBoxCoverageSqFt[tileSize] || FLOORS_CONFIG.tileBoxCoverageSqFt.custom;
          const tileBoxes = Math.ceil(tileAreaWithWaste / tileBoxCoverage);
          const tileWidth = designData.tileSize?.width || '';
          const tileLength = designData.tileSize?.length || '';
          const tileName = tileWidth && tileLength
            ? `Floor Tile (${tileWidth}"x${tileLength}")`
            : 'Floor Tile';

          autoMaterialItems.push({
            ...materialsMap.floorTile,
            id: 'fl-mat-floor-tile',
            name: tileName,
            quantity: tileBoxes.toString(),
            isAutoGenerated: true,
          });
        }

        // Floor Grout
        const groutCoverage = FLOORS_CONFIG.groutCoverageSqFtPerUnit[tileSize] || FLOORS_CONFIG.groutCoverageSqFtPerUnit.custom;
        const groutUnits = Math.ceil(totalSqFt / groutCoverage);
        if (groutUnits > 0) {
          autoMaterialItems.push({
            ...materialsMap.grout,
            id: 'fl-mat-floor-grout',
            quantity: groutUnits.toString(),
            scope: 'design',
            isAutoGenerated: true,
          });
        }

        // Transition (always 1 @ $40)
        autoMaterialItems.push({
          ...materialsMap.transition,
          id: 'fl-mat-floor-transition',
          quantity: '1',
          scope: 'design',
          isAutoGenerated: true,
        });

        // Thinset for floor tile (Construction material)
        const thinsetBags = Math.ceil(tileAreaWithWaste / FLOORS_CONFIG.thinsetCoverageSqFtPerBag);
        if (thinsetBags > 0) {
          autoMaterialItems.push({
            ...materialsMap.thinset,
            id: 'fl-mat-floor-thinset',
            quantity: thinsetBags.toString(),
            scope: 'construction',
            isAutoGenerated: true,
          });
        }

        // ===== DESIGN LABOR =====
        // Tile floor labor
        const sizeMultiplier = FLOORS_CONFIG.sizeMultipliers[tileSize] || FLOORS_CONFIG.sizeMultipliers.custom;
        const patternMultiplier = FLOORS_CONFIG.patternMultipliers[tilePattern] || FLOORS_CONFIG.patternMultipliers.other;
        const tileHours = (totalSqFt / FLOORS_CONFIG.baseTileProductivitySqFtPerHr) * sizeMultiplier * patternMultiplier;

        autoLaborItems.push({
          ...laborItemsMap.tileFloor,
          id: 'fl-lab-tile-floor',
          hours: tileHours.toFixed(2),
          isAutoGenerated: true,
        });

        // Grout floor labor
        const groutHours = (totalSqFt / FLOORS_CONFIG.baseGroutProductivitySqFtPerHr) * sizeMultiplier * patternMultiplier;
        autoLaborItems.push({
          ...laborItemsMap.groutFloor,
          id: 'fl-lab-grout-floor',
          hours: groutHours.toFixed(2),
          isAutoGenerated: true,
        });
      }

      // ===== CONSTRUCTION MATERIALS & LABOR =====

      // Ditra membrane
      if (selectedPrepTasks.includes('ditra')) {
        autoMaterialItems.push({
          ...materialsMap.ditra,
          id: 'fl-mat-ditra',
          quantity: totalSqFt.toFixed(2),
          isAutoGenerated: true,
        });

        // Thinset for Ditra
        const ditraThinsetBags = Math.ceil(totalSqFt / FLOORS_CONFIG.thinsetCoverageSqFtPerBag);
        if (ditraThinsetBags > 0) {
          autoMaterialItems.push({
            ...materialsMap.ditraThinset,
            id: 'fl-mat-ditra-thinset',
            quantity: ditraThinsetBags.toString(),
            isAutoGenerated: true,
          });
        }

        // Ditra labor
        const ditraHoursBand = FLOORS_CONFIG.ditraLaborHoursBands.find((band) => totalSqFt <= band.maxSqFt);
        const ditraHours = ditraHoursBand?.hours || 2.25;
        autoLaborItems.push({
          ...laborItemsMap.installDitra,
          id: 'fl-lab-ditra',
          hours: ditraHours.toString(),
          isAutoGenerated: true,
        });
      }

      // Ditra XL membrane
      if (selectedPrepTasks.includes('ditra_xl')) {
        autoMaterialItems.push({
          ...materialsMap.ditraXL,
          id: 'fl-mat-ditra-xl',
          quantity: totalSqFt.toFixed(2),
          isAutoGenerated: true,
        });

        // Thinset for Ditra XL
        const ditraXLThinsetBags = Math.ceil(totalSqFt / FLOORS_CONFIG.thinsetCoverageSqFtPerBag);
        if (ditraXLThinsetBags > 0) {
          autoMaterialItems.push({
            ...materialsMap.ditraThinset,
            id: 'fl-mat-ditra-xl-thinset',
            quantity: ditraXLThinsetBags.toString(),
            isAutoGenerated: true,
          });
        }

        // Ditra XL labor (same as Ditra)
        const ditraXLHoursBand = FLOORS_CONFIG.ditraLaborHoursBands.find((band) => totalSqFt <= band.maxSqFt);
        const ditraXLHours = ditraXLHoursBand?.hours || 2.25;
        autoLaborItems.push({
          ...laborItemsMap.installDitraXL,
          id: 'fl-lab-ditra-xl',
          hours: ditraXLHours.toString(),
          isAutoGenerated: true,
        });
      }

      // Self-leveling
      if (selectedPrepTasks.includes('self_leveling')) {
        const levelerBags = Math.max(1, Math.ceil(totalSqFt / 40));
        autoMaterialItems.push({
          ...materialsMap.selfLevelingCompound,
          id: 'fl-mat-leveling',
          quantity: levelerBags.toString(),
          isAutoGenerated: true,
        });
        autoMaterialItems.push({
          ...materialsMap.selfLevelingPrimer,
          id: 'fl-mat-leveling-primer',
          isAutoGenerated: true,
        });
        autoLaborItems.push({
          ...laborItemsMap.selfLeveling,
          id: 'fl-lab-leveling',
          isAutoGenerated: true,
        });
      }

      // Add plywood for subfloor support
      if (selectedPrepTasks.includes('add_plywood')) {
        const plywoodSheets = Math.ceil(totalSqFt / 32);
        const isHalfInch = designData.plywoodThickness === '1/2' || designData.plywoodThickness === '5/8';

        if (isHalfInch) {
          autoMaterialItems.push({
            ...materialsMap.plywoodHalf,
            id: 'fl-mat-plywood',
            quantity: plywoodSheets.toString(),
            isAutoGenerated: true,
          });
        } else {
          autoMaterialItems.push({
            ...materialsMap.plywoodThreeQuarter,
            id: 'fl-mat-plywood',
            quantity: plywoodSheets.toString(),
            isAutoGenerated: true,
          });
        }

        autoMaterialItems.push({
          ...materialsMap.constructionScrews,
          id: 'fl-mat-screws',
          isAutoGenerated: true,
        });
        autoLaborItems.push({
          ...laborItemsMap.installPlywood,
          id: 'fl-lab-plywood',
          isAutoGenerated: true,
        });
      }

      // Repair portion of subfloor
      if (selectedPrepTasks.includes('repair_subfloor')) {
        autoMaterialItems.push({
          ...materialsMap.patchPlywood,
          id: 'fl-mat-patch-plywood',
          isAutoGenerated: true,
        });
        autoMaterialItems.push({
          ...materialsMap.constructionAdhesive,
          id: 'fl-mat-patch-adhesive',
          isAutoGenerated: true,
        });
        autoMaterialItems.push({
          ...materialsMap.constructionScrews,
          id: 'fl-mat-patch-screws',
          isAutoGenerated: true,
        });
        autoLaborItems.push({
          ...laborItemsMap.repairSubfloor,
          id: 'fl-lab-repair-subfloor',
          isAutoGenerated: true,
        });
      }

      // Repair floor joist
      if (selectedPrepTasks.includes('repair_joist')) {
        const joistCount = designData.joistCount || 1;

        autoMaterialItems.push({
          ...materialsMap.sisterJoistLumber,
          id: 'fl-mat-sister-joist',
          quantity: (2 * joistCount).toString(),
          isAutoGenerated: true,
        });
        autoMaterialItems.push({
          ...materialsMap.structuralScrews,
          id: 'fl-mat-structural-screws',
          quantity: joistCount.toString(),
          isAutoGenerated: true,
        });
        autoMaterialItems.push({
          ...materialsMap.joistAdhesive,
          id: 'fl-mat-joist-adhesive',
          quantity: (2 * joistCount).toString(),
          isAutoGenerated: true,
        });
        autoLaborItems.push({
          ...laborItemsMap.repairJoist,
          id: 'fl-lab-repair-joist',
          hours: (4.5 * joistCount).toString(),
          isAutoGenerated: true,
        });
      }

      // ===== HEATED FLOOR MATERIALS & LABOR =====
      if (hasHeatedFloor && totalSqFt > 0) {
        const heatedAreaRaw = totalSqFt * HEATED_FLOOR_CONFIG.heatedCoverageFactor;
        const heatedAreaSqFt = Math.max(0, heatedAreaRaw - HEATED_FLOOR_CONFIG.toiletClearanceSqFt);

        // Get mat labor hours from bands
        const matHoursBand = HEATED_FLOOR_CONFIG.matLaborHoursBands.find(
          (band) => totalSqFt >= band.minSqFt && totalSqFt <= band.maxSqFt
        );
        const matLaborHours = matHoursBand?.hours || 3.0;

        if (designData.heatedFloorType === 'schluter') {
          // DITRA-HEAT Materials
          autoMaterialItems.push({
            ...materialsMap.ditraHeatMembrane,
            id: 'fl-mat-ditra-heat-membrane',
            quantity: totalSqFt.toFixed(2),
            isAutoGenerated: true,
          });
          autoMaterialItems.push({
            ...materialsMap.ditraHeatCable,
            id: 'fl-mat-ditra-heat-cable',
            quantity: heatedAreaSqFt.toFixed(2),
            isAutoGenerated: true,
          });
          autoMaterialItems.push({
            ...materialsMap.ditraHeatThermostat,
            id: 'fl-mat-ditra-heat-thermostat',
            isAutoGenerated: true,
          });
          autoMaterialItems.push({
            ...materialsMap.ditraHeatThinset,
            id: 'fl-mat-ditra-heat-thinset',
            isAutoGenerated: true,
          });

          // DITRA-HEAT Labor
          autoLaborItems.push({
            ...laborItemsMap.installDitraHeatMat,
            id: 'fl-lab-ditra-heat-mat',
            hours: matLaborHours.toString(),
            isAutoGenerated: true,
          });
          const cableHours = heatedAreaSqFt / HEATED_FLOOR_CONFIG.productivity.ditraCableSqFtPerHr;
          autoLaborItems.push({
            ...laborItemsMap.installDitraHeatCable,
            id: 'fl-lab-ditra-heat-cable',
            hours: cableHours.toFixed(2),
            isAutoGenerated: true,
          });
        } else if (designData.heatedFloorType === 'nuheat') {
          // NuHeat Materials
          autoMaterialItems.push({
            ...materialsMap.nuheatMembrane,
            id: 'fl-mat-nuheat-membrane',
            quantity: totalSqFt.toFixed(2),
            isAutoGenerated: true,
          });
          autoMaterialItems.push({
            ...materialsMap.nuheatCable,
            id: 'fl-mat-nuheat-cable',
            quantity: heatedAreaSqFt.toFixed(2),
            isAutoGenerated: true,
          });
          autoMaterialItems.push({
            ...materialsMap.nuheatThermostat,
            id: 'fl-mat-nuheat-thermostat',
            isAutoGenerated: true,
          });
          autoMaterialItems.push({
            ...materialsMap.nuheatThinset,
            id: 'fl-mat-nuheat-thinset',
            isAutoGenerated: true,
          });

          // NuHeat Labor
          autoLaborItems.push({
            ...laborItemsMap.installNuheatMat,
            id: 'fl-lab-nuheat-mat',
            hours: matLaborHours.toString(),
            isAutoGenerated: true,
          });
          const cableHours = heatedAreaSqFt / HEATED_FLOOR_CONFIG.productivity.nuheatCableSqFtPerHr;
          autoLaborItems.push({
            ...laborItemsMap.installNuheatCable,
            id: 'fl-lab-nuheat-cable',
            hours: cableHours.toFixed(2),
            isAutoGenerated: true,
          });
        } else if (designData.heatedFloorType === 'custom') {
          autoMaterialItems.push({
            ...materialsMap.customHeatedFloorKit,
            id: 'fl-mat-custom-heated',
            name: designData.customHeatedFloorName || 'Custom Heated Floor System',
            isAutoGenerated: true,
          });
          autoLaborItems.push({
            ...laborItemsMap.installCustomHeatedFloor,
            id: 'fl-lab-custom-heated',
            isAutoGenerated: true,
          });
        }
      }

      // Get existing custom items (preserve user-added items)
      const existingLaborItems = currentWorkflow.labor?.hourlyItems || [];
      const customLaborItems = existingLaborItems.filter(
        (item) => !item.isAutoGenerated && !item.id?.startsWith('fl-')
      );

      const existingMaterialItems = currentWorkflow.materials?.items || [];
      const customMaterialItems = existingMaterialItems.filter(
        (item) => !item.isAutoGenerated && !item.id?.startsWith('fl-')
      );

      // Check if items have changed
      const existingAutoLaborIds = new Set(
        existingLaborItems.filter((item) => item.id?.startsWith('fl-')).map((item) => item.id)
      );
      const newAutoLaborIds = new Set(autoLaborItems.map((item) => item.id));

      const existingAutoMaterialIds = new Set(
        existingMaterialItems.filter((item) => item.id?.startsWith('fl-')).map((item) => item.id)
      );
      const newAutoMaterialIds = new Set(autoMaterialItems.map((item) => item.id));

      const laborIdsChanged =
        existingAutoLaborIds.size !== newAutoLaborIds.size ||
        Array.from(newAutoLaborIds).some((id) => !existingAutoLaborIds.has(id));

      const materialIdsChanged =
        existingAutoMaterialIds.size !== newAutoMaterialIds.size ||
        Array.from(newAutoMaterialIds).some((id) => !existingAutoMaterialIds.has(id));

      // Also check if quantities have changed
      const quantitiesChanged = autoMaterialItems.some((newItem) => {
        const existingItem = existingMaterialItems.find((item) => item.id === newItem.id);
        if (!existingItem) return false;
        return existingItem.quantity !== newItem.quantity;
      });

      const laborHoursChanged = autoLaborItems.some((newItem) => {
        const existingItem = existingLaborItems.find((item) => item.id === newItem.id);
        if (!existingItem) return false;
        return existingItem.hours !== newItem.hours;
      });

      // Update if there's a difference
      if (laborIdsChanged || materialIdsChanged || quantitiesChanged || laborHoursChanged) {
        actions.updateWorkflowData('floors', {
          ...currentWorkflow,
          labor: {
            ...currentWorkflow.labor,
            hourlyItems: [...customLaborItems, ...autoLaborItems],
          },
          materials: {
            ...currentWorkflow.materials,
            items: [...customMaterialItems, ...autoMaterialItems],
          },
        });
      }
    }
  }, [estimateData.workflows, actions, contractor]);

  // Data getters
  const getWorkflowData = useCallback(
    (workflowType: WorkflowType): WorkflowData | null => {
      return estimateData.workflows?.[workflowType]?.workflow || null;
    },
    [estimateData.workflows]
  );

  const getDesignData = useCallback(
    <T = unknown,>(workflowType: WorkflowType): T | null => {
      const designData =
        (estimateData.workflows?.[workflowType]?.design as T) || null;

      return designData;
    },
    [estimateData.workflows]
  );

  const getLaborItems = useCallback(
    (workflowType: WorkflowType): LaborItem[] => {
      const items =
        estimateData.workflows?.[workflowType]?.workflow?.labor?.hourlyItems ||
        [];

      return items;
    },
    [estimateData.workflows]
  );

  const getFlatFeeItems = useCallback(
    (workflowType: WorkflowType): FlatFeeItem[] => {
      return (
        estimateData.workflows?.[workflowType]?.workflow?.labor?.flatFeeItems ||
        []
      );
    },
    [estimateData.workflows]
  );

  const getMaterialItems = useCallback(
    (workflowType: WorkflowType): MaterialItem[] => {
      return (
        estimateData.workflows?.[workflowType]?.workflow?.materials?.items || []
      );
    },
    [estimateData.workflows]
  );

  const getNotes = useCallback(
    (workflowType: WorkflowType): WorkflowNotes | null => {
      return estimateData.workflows?.[workflowType]?.workflow?.notes || null;
    },
    [estimateData.workflows]
  );

  // Design updates
  const updateDesign = useCallback(
    <T = unknown,>(workflowType: WorkflowType, updates: Partial<T>) => {
      actions.updateWorkflowDesign(workflowType, updates);

      // For demolition, update the saved labor and material items when design changes
      if (workflowType === 'demolition') {
        setTimeout(() => {
          const designData = getDesignData('demolition') as {
            demolitionChoices?: Record<string, string>;
            isDemolitionFlatFee?: string;
            flatFeeAmount?: string;
            debrisDisposal?: string;
          } | null;

          if (!designData) return;

          const demolitionChoices = designData.demolitionChoices || {};
          const isDemolitionFlatFee = designData.isDemolitionFlatFee === 'yes';
          const flatFeeAmount = designData.flatFeeAmount || '0';
          const debrisDisposal = designData.debrisDisposal || 'no';

          const currentWorkflow = getWorkflowData('demolition');
          if (!currentWorkflow) return;

          // Update labor items in saved data
          if (isDemolitionFlatFee) {
            // Flat fee mode
            const flatFeeItems: FlatFeeItem[] = [
              {
                id: 'flat-fee-demolition',
                name: 'Demolition Flat Fee',
                unitPrice: flatFeeAmount,
              },
            ];

            actions.updateWorkflowData('demolition', {
              ...currentWorkflow,
              labor: {
                ...currentWorkflow.labor,
                flatFeeItems,
                hourlyItems: [],
              },
            });
          } else {
            // Hourly mode - update saved labor items
            const contractorHourlyRate = contractor?.hourly_rate || 0;
            const laborConfigs = DEMOLITION_LABOR_ITEMS(contractorHourlyRate);

            // Get existing custom items from saved data (preserve user-added items)
            const existingLaborItems = currentWorkflow.labor?.hourlyItems || [];
            const customItems = existingLaborItems.filter((item) =>
              item.id.startsWith('custom-')
            );

            // Generate ONLY the auto labor items that match current design choices
            const autoLaborItems: LaborItem[] = [];
            Object.entries(demolitionChoices).forEach(([choice, value]) => {
              if (
                value === 'yes' &&
                laborConfigs[choice as keyof typeof laborConfigs]
              ) {
                const laborConfig =
                  laborConfigs[choice as keyof typeof laborConfigs];
                autoLaborItems.push({
                  id: laborConfig.id,
                  name: laborConfig.name,
                  hours: laborConfig.hours,
                  rate: laborConfig.rate,
                  scope: 'demolition',
                });
              }
            });

            // Update saved labor items - this will REMOVE items that are no longer selected
            actions.updateWorkflowData('demolition', {
              ...currentWorkflow,
              labor: {
                ...currentWorkflow.labor,
                hourlyItems: [...customItems, ...autoLaborItems],
                flatFeeItems: [],
              },
            });
          }

          // Update material items in saved data
          const currentMaterials = currentWorkflow.materials?.items || [];
          const customMaterials = currentMaterials.filter((item) =>
            item.id.startsWith('mat-custom-')
          );

          const autoMaterialItems: MaterialItem[] = [];
          const hasAnyDemolitionTask = Object.values(demolitionChoices).some(
            (choice) => choice === 'yes'
          );

          if (isDemolitionFlatFee) {
            // Flat-fee mode: Only add disposal fee if debris disposal is yes
            if (debrisDisposal === 'yes') {
              autoMaterialItems.push({
                id: 'mat-debris-disposal',
                name: DEMOLITION_MATERIALS_ITEMS.debrisDisposal.name,
                quantity: DEMOLITION_MATERIALS_ITEMS.debrisDisposal.quantity,
                price: DEMOLITION_MATERIALS_ITEMS.debrisDisposal.price,
                unit: DEMOLITION_MATERIALS_ITEMS.debrisDisposal.unit,
                scope: 'demolition',
              });
            }
          } else {
            // Hourly mode: Add bags and masks if any demolition task is selected
            if (hasAnyDemolitionTask) {
              autoMaterialItems.push({
                id: 'mat-contractor-bags',
                name: DEMOLITION_MATERIALS_ITEMS.contractorBags.name,
                quantity: DEMOLITION_MATERIALS_ITEMS.contractorBags.quantity,
                price: DEMOLITION_MATERIALS_ITEMS.contractorBags.price,
                unit: DEMOLITION_MATERIALS_ITEMS.contractorBags.unit,
                scope: 'demolition',
              });
              autoMaterialItems.push({
                id: 'mat-dust-masks',
                name: DEMOLITION_MATERIALS_ITEMS.dustMasks.name,
                quantity: DEMOLITION_MATERIALS_ITEMS.dustMasks.quantity,
                price: DEMOLITION_MATERIALS_ITEMS.dustMasks.price,
                unit: DEMOLITION_MATERIALS_ITEMS.dustMasks.unit,
                scope: 'demolition',
              });
            }

            // Add disposal fee if debris disposal is yes
            if (debrisDisposal === 'yes') {
              autoMaterialItems.push({
                id: 'mat-debris-disposal',
                name: DEMOLITION_MATERIALS_ITEMS.debrisDisposal.name,
                quantity: DEMOLITION_MATERIALS_ITEMS.debrisDisposal.quantity,
                price: DEMOLITION_MATERIALS_ITEMS.debrisDisposal.price,
                unit: DEMOLITION_MATERIALS_ITEMS.debrisDisposal.unit,
                scope: 'demolition',
              });
            }
          }

          // Update saved material items
          actions.updateWorkflowData('demolition', {
            ...currentWorkflow,
            materials: {
              ...currentWorkflow.materials,
              items: [...customMaterials, ...autoMaterialItems],
            },
          });
        }, 50);
      }

      // For shower walls, update the saved labor and material items when design changes
      if (workflowType === 'showerWalls') {
        setTimeout(() => {
          const designData = getDesignData('showerWalls') as {
            walls?: Array<{
              id: string;
              name: string;
              height: { ft: number; inch: number };
              width: { ft: number; inch: number };
            }>;
            design?: {
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
            };
          } | null;

          if (!designData?.walls || !designData?.design) {
            return;
          }

          // Skip if no tile size selected
          if (designData.design.tileSize === 'Select tile size') {
            return;
          }

          const currentWorkflow = getWorkflowData('showerWalls');
          if (!currentWorkflow) {
            return;
          }

          // Import calculator dynamically to avoid circular dependency
          import('../lib/shower-walls-calculator').then(({ ShowerWallsCalculator }) => {
            const contractorHourlyRate = contractor?.hourly_rate || 85;
            const calculations = ShowerWallsCalculator.calculate(
              designData.walls || [],
              designData.design!,
              contractorHourlyRate
            );

            // Get existing custom labor items (preserve user-added items)
            const existingLaborItems = currentWorkflow.labor?.hourlyItems || [];
            const customLaborItems = existingLaborItems.filter(
              (item) => !item.isAutoGenerated && !item.id?.startsWith('sw-')
            );

            // Format auto-generated labor items
            const autoLaborItems = calculations.laborItems.map((item) => ({
              ...item,
              hours: item.hours.toString(),
              rate: item.rate.toString(),
            }));

            // Get existing custom material items
            const existingMaterialItems = currentWorkflow.materials?.items || [];
            const customMaterialItems = existingMaterialItems.filter(
              (item) => !item.isAutoGenerated
            );

            // Format auto-generated material items
            const autoMaterialItems = calculations.materialItems.map((item) => ({
              ...item,
              quantity: item.quantity.toString(),
              price: item.price.toString(),
            }));

            // Update saved labor and material items
            actions.updateWorkflowData('showerWalls', {
              ...currentWorkflow,
              labor: {
                ...currentWorkflow.labor,
                hourlyItems: [...customLaborItems, ...autoLaborItems],
              },
              materials: {
                ...currentWorkflow.materials,
                items: [...customMaterialItems, ...autoMaterialItems],
              },
            });
          });
        }, 50);
      }
    },
    [actions, getDesignData, getWorkflowData]
  );

  // Labor updates
  const addLaborItem = useCallback(
    (workflowType: WorkflowType, item: Omit<LaborItem, 'id'>) => {
      const newItem: LaborItem = {
        ...item,
        id: `labor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          labor: {
            ...currentWorkflow.labor,
            hourlyItems: [
              ...(currentWorkflow.labor?.hourlyItems || []),
              newItem,
            ],
          },
        };
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData]
  );

  const updateLaborItem = useCallback(
    (workflowType: WorkflowType, id: string, updates: Partial<LaborItem>) => {
      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          labor: {
            ...currentWorkflow.labor,
            hourlyItems: (currentWorkflow.labor?.hourlyItems || []).map(
              (item) => (item.id === id ? { ...item, ...updates } : item)
            ),
          },
        };
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData]
  );

  const deleteLaborItem = useCallback(
    (workflowType: WorkflowType, id: string) => {
      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          labor: {
            ...currentWorkflow.labor,
            hourlyItems: (currentWorkflow.labor?.hourlyItems || []).filter(
              (item) => item.id !== id
            ),
          },
        };
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData]
  );

  const setLaborItems = useCallback(
    (workflowType: WorkflowType, items: LaborItem[]) => {
      // Setting labor items for workflow

      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          labor: {
            ...currentWorkflow.labor,
            hourlyItems: items,
          },
        };
        // Updating workflow data with labor items
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      } else {
        // Initialize the workflow if it doesn't exist
        const initialWorkflow = {
          labor: { hourlyItems: [], flatFeeItems: [] },
          materials: { items: [] },
          notes: { contractorNotes: '', clientNotes: '' },
          estimate: {
            laborTotal: 0,
            materialsTotal: 0,
            grandTotal: 0,
            lastUpdated: new Date().toISOString(),
          },
        };

        const updatedWorkflow = {
          ...initialWorkflow,
          labor: {
            ...initialWorkflow.labor,
            hourlyItems: items,
          },
        };

        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData, estimateData.workflows]
  );

  // Flat fee updates
  const addFlatFeeItem = useCallback(
    (workflowType: WorkflowType, item: Omit<FlatFeeItem, 'id'>) => {
      const newItem: FlatFeeItem = {
        ...item,
        id: `flatfee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          labor: {
            ...currentWorkflow.labor,
            flatFeeItems: [
              ...(currentWorkflow.labor?.flatFeeItems || []),
              newItem,
            ],
          },
        };
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData]
  );

  const updateFlatFeeItem = useCallback(
    (workflowType: WorkflowType, id: string, updates: Partial<FlatFeeItem>) => {
      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          labor: {
            ...currentWorkflow.labor,
            flatFeeItems: (currentWorkflow.labor?.flatFeeItems || []).map(
              (item) => (item.id === id ? { ...item, ...updates } : item)
            ),
          },
        };
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData]
  );

  const deleteFlatFeeItem = useCallback(
    (workflowType: WorkflowType, id: string) => {
      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          labor: {
            ...currentWorkflow.labor,
            flatFeeItems: (currentWorkflow.labor?.flatFeeItems || []).filter(
              (item) => item.id !== id
            ),
          },
        };
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData]
  );

  const setFlatFeeItems = useCallback(
    (workflowType: WorkflowType, items: FlatFeeItem[]) => {
      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          labor: {
            ...currentWorkflow.labor,
            flatFeeItems: items,
          },
        };
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData]
  );

  // Material updates
  const addMaterialItem = useCallback(
    (workflowType: WorkflowType, item: Omit<MaterialItem, 'id'>) => {
      const newItem: MaterialItem = {
        ...item,
        id: `material-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          materials: {
            ...currentWorkflow.materials,
            items: [...(currentWorkflow.materials?.items || []), newItem],
          },
        };
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData]
  );

  const updateMaterialItem = useCallback(
    (
      workflowType: WorkflowType,
      id: string,
      updates: Partial<MaterialItem>
    ) => {
      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          materials: {
            ...currentWorkflow.materials,
            items: (currentWorkflow.materials?.items || []).map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
          },
        };
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData]
  );

  const deleteMaterialItem = useCallback(
    (workflowType: WorkflowType, id: string) => {
      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          materials: {
            ...currentWorkflow.materials,
            items: (currentWorkflow.materials?.items || []).filter(
              (item) => item.id !== id
            ),
          },
        };
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData]
  );

  const setMaterialItems = useCallback(
    (workflowType: WorkflowType, items: MaterialItem[]) => {
      // Setting material items for workflow

      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          materials: {
            ...currentWorkflow.materials,
            items: items,
          },
        };
        // Updating workflow data with material items
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      } else {
        // Initialize the workflow if it doesn't exist
        const initialWorkflow = {
          labor: { hourlyItems: [], flatFeeItems: [] },
          materials: { items: [] },
          notes: { contractorNotes: '', clientNotes: '' },
          estimate: {
            laborTotal: 0,
            materialsTotal: 0,
            grandTotal: 0,
            lastUpdated: new Date().toISOString(),
          },
        };

        const updatedWorkflow = {
          ...initialWorkflow,
          materials: {
            ...initialWorkflow.materials,
            items: items,
          },
        };

        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData, estimateData.workflows]
  );

  // Notes updates
  const updateNotes = useCallback(
    (workflowType: WorkflowType, notes: Partial<WorkflowNotes>) => {
      const currentWorkflow = getWorkflowData(workflowType);
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          notes: {
            ...currentWorkflow.notes,
            ...notes,
          },
        };
        actions.updateWorkflowData(workflowType, updatedWorkflow);
      }
    },
    [actions, getWorkflowData]
  );

  // Persistence
  const saveData = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const dataToSave = actions.exportData();

      // Add current context data to the export
      const currentDemolitionData = getWorkflowData('demolition');
      const currentShowerWallsData = getWorkflowData('showerWalls');

      if (currentDemolitionData) {
        dataToSave.workflows = {
          ...dataToSave.workflows,
          demolition: {
            ...dataToSave.workflows?.demolition,
            ...currentDemolitionData,
          } as EstimateData['workflows']['demolition'],
        };
      }

      if (currentShowerWallsData) {
        dataToSave.workflows = {
          ...dataToSave.workflows,
          showerWalls: {
            ...dataToSave.workflows?.showerWalls,
            ...currentShowerWallsData,
          } as EstimateData['workflows']['showerWalls'],
        };
      }

      await saveEstimateMutation.mutateAsync({
        projectId,
        data: dataToSave,
      });

      setLastSaved(new Date());

      // After successful save, reload data from Supabase using the same transformation logic
      setIsReloading(true);
      const { data: freshData, error: loadError } = await supabase
        .from('estimates')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (loadError) {
        return;
      }

      if (freshData?.data) {
        // Use the same transformation logic as useLoadEstimate
        const rawData = freshData.data as Record<string, unknown>;

        if (rawData.workflows) {
          // Transform pricingMode to isDemolitionFlatFee
          const transformedWorkflows = { ...rawData.workflows } as Record<
            string,
            unknown
          >;

          // Transform demolition pricingMode to isDemolitionFlatFee
          const demolitionData = transformedWorkflows.demolition as Record<
            string,
            unknown
          >;
          if (
            demolitionData?.design &&
            typeof demolitionData.design === 'object'
          ) {
            const design = demolitionData.design as Record<string, unknown>;
            // Only transform if we have pricingMode and no isDemolitionFlatFee
            if (design.pricingMode && !design.isDemolitionFlatFee) {
              design.isDemolitionFlatFee =
                design.pricingMode === 'flatFee' ? 'yes' : 'no';
              delete design.pricingMode;
            }
            // If we have both pricingMode and isDemolitionFlatFee, keep isDemolitionFlatFee
            if (design.pricingMode && design.isDemolitionFlatFee) {
              delete design.pricingMode;
            }
          }

          // Transform demolition choices structure
          if (
            demolitionData?.design &&
            typeof demolitionData.design === 'object'
          ) {
            const design = demolitionData.design as Record<string, unknown>;
            // Only transform if we have choices and no demolitionChoices
            if (design.choices && !design.demolitionChoices) {
              design.demolitionChoices = design.choices;
              delete design.choices;
            }
            // If we have both choices and demolitionChoices, keep demolitionChoices
            if (design.choices && design.demolitionChoices) {
              delete design.choices;
            }
          }

          const transformedData = {
            projectId,
            projectNotes: (rawData.projectNotes as string) || '',
            lastUpdated: rawData.lastUpdated || freshData.updated_at,
            workflows: transformedWorkflows as EstimateData['workflows'],
            estimate: (rawData.estimate as EstimateData['estimate']) || {
              totalLabor: 0,
              totalMaterials: 0,
              grandTotal: 0,
              breakdown: [],
            },
          };

          actions.importData(transformedData);
        }
      }
    } catch {
      setError('Save failed. Please try again.');
      throw error;
    } finally {
      setIsSaving(false);
      setIsReloading(false);
    }
  }, [actions, saveEstimateMutation, projectId]);

  // Autosave function that uses the existing saveData function
  const autosave = useCallback(async () => {
    if (isSaving || typeof loadedData === 'undefined') {
      return;
    }

    try {
      // Use the existing saveData function to maintain consistency
      await saveData();
    } catch {
      // Silent autosave failure - no need to show to user
    }
  }, [isSaving, loadedData, saveData]);

  const loadData = useCallback(async () => {
    // Data is automatically loaded via useLoadEstimate query
  }, []);

  // Periodic autosave effect - runs every 5 seconds
  useEffect(() => {
    if (typeof loadedData === 'undefined') {
      return;
    }

    // Set up the interval
    autosaveIntervalRef.current = setInterval(() => {
      autosave();
    }, AUTOSAVE_INTERVAL);

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
        autosaveIntervalRef.current = null;
      }
    };
  }, [loadedData, autosave]);

  // Totals
  const getWorkflowTotals = useCallback(
    (workflowType: WorkflowType) => {
      const workflow = getWorkflowData(workflowType);
      if (!workflow) {
        return { laborTotal: 0, materialsTotal: 0, grandTotal: 0 };
      }

      const laborTotal =
        (workflow.labor?.hourlyItems || []).reduce(
          (sum, item) =>
            sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
          0
        ) +
        (workflow.labor?.flatFeeItems || []).reduce(
          (sum, item) => sum + (parseFloat(item.unitPrice) || 0),
          0
        );

      const materialsTotal = (workflow.materials?.items || []).reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

      return {
        laborTotal,
        materialsTotal,
        grandTotal: laborTotal + materialsTotal,
      };
    },
    [getWorkflowData]
  );

  const getAllTotals = useCallback(() => {
    const workflowTypes: WorkflowType[] = [
      'demolition',
      'showerWalls',
      'showerBase',
      'floors',
      'finishings',
      'structural',
      'trade',
    ];

    let totalLabor = 0;
    let totalMaterials = 0;

    workflowTypes.forEach((workflowType) => {
      const workflowTotals = getWorkflowTotals(workflowType);
      totalLabor += workflowTotals.laborTotal;
      totalMaterials += workflowTotals.materialsTotal;
    });

    const grandTotal = totalLabor + totalMaterials;

    return {
      totalLabor,
      totalMaterials,
      grandTotal,
    };
  }, [getWorkflowTotals]);

  const contextValue: EstimateWorkflowContextType = {
    estimateData,
    isLoading: isLoadingData,
    isSaving,
    isReloading,
    error,
    lastSaved,
    getWorkflowData,
    getDesignData,
    getLaborItems,
    getFlatFeeItems,
    getMaterialItems,
    getNotes,
    updateDesign,
    addLaborItem,
    updateLaborItem,
    deleteLaborItem,
    setLaborItems,
    addFlatFeeItem,
    updateFlatFeeItem,
    deleteFlatFeeItem,
    setFlatFeeItems,
    addMaterialItem,
    updateMaterialItem,
    deleteMaterialItem,
    setMaterialItems,
    updateNotes,
    saveData,
    loadData,
    getWorkflowTotals,
    getAllTotals,
  };

  return (
    <EstimateWorkflowContext.Provider value={contextValue}>
      {children}
    </EstimateWorkflowContext.Provider>
  );
}

export function useEstimateWorkflowContext() {
  const context = useContext(EstimateWorkflowContext);
  if (context === undefined) {
    throw new Error(
      'useEstimateWorkflowContext must be used within an EstimateWorkflowProvider'
    );
  }
  return context;
}
