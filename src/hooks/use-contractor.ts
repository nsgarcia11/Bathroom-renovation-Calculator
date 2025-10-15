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
    retry: (failureCount, error) => {
      // Retry up to 2 times for network errors, but not for auth errors
      if (
        failureCount < 2 &&
        error instanceof Error &&
        !error.message.includes('JWT')
      ) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractorData: Partial<Contractor>) => {
      // First try to refresh the session
      const { error: sessionError } = await supabase.auth.refreshSession();

      if (sessionError) {
        console.error('Session refresh error:', sessionError);
      }

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
