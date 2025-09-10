import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Contractor } from '@/types';

export function useContractor() {
  return useQuery({
    queryKey: ['contractor'],
    queryFn: async (): Promise<Contractor | null> => {
      try {
        console.log('🔍 Fetching contractor data...');
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.log('❌ No user found');
          return null;
        }

        console.log('✅ User found:', user.email);

        // Try a simpler query first
        const { data, error } = await supabase
          .from('contractors')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('❌ Contractor fetch error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          return null;
        }

        if (data && data.length > 0) {
          console.log('✅ Contractor data found:', data[0]);
          return data[0];
        } else {
          console.log('ℹ️ No contractor data found for user');
          return null;
        }
      } catch (error) {
        console.error('❌ Contractor fetch error:', error);
        return null;
      }
    },
    retry: false,
  });
}

export function useUpdateContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractorData: Partial<Contractor>) => {
      console.log('Attempting to save contractor data:', contractorData);

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

      console.log('User authenticated:', user.id);

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

      console.log('Contractor saved successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Contractor mutation successful, updating cache');
      // Invalidate and refetch contractor data
      queryClient.invalidateQueries({ queryKey: ['contractor'] });
      // Also set the data directly to ensure immediate update
      queryClient.setQueryData(['contractor'], data);
    },
  });
}
