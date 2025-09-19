import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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

interface EstimateData {
  demolitionChoices: DemolitionChoices;
  debrisDisposal: 'yes' | 'no';
  isDemolitionFlatFee: 'yes' | 'no';
  flatFeeAmount: string;
  flatFeeDescription: string;
  demolitionNotes: string;
  laborItems?: Array<{
    id: string;
    name: string;
    hours: string;
    rate: string;
    color?: string;
  }>;
  flatFeeItems?: Array<{
    id: string;
    name: string;
    price: string;
  }>;
  constructionMaterials?: Array<{
    id: string;
    name: string;
    quantity: string;
    price: string;
    unit: string;
    color?: string;
  }>;
  projectNotes: string;
  categoryWorkflowData?: Record<
    string,
    {
      labor: {
        laborItems: Array<{
          id: string;
          name: string;
          hours: string;
          rate: string;
          color?: string;
        }>;
        flatFeeItems: Array<{ id: string; name: string; price: string }>;
      };
      materials: {
        constructionMaterials: Array<{
          id: string;
          name: string;
          quantity: string;
          price: string;
          unit: string;
          color?: string;
        }>;
      };
      estimate: { projectNotes: string };
    }
  >;
}

export function useEstimateData(projectId: string) {
  return useQuery({
    queryKey: ['estimate-data', projectId],
    queryFn: async (): Promise<EstimateData | null> => {
      const { data, error } = await supabase
        .from('workflow_screens')
        .select('*')
        .eq('project_id', projectId)
        .eq('screen_type', 'demolition')
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (error) {
        throw error;
      }

      return (data?.data as EstimateData) || null;
    },
    enabled: !!projectId,
  });
}

export function useSaveEstimateData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      data,
    }: {
      projectId: string;
      data: EstimateData;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if workflow screen exists
      const { data: existingScreen } = await supabase
        .from('workflow_screens')
        .select('id')
        .eq('project_id', projectId)
        .eq('screen_type', 'demolition')
        .single();

      if (existingScreen) {
        // Update existing screen
        const { data: updatedData, error: updateError } = await supabase
          .from('workflow_screens')
          .update({
            data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingScreen.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return updatedData;
      } else {
        // Create new screen
        const { data: newData, error: insertError } = await supabase
          .from('workflow_screens')
          .insert({
            project_id: projectId,
            screen_type: 'demolition',
            data,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newData;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['estimate-data', data.project_id],
      });
    },
  });
}
