import { useState, useCallback, useMemo } from 'react';
import { EstimateData, WorkflowType, WorkflowData } from '@/types/estimate';

const createEmptyEstimateData = (projectId: string): EstimateData => ({
  projectId,
  projectNotes: '',
  lastUpdated: new Date().toISOString(),
  workflows: {
    demolition: {
      design: {
        demolitionChoices: {
          removeFlooring: 'no',
          removeShowerWall: 'no',
          removeShowerBase: 'no',
          removeTub: 'no',
          removeVanity: 'no',
          removeToilet: 'no',
          removeAccessories: 'no',
          removeWall: 'no',
        },
        debrisDisposal: 'no',
        isDemolitionFlatFee: 'no',
        flatFeeAmount: '',
        flatFeeDescription: 'Demolition & Debris Removal',
      },
      workflow: {
        labor: { hourlyItems: [], flatFeeItems: [] },
        materials: { items: [] },
        notes: { contractorNotes: '', clientNotes: '' },
        estimate: {
          laborTotal: 0,
          materialsTotal: 0,
          grandTotal: 0,
          lastUpdated: new Date().toISOString(),
        },
      },
    },
    showerWalls: {
      design: {
        measurements: { width: '0', height: '0', length: '0' },
        wallType: 'tile',
        waterproofing: 'no',
      },
      workflow: {
        labor: { hourlyItems: [], flatFeeItems: [] },
        materials: { items: [] },
        notes: { contractorNotes: '', clientNotes: '' },
        estimate: {
          laborTotal: 0,
          materialsTotal: 0,
          grandTotal: 0,
          lastUpdated: new Date().toISOString(),
        },
      },
    },
    showerBase: {
      design: {
        measurements: { width: '0', length: '0', depth: '0' },
        baseType: 'tile',
        waterproofing: 'no',
        drainType: 'center',
        slopeType: 'standard',
      },
      workflow: {
        labor: { hourlyItems: [], flatFeeItems: [] },
        materials: { items: [] },
        notes: { contractorNotes: '', clientNotes: '' },
        estimate: {
          laborTotal: 0,
          materialsTotal: 0,
          grandTotal: 0,
          lastUpdated: new Date().toISOString(),
        },
      },
    },
    floors: {
      design: {
        measurements: { width: 0, length: 0, extraMeasurements: [] },
        design: { tilePattern: '', notes: '' },
        construction: {
          selectedPrepTasks: [],
          plywoodThickness: '',
          constructionNotes: '',
        },
      },
      workflow: {
        labor: { hourlyItems: [], flatFeeItems: [] },
        materials: { items: [] },
        notes: { contractorNotes: '', clientNotes: '' },
        estimate: {
          laborTotal: 0,
          materialsTotal: 0,
          grandTotal: 0,
          lastUpdated: new Date().toISOString(),
        },
      },
    },
    finishings: {
      design: {
        designChoices: { selectedFinishes: [], paintColors: [], fixtures: [] },
        finishingsScope: { selectedScopes: [], customScope: '' },
        accentWalls: { hasAccentWall: false, paintType: '', wallLocations: [] },
      },
      workflow: {
        labor: { hourlyItems: [], flatFeeItems: [] },
        materials: { items: [] },
        notes: { contractorNotes: '', clientNotes: '' },
        estimate: {
          laborTotal: 0,
          materialsTotal: 0,
          grandTotal: 0,
          lastUpdated: new Date().toISOString(),
        },
      },
    },
    structural: {
      design: {
        choices: {
          electrical: [],
          plumbing: [],
          ventilation: [],
          structural: [],
        },
      },
      workflow: {
        labor: { hourlyItems: [], flatFeeItems: [] },
        materials: { items: [] },
        notes: { contractorNotes: '', clientNotes: '' },
        estimate: {
          laborTotal: 0,
          materialsTotal: 0,
          grandTotal: 0,
          lastUpdated: new Date().toISOString(),
        },
      },
    },
    trade: {
      design: {
        choices: {
          electrical: [],
          plumbing: [],
          hvac: [],
          flooring: [],
          tile: [],
          paint: [],
        },
      },
      workflow: {
        labor: { hourlyItems: [], flatFeeItems: [] },
        materials: { items: [] },
        notes: { contractorNotes: '', clientNotes: '' },
        estimate: {
          laborTotal: 0,
          materialsTotal: 0,
          grandTotal: 0,
          lastUpdated: new Date().toISOString(),
        },
      },
    },
  },
  estimate: {
    totalLabor: 0,
    totalMaterials: 0,
    grandTotal: 0,
    breakdown: [],
  },
});

export function useEstimateData(projectId: string, initialData?: EstimateData) {
  const [estimateData, setEstimateData] = useState<EstimateData>(
    initialData || createEmptyEstimateData(projectId)
  );

  // Update specific workflow
  const updateWorkflow = useCallback(
    (workflowType: WorkflowType, workflowData: Partial<unknown>) => {
      setEstimateData((prev) => ({
        ...prev,
        workflows: {
          ...prev.workflows,
          [workflowType]: {
            ...prev.workflows[workflowType],
            ...workflowData,
          },
        },
        lastUpdated: new Date().toISOString(),
      }));
    },
    []
  );

  // Update workflow design
  const updateWorkflowDesign = useCallback(
    (workflowType: WorkflowType, designData: unknown) => {
      setEstimateData((prev) => ({
        ...prev,
        workflows: {
          ...prev.workflows,
          [workflowType]: {
            ...prev.workflows[workflowType],
            design: {
              ...(prev.workflows[workflowType]?.design || {}),
              ...(designData || {}),
            },
          },
        },
        lastUpdated: new Date().toISOString(),
      }));
    },
    []
  );

  // Update workflow labor/materials/notes
  const updateWorkflowData = useCallback(
    (workflowType: WorkflowType, workflowData: WorkflowData) => {
      setEstimateData((prev) => ({
        ...prev,
        workflows: {
          ...prev.workflows,
          [workflowType]: {
            ...prev.workflows[workflowType],
            workflow: workflowData,
          },
        },
        lastUpdated: new Date().toISOString(),
      }));
    },
    []
  );

  // Calculate overall estimate totals
  const overallTotals = useMemo(() => {
    const workflows = Object.values(estimateData.workflows);

    const totalLabor = workflows.reduce(
      (sum, workflow) => sum + (workflow.workflow?.estimate?.laborTotal || 0),
      0
    );

    const totalMaterials = workflows.reduce(
      (sum, workflow) =>
        sum + (workflow.workflow?.estimate?.materialsTotal || 0),
      0
    );

    const grandTotal = totalLabor + totalMaterials;

    const breakdown = Object.entries(estimateData.workflows).map(
      ([key, workflow]) => ({
        workflow: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        laborCost: workflow.workflow?.estimate?.laborTotal || 0,
        materialsCost: workflow.workflow?.estimate?.materialsTotal || 0,
        total: workflow.workflow?.estimate?.grandTotal || 0,
      })
    );

    return {
      totalLabor,
      totalMaterials,
      grandTotal,
      breakdown,
    };
  }, [estimateData.workflows]);

  // Note: overallTotals is calculated in useMemo and doesn't need to be stored in state
  // This prevents circular dependencies when updating workflow data

  // Get specific workflow data
  const getWorkflowData = useCallback(
    (workflowType: WorkflowType) => {
      return estimateData.workflows[workflowType];
    },
    [estimateData.workflows]
  );

  // Export/import for persistence
  const exportData = useCallback(() => {
    return {
      ...estimateData,
      lastUpdated: new Date().toISOString(),
    };
  }, [estimateData]);

  const importData = useCallback((data: EstimateData) => {
    setEstimateData(data);
  }, []);

  return {
    estimateData,
    actions: {
      updateWorkflow,
      updateWorkflowDesign,
      updateWorkflowData,
      getWorkflowData,
      exportData,
      importData,
    },
    totals: overallTotals,
    workflows: estimateData.workflows,
  };
}
