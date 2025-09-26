import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  WorkflowData,
  WorkflowDesignData,
  WorkflowNotes,
  LaborItem,
  MaterialItem,
  FlatFeeItem,
  UseWorkflowReturn,
} from '@/types/estimate';

const createEmptyWorkflowData = <
  TDesign = WorkflowDesignData
>(): WorkflowData<TDesign> => ({
  labor: {
    hourlyItems: [],
    flatFeeItems: [],
  },
  materials: {
    items: [],
  },
  notes: {
    contractorNotes: '',
    clientNotes: '',
  },
  estimate: {
    laborTotal: 0,
    materialsTotal: 0,
    grandTotal: 0,
    lastUpdated: new Date().toISOString(),
  },
});

export function useEstimateWorkflow<TDesign = WorkflowDesignData>(
  initialDesign?: TDesign,
  initialWorkflow?: WorkflowData<TDesign>
): UseWorkflowReturn<TDesign, WorkflowData<TDesign>> {
  const [design, setDesign] = useState<TDesign>(
    initialDesign || ({} as TDesign)
  );
  const [workflow, setWorkflow] = useState<WorkflowData<TDesign>>(
    initialWorkflow || createEmptyWorkflowData<TDesign>()
  );

  // Design actions
  const updateDesign = useCallback((updates: Partial<TDesign>) => {
    setDesign((prev) => {
      const newDesign = { ...prev, ...updates };
      return newDesign;
    });
  }, []);

  // Labor actions
  const addLaborItem = useCallback((item: Omit<LaborItem, 'id'>) => {
    const newItem: LaborItem = {
      ...item,
      id: `labor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    console.log('useEstimateWorkflow: addLaborItem called with', {
      newItem: newItem,
    });
    setWorkflow((prev) => {
      const newWorkflow = {
        ...prev,
        labor: {
          ...prev.labor,
          hourlyItems: [...(prev.labor?.hourlyItems || []), newItem],
        },
      };
      console.log('useEstimateWorkflow: Added labor item, new state', {
        laborItems: newWorkflow.labor?.hourlyItems?.length || 0,
        items: newWorkflow.labor?.hourlyItems,
      });
      return newWorkflow;
    });
  }, []);

  const updateLaborItem = useCallback(
    (id: string, updates: Partial<LaborItem>) => {
      setWorkflow((prev) => ({
        ...prev,
        labor: {
          ...prev.labor,
          hourlyItems: (prev.labor?.hourlyItems || []).map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        },
      }));
    },
    []
  );

  const deleteLaborItem = useCallback((id: string) => {
    setWorkflow((prev) => ({
      ...prev,
      labor: {
        ...prev.labor,
        hourlyItems: (prev.labor?.hourlyItems || []).filter(
          (item) => item.id !== id
        ),
      },
    }));
  }, []);

  // Material actions
  const addMaterialItem = useCallback((item: Omit<MaterialItem, 'id'>) => {
    const newItem: MaterialItem = {
      ...item,
      id: `material-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setWorkflow((prev) => ({
      ...prev,
      materials: {
        ...prev.materials,
        items: [...(prev?.materials?.items || []), newItem],
      },
    }));
  }, []);

  const updateMaterialItem = useCallback(
    (id: string, updates: Partial<MaterialItem>) => {
      setWorkflow((prev) => ({
        ...prev,
        materials: {
          ...prev.materials,
          items: prev.materials.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        },
      }));
    },
    []
  );

  const deleteMaterialItem = useCallback((id: string) => {
    setWorkflow((prev) => ({
      ...prev,
      materials: {
        ...prev.materials,
        items: prev.materials.items.filter((item) => item.id !== id),
      },
    }));
  }, []);

  // Flat fee actions
  const addFlatFeeItem = useCallback((item: Omit<FlatFeeItem, 'id'>) => {
    const newItem: FlatFeeItem = {
      ...item,
      id: `flatfee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setWorkflow((prev) => ({
      ...prev,
      labor: {
        ...prev.labor,
        flatFeeItems: [...(prev.labor?.flatFeeItems || []), newItem],
      },
    }));
  }, []);

  const updateFlatFeeItem = useCallback(
    (id: string, updates: Partial<FlatFeeItem>) => {
      setWorkflow((prev) => ({
        ...prev,
        labor: {
          ...prev.labor,
          flatFeeItems: (prev.labor?.flatFeeItems || []).map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        },
      }));
    },
    []
  );

  const deleteFlatFeeItem = useCallback((id: string) => {
    setWorkflow((prev) => ({
      ...prev,
      labor: {
        ...prev.labor,
        flatFeeItems: (prev.labor?.flatFeeItems || []).filter(
          (item) => item.id !== id
        ),
      },
    }));
  }, []);

  // Set labor items with specific IDs (for replacing all items)
  const setLaborItems = useCallback((items: LaborItem[]) => {
    console.log('useEstimateWorkflow: setLaborItems called with', {
      count: items.length,
      items: items,
    });
    setWorkflow((prev) => {
      const newWorkflow = {
        ...prev,
        labor: {
          ...prev.labor,
          hourlyItems: items,
        },
      };
      console.log('useEstimateWorkflow: Updated workflow state', {
        laborItems: newWorkflow.labor?.hourlyItems?.length || 0,
        items: newWorkflow.labor?.hourlyItems,
      });
      return newWorkflow;
    });
  }, []);

  // Debug: Log workflow changes
  useEffect(() => {
    console.log('useEstimateWorkflow: Workflow state changed', {
      laborItems: workflow.labor?.hourlyItems?.length || 0,
      items: workflow.labor?.hourlyItems,
    });
  }, [workflow]);

  // Set flat fee items with specific IDs (for replacing all items)
  const setFlatFeeItems = useCallback((items: FlatFeeItem[]) => {
    setWorkflow((prev) => ({
      ...prev,
      labor: {
        ...prev.labor,
        flatFeeItems: items,
      },
    }));
  }, []);

  // Set material items with specific IDs (for replacing all items)
  const setMaterialItems = useCallback((items: MaterialItem[]) => {
    setWorkflow((prev) => ({
      ...prev,
      materials: {
        ...prev.materials,
        items: items,
      },
    }));
  }, []);

  // Notes actions
  const updateNotes = useCallback((notes: Partial<WorkflowNotes>) => {
    setWorkflow((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        ...notes,
      },
    }));
  }, []);

  // Calculated totals
  const totals = useMemo(() => {
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
        sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
      0
    );

    const grandTotal = laborTotal + materialsTotal;

    return {
      laborTotal,
      materialsTotal,
      grandTotal,
    };
  }, [
    workflow.labor?.hourlyItems,
    workflow.labor?.flatFeeItems,
    workflow.materials?.items,
  ]);

  // Data access methods
  const getData = useCallback(() => ({ design, workflow }), [design, workflow]);

  const setData = useCallback(
    (data: { design: TDesign; workflow: WorkflowData<TDesign> }) => {
      setDesign(data.design);
      setWorkflow(data.workflow);
    },
    []
  );

  return {
    design,
    workflow,
    actions: {
      updateDesign,
      addLaborItem,
      updateLaborItem,
      deleteLaborItem,
      setLaborItems,
      addMaterialItem,
      updateMaterialItem,
      deleteMaterialItem,
      setMaterialItems,
      addFlatFeeItem,
      updateFlatFeeItem,
      deleteFlatFeeItem,
      setFlatFeeItems,
      updateNotes,
    },
    totals,
    getData,
    setData,
  };
}
