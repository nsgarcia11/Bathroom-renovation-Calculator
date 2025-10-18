import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  DemolitionWorkflow,
  EstimateData,
  FinishingsWorkflow,
  FloorWorkflow,
  ShowerBaseWorkflow,
  ShowerWallsWorkflow,
  StructuralWorkflow,
  TradesWorkflow,
} from '@/types/estimate';

export function useAllEstimates() {
  return useQuery({
    queryKey: ['all-estimates'],
    queryFn: async (): Promise<EstimateData[]> => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return [];

        // First get all projects for the user
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('id')
          .eq('user_id', user.id);

        if (projectsError) {
          console.error('Projects fetch error:', projectsError);
          return [];
        }

        if (!projects || projects.length === 0) return [];

        // Get all estimates for these projects
        const projectIds = projects.map((p) => p.id);
        const { data: estimates, error: estimatesError } = await supabase
          .from('estimates')
          .select('*')
          .in('project_id', projectIds);

        if (estimatesError) {
          console.error('Estimates fetch error:', estimatesError);
          return [];
        }

        if (!estimates) return [];

        // Transform the estimates data
        const transformedEstimates: EstimateData[] = estimates.map(
          (estimate) => {
            const rawData = estimate.data as Record<string, unknown>;

            if (rawData.workflows) {
              // New format - transform pricingMode to isDemolitionFlatFee
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

              return {
                projectId: estimate.project_id,
                projectNotes: (rawData.projectNotes as string) || '',
                lastUpdated: rawData.lastUpdated || estimate.updated_at,
                workflows: transformedWorkflows as Record<string, unknown> as {
                  demolition: DemolitionWorkflow;
                  showerWalls: ShowerWallsWorkflow;
                  showerBase: ShowerBaseWorkflow;
                  floors: FloorWorkflow;
                  finishings: FinishingsWorkflow;
                  structural: StructuralWorkflow;
                  trade: TradesWorkflow;
                },
                estimate: (rawData.estimate as {
                  totalLabor: number;
                  totalMaterials: number;
                  grandTotal: number;
                  breakdown: Array<{
                    workflow: string;
                    name: string;
                    laborCost: number;
                    materialsCost: number;
                    total: number;
                  }>;
                }) || {
                  totalLabor: 0,
                  totalMaterials: 0,
                  grandTotal: 0,
                  breakdown: [],
                },
              };
            } else {
              // Old format - return basic structure
              return {
                projectId: estimate.project_id,
                projectNotes: (rawData.projectNotes as string) || '',
                lastUpdated: rawData.lastUpdated || estimate.updated_at,
                workflows: {} as {
                  demolition: DemolitionWorkflow;
                  showerWalls: ShowerWallsWorkflow;
                  showerBase: ShowerBaseWorkflow;
                  floors: FloorWorkflow;
                  finishings: FinishingsWorkflow;
                  structural: StructuralWorkflow;
                  trade: TradesWorkflow;
                },
                estimate: {
                  totalLabor: 0,
                  totalMaterials: 0,
                  grandTotal: 0,
                  breakdown: [],
                },
              };
            }
          }
        );

        return transformedEstimates;
      } catch (error) {
        console.error('Error fetching all estimates:', error);
        return [];
      }
    },
    retry: false,
  });
}

// Helper function to calculate grand total from workflow data
function calculateGrandTotal(workflows: Record<string, unknown>): number {
  if (!workflows) return 0;

  let totalLabor = 0;
  let totalMaterials = 0;

  Object.values(workflows).forEach((workflow: unknown) => {
    const workflowData = workflow as Record<string, unknown>;
    if (workflowData?.workflow) {
      const workflowInfo = workflowData.workflow as Record<string, unknown>;

      // Calculate labor total
      const hourlyItems =
        ((workflowInfo.labor as Record<string, unknown>)?.hourlyItems as Array<
          Record<string, unknown>
        >) || [];
      const flatFeeItems =
        ((workflowInfo.labor as Record<string, unknown>)?.flatFeeItems as Array<
          Record<string, unknown>
        >) || [];

      const laborTotal =
        hourlyItems.reduce(
          (sum: number, item: Record<string, unknown>) =>
            sum +
            (parseFloat(item.hours as string) || 0) *
              (parseFloat(item.rate as string) || 0),
          0
        ) +
        flatFeeItems.reduce(
          (sum: number, item: Record<string, unknown>) =>
            sum + (parseFloat(item.unitPrice as string) || 0),
          0
        );

      // Calculate materials total
      const materialItems =
        ((workflowInfo.materials as Record<string, unknown>)?.items as Array<
          Record<string, unknown>
        >) || [];
      const materialsTotal = materialItems.reduce(
        (sum: number, item: Record<string, unknown>) =>
          sum +
          (parseFloat(item.quantity as string) || 0) *
            (parseFloat(item.price as string) || 0),
        0
      );

      totalLabor += laborTotal;
      totalMaterials += materialsTotal;
    }
  });

  return totalLabor + totalMaterials;
}

export function useTotalProjectValue() {
  const { data: estimates, isLoading } = useAllEstimates();

  const totalValue =
    estimates?.reduce((sum, estimate) => {
      // Try to get grandTotal from estimate.estimate first, then calculate from workflows
      const storedGrandTotal = estimate.estimate?.grandTotal || 0;
      const calculatedGrandTotal = calculateGrandTotal(estimate.workflows);

      // Use the calculated value if stored value is 0 or if it's more accurate
      const finalValue =
        storedGrandTotal > 0 ? storedGrandTotal : calculatedGrandTotal;

      return sum + finalValue;
    }, 0) || 0;

  return {
    totalValue,
    isLoading,
    estimatesCount: estimates?.length || 0,
  };
}
