import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { WorkflowScreenData } from '@/types';

export function useSaveWorkflowData(screenType: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkflowScreenData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // In a real app, you'd save to the database
      console.log('Saving workflow data:', { screenType, data });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return data;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['workflow-data'] });
    },
  });
}
