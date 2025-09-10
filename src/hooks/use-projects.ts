import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Projects fetch error:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Projects fetch error:', error);
        return [];
      }
    },
    retry: false,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async (): Promise<Project | null> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      projectData: Omit<
        Project,
        'id' | 'created_at' | 'updated_at' | 'contractor_id' | 'user_id'
      >
    ) => {
      console.log('🏗️ Creating project with data:', projectData);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('✅ User authenticated:', user.id);

      // Get contractor data to get contractor_id (handle multiple records)
      const { data: contractors, error: contractorError } = await supabase
        .from('contractors')
        .select('id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (contractorError) {
        console.error('❌ Contractor fetch error:', contractorError);
        throw new Error('Contractor not found. Please complete setup first.');
      }

      if (!contractors || contractors.length === 0) {
        throw new Error('Contractor not found. Please complete setup first.');
      }

      // Use the most recent contractor record
      const contractor = contractors[0];
      console.log(
        '✅ Contractor found:',
        contractor.id,
        '(using most recent of',
        contractors.length,
        'records)'
      );

      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          user_id: user.id,
          contractor_id: contractor.id,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Project creation error:', error);
        throw error;
      }

      console.log('✅ Project created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...projectData
    }: Partial<Project> & { id: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .update({
          ...projectData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
