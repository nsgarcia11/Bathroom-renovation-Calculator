import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Contractor } from '@/types';

export function useContractor() {
  return useQuery({
    queryKey: ['contractor'],
    queryFn: async (): Promise<Contractor | null> => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return null;
        }

        // Try a simpler query first
        const { data, error } = await supabase
          .from('contractors')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          return data[0];
        } else {
          return null;
        }
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });
}

export function useUpdateContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractorData: Partial<Contractor>) => {
      
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!user) {
        console.error('No user found');
        throw new Error('User not authenticated');
      }

      // First, try to get existing contractor record
      const { data: existingContractor } = await supabase
        .from('contractors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let data, error;

      if (existingContractor) {
        // Update existing record
        const { data: updateData, error: updateError } = await supabase
          .from('contractors')
          .update({
            ...contractorData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingContractor.id)
          .select()
          .single();

        data = updateData;
        error = updateError;
      } else {
        // Create new record
        const { data: insertData, error: insertError } = await supabase
          .from('contractors')
          .insert({
            user_id: user.id,
            ...contractorData,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        data = insertData;
        error = insertError;
      }

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch contractor data
      queryClient.invalidateQueries({ queryKey: ['contractor'] });
      // Also set the data directly to ensure immediate update
      queryClient.setQueryData(['contractor'], data);
    },
  });
}
