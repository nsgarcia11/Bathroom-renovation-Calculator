'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import {
  useSubscription,
  useSubscriptionLimits,
  useRecordPdfExport,
  SubscriptionLimits,
} from '@/hooks/use-subscription';
import { useProjects } from '@/hooks/use-projects';
import { Subscription } from '@/types';
import { supabase } from '@/lib/supabase';
import { PLANS, FOUNDERS_TRIAL_PDF_LIMIT } from '@/lib/plans';

interface SubscriptionContextType {
  subscription: Subscription | null;
  limits: SubscriptionLimits;
  recordPdfExport: (projectId: string) => Promise<void>;
  checkAndRecordPdfExport: (projectId: string) => Promise<{ allowed: boolean }>;
  isRecordingExport: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { data: subscription } = useSubscription();
  const { data: projects } = useProjects();
  const projectCount = projects?.length || 0;
  const limits = useSubscriptionLimits(projectCount);
  const recordExportMutation = useRecordPdfExport();

  const recordPdfExport = async (projectId: string) => {
    await recordExportMutation.mutateAsync(projectId);
  };

  // Fresh database check + record in one step to prevent stale cache issues
  const checkAndRecordPdfExport = useCallback(
    async (projectId: string): Promise<{ allowed: boolean }> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { allowed: false };

      // Check if this is a re-download (always allowed)
      const { data: existingExport } = await supabase
        .from('pdf_exports')
        .select('id')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .maybeSingle();

      if (existingExport) return { allowed: true };

      // Get fresh subscription data
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!sub) return { allowed: false };

      const planId = sub.plan_id;

      // Paid plans: allowed if subscription is active
      if (
        (planId === 'starter' || planId === 'pro') &&
        sub.status === 'active'
      ) {
        await recordExportMutation.mutateAsync(projectId);
        return { allowed: true };
      }

      // Founders trial: check time + PDF count
      if (planId === 'founders_trial' && sub.trial_status === 'active') {
        const trialEndsAt = sub.trial_ends_at
          ? new Date(sub.trial_ends_at)
          : null;
        if (trialEndsAt && new Date() > trialEndsAt) {
          return { allowed: false };
        }

        // Fresh count from database
        const { count } = await supabase
          .from('pdf_exports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if ((count || 0) >= FOUNDERS_TRIAL_PDF_LIMIT) {
          return { allowed: false };
        }

        await recordExportMutation.mutateAsync(projectId);
        return { allowed: true };
      }

      // Free plan: check plan config
      if (PLANS[planId]?.pdfExportEnabled) {
        await recordExportMutation.mutateAsync(projectId);
        return { allowed: true };
      }

      return { allowed: false };
    },
    [recordExportMutation]
  );

  return (
    <SubscriptionContext.Provider
      value={{
        subscription: subscription || null,
        limits,
        recordPdfExport,
        checkAndRecordPdfExport,
        isRecordingExport: recordExportMutation.isPending,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useSubscriptionContext must be used within a SubscriptionProvider'
    );
  }
  return context;
}
