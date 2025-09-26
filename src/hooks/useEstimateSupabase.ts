/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { EstimateData } from '@/types/estimate';
import {
  EstimateDataPayload,
  migrateOldDataToNewStructure,
} from '@/types/supabase-estimate';

// Save estimate data to Supabase
export function useSaveEstimate() {
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

      // Debug: Check where save is being called from
      console.log('🚨 SAVE TRIGGERED - Stack trace:');
      console.trace();

      // Convert EstimateData to Supabase payload format
      const transformedWorkflows = { ...data.workflows } as Record<
        string,
        unknown
      >;

      // Transform demolition isDemolitionFlatFee to pricingMode
      const demolitionData = transformedWorkflows.demolition as Record<
        string,
        unknown
      >;
      if (demolitionData?.design && typeof demolitionData.design === 'object') {
        const design = demolitionData.design as Record<string, unknown>;
        if (design.isDemolitionFlatFee) {
          design.pricingMode =
            design.isDemolitionFlatFee === 'yes' ? 'flatFee' : 'hourly';
          delete design.isDemolitionFlatFee;
        }
      }

      // Transform demolition choices structure
      if (demolitionData?.design && typeof demolitionData.design === 'object') {
        const design = demolitionData.design as Record<string, unknown>;
        if (design.demolitionChoices) {
          design.choices = design.demolitionChoices;
          delete design.demolitionChoices;
        }
      }

      const payload: EstimateDataPayload = {
        projectNotes: data.projectNotes,
        lastUpdated: data.lastUpdated,
        workflows: transformedWorkflows as any,
        estimate: data.estimate,
      };

      // Upsert estimate (insert or update)
      const { data: upsertData, error: upsertError } = await supabase
        .from('estimates')
        .upsert(
          {
            project_id: projectId,
            data: payload,
            version: '2.0',
          },
          {
            onConflict: 'project_id',
          }
        )
        .select()
        .single();

      if (upsertError) throw upsertError;
      return upsertData;
    },
  });
}

// Load estimate data from Supabase
export function useLoadEstimate(projectId: string) {
  return useQuery({
    queryKey: ['estimate', projectId],
    queryFn: async (): Promise<EstimateData | null> => {
      if (!projectId) return null;

      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, return null
          return null;
        }
        throw error;
      }

      if (!data) return null;

      // Check if this is old data format and migrate if needed
      const rawData = data.data as Record<string, unknown>;

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
          projectId,
          projectNotes: (rawData.projectNotes as string) || '',
          lastUpdated: rawData.lastUpdated || data.updated_at,
          workflows: transformedWorkflows as any,
          estimate: (rawData.estimate as any) || {
            totalLabor: 0,
            totalMaterials: 0,
            grandTotal: 0,
            breakdown: [],
          },
        };
      } else {
        // Old format - migrate to new structure
        const migratedData = migrateOldDataToNewStructure(rawData);

        return {
          projectId,
          projectNotes: migratedData.projectNotes,
          lastUpdated: migratedData.lastUpdated,
          workflows: migratedData.workflows as any,
          estimate: migratedData.estimate,
        };
      }
    },
    enabled: !!projectId,
  });
}

// Delete estimate data
export function useDeleteEstimate() {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('estimates')
        .delete()
        .eq('project_id', projectId);

      if (error) throw error;
    },
  });
}

// Export estimate data as JSON
export function useExportEstimate() {
  return useCallback((data: EstimateData) => {
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      version: '2.0', // New data structure version
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `estimate-${data.projectId}-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);
}

// Import estimate data from JSON
export function useImportEstimate() {
  return useCallback(
    (
      file: File,
      onSuccess: (data: EstimateData) => void,
      onError: (error: string) => void
    ) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);

          // Validate data structure
          if (!importedData.workflows || !importedData.estimate) {
            throw new Error('Invalid estimate data format');
          }

          // Check version compatibility
          if (importedData.version && importedData.version !== '2.0') {
            console.warn(
              'Importing data from different version:',
              importedData.version
            );
          }

          onSuccess(importedData);
        } catch (error) {
          onError(
            `Failed to import estimate data: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        }
      };

      reader.readAsText(file);
    },
    []
  );
}
