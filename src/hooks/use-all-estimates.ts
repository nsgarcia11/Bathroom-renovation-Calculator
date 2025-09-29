import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { EstimateData } from '@/types/estimate';

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
                workflows: transformedWorkflows as any,
                estimate: (rawData.estimate as any) || {
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
                workflows: {} as any,
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

export function useTotalProjectValue() {
  const { data: estimates, isLoading } = useAllEstimates();

  const totalValue =
    estimates?.reduce((sum, estimate) => {
      return sum + (estimate.estimate?.grandTotal || 0);
    }, 0) || 0;

  return {
    totalValue,
    isLoading,
    estimatesCount: estimates?.length || 0,
  };
}
