import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Contractor } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useContractor() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['contractor', user?.id],
    queryFn: async (): Promise<Contractor | null> => {
      if (!user) {
        return null;
      }

      // Query contractors table for the user
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
    enabled: !!user, // Only fetch when user is authenticated
  });
}

export function useUpdateContractor() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractorData: Partial<Contractor>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First try to refresh the session
      const { error: sessionError } = await supabase.auth.refreshSession();

      if (sessionError) {
        console.error('Session refresh error:', sessionError);
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
      // Invalidate all contractor queries (matches ['contractor', <any-user-id>])
      queryClient.invalidateQueries({ queryKey: ['contractor'] });
      // Also set the data directly for immediate update
      if (user) {
        queryClient.setQueryData(['contractor', user.id], data);
      }
    },
  });
}
