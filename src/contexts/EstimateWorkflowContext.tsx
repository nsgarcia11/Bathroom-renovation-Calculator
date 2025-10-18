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
import { supabase } from '@/lib/supabase';
import {
  EstimateData,
  WorkflowType,
  WorkflowData,
  LaborItem,
  MaterialItem,
  FlatFeeItem,
  WorkflowNotes,
} from '@/types/estimate';

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
  const { data: loadedData, isLoading: isLoadingData } =
    useLoadEstimate(projectId);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Autosave functionality
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const AUTOSAVE_DELAY = 3000; // 3 seconds delay

  // Load data when available (only once)
  useEffect(() => {
    if (loadedData && !initialData && !hasLoadedInitialData) {
      actions.importData(loadedData);
      setHasLoadedInitialData(true);
    }
  }, [loadedData, initialData, actions, hasLoadedInitialData]);

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
      return (
        estimateData.workflows?.[workflowType]?.workflow?.labor?.hourlyItems ||
        []
      );
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
    },
    [actions]
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

  // Autosave function
  const autosave = useCallback(async () => {
    if (isSaving || !hasLoadedInitialData) {
      return;
    }

    try {
      // Use a small delay to ensure all state updates are complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Use the exact same logic as the manual saveData function
      const dataToSave = actions.exportData();

      // Add current context data to the export (same as manual save)
      const currentDemolitionData = getWorkflowData('demolition');

      if (currentDemolitionData) {
        dataToSave.workflows = {
          ...dataToSave.workflows,
          demolition: {
            ...dataToSave.workflows?.demolition,
            ...currentDemolitionData,
          } as EstimateData['workflows']['demolition'],
        };
      }

      await saveEstimateMutation.mutateAsync({
        projectId,
        data: dataToSave,
      });

      setLastSaved(new Date());
    } catch (error) {
      console.error('Autosave failed:', error);
      // Don't set error state for autosave failures to avoid disrupting user experience
    }
  }, [
    actions,
    getWorkflowData,
    projectId,
    saveEstimateMutation,
    isSaving,
    hasLoadedInitialData,
  ]);

  // Debounced autosave effect - DISABLED FOR NOW
  // useEffect(() => {
  //   // Clear existing timeout
  //   if (autosaveTimeoutRef.current) {
  //     clearTimeout(autosaveTimeoutRef.current);
  //   }

  //   // Only autosave if we have loaded initial data and there are changes
  //   if (hasLoadedInitialData) {
  //     autosaveTimeoutRef.current = setTimeout(() => {
  //       autosave();
  //     }, AUTOSAVE_DELAY);
  //   }

  //   // Cleanup timeout on unmount
  //   return () => {
  //     if (autosaveTimeoutRef.current) {
  //       clearTimeout(autosaveTimeoutRef.current);
  //     }
  //   };
  // }, [estimateData, hasLoadedInitialData, autosave]);

  // Persistence
  const saveData = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const dataToSave = actions.exportData();

      // Add current context data to the export
      const currentDemolitionData = getWorkflowData('demolition');

      if (currentDemolitionData) {
        dataToSave.workflows = {
          ...dataToSave.workflows,
          demolition: {
            ...dataToSave.workflows?.demolition,
            ...currentDemolitionData,
          } as EstimateData['workflows']['demolition'],
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
    } catch (error) {
      setError('Save failed. Please try again.');
      throw error;
    } finally {
      setIsSaving(false);
      setIsReloading(false);
    }
  }, [actions, saveEstimateMutation, projectId]);

  const loadData = useCallback(async () => {
    // Data is automatically loaded via useLoadEstimate query
    console.log('Data loading is handled automatically');
  }, []);

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
