import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Subscription, PdfExport } from '@/types';
import {
  PLANS,
  FREE_REPORT_LIMIT,
  STARTER_REPORT_LIMIT,
} from '@/lib/plans';
import { useAuth } from '@/contexts/AuthContext';

export function useSubscription() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async (): Promise<Subscription | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Subscription fetch error:', error);
        return null;
      }

      return data;
    },
    enabled: !!user,
    staleTime: 30_000,
    retry: false,
  });
}

export function usePdfExports() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['pdf-exports', user?.id],
    queryFn: async (): Promise<PdfExport[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('pdf_exports')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('PDF exports fetch error:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user,
    retry: false,
  });
}

export function useRecordPdfExport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('pdf_exports')
        .upsert(
          { user_id: user.id, project_id: projectId },
          { onConflict: 'user_id,project_id', ignoreDuplicates: true }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdf-exports'] });
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

export interface SubscriptionLimits {
  currentPlan: (typeof PLANS)[string];
  canCreateEstimate: boolean;
  canExportPdf: boolean;
  estimatesUsed: number;
  estimatesRemaining: number | null;
  reportsUsed: number;
  reportsRemaining: number | null;
  reportLimit: number | null;
  needsUpgrade: boolean;
  isLoading: boolean;
}

export function useSubscriptionLimits(
  projectCount: number
): SubscriptionLimits {
  const { data: subscription, isLoading: subLoading } = useSubscription();
  const { data: pdfExports, isLoading: exportsLoading } = usePdfExports();

  const isLoading = subLoading || exportsLoading;

  const planId = subscription?.plan_id || 'free';
  const plan = PLANS[planId] || PLANS.free;

  const isPaidPlan =
    (planId === 'starter' || planId === 'pro') &&
    subscription?.status === 'active';

  // Count reports (PDF exports) based on plan type
  // - Free: count ALL exports (lifetime limit)
  // - Starter: count only exports within current billing period (monthly limit)
  // - Pro: unlimited
  const reportsUsed = useMemo(() => {
    const allExports = pdfExports || [];

    if (planId === 'pro' && isPaidPlan) {
      return allExports.length;
    }

    if (
      planId === 'starter' &&
      isPaidPlan &&
      subscription?.current_period_start
    ) {
      const periodStart = new Date(subscription.current_period_start);
      return allExports.filter(
        (e) => new Date(e.created_at) >= periodStart
      ).length;
    }

    // Free plan: all exports count
    return allExports.length;
  }, [pdfExports, planId, isPaidPlan, subscription?.current_period_start]);

  // Report (PDF export) limits per plan
  let canExportPdf = true;
  let reportsRemaining: number | null = null;
  let reportLimit: number | null = null;

  if (planId === 'pro' && isPaidPlan) {
    // Pro: unlimited
    canExportPdf = true;
    reportsRemaining = null;
    reportLimit = null;
  } else if (planId === 'starter' && isPaidPlan) {
    // Starter: 8 reports per billing period
    reportLimit = STARTER_REPORT_LIMIT;
    reportsRemaining = Math.max(0, STARTER_REPORT_LIMIT - reportsUsed);
    canExportPdf = reportsRemaining > 0;
  } else {
    // Free: 3 reports total (lifetime)
    reportLimit = FREE_REPORT_LIMIT;
    reportsRemaining = Math.max(0, FREE_REPORT_LIMIT - reportsUsed);
    canExportPdf = reportsRemaining > 0;
  }

  // Estimate (project creation) limits
  let canCreateEstimate = true;
  let estimatesRemaining: number | null = null;

  if (isPaidPlan) {
    // Starter & Pro: unlimited project creation
    canCreateEstimate = true;
    estimatesRemaining = null;
  } else {
    // Free tier: 3 total
    estimatesRemaining = Math.max(
      0,
      (plan.estimateLimit || 3) - projectCount
    );
    canCreateEstimate = estimatesRemaining > 0;
  }

  const needsUpgrade = !canCreateEstimate || !canExportPdf;

  return {
    currentPlan: plan,
    canCreateEstimate,
    canExportPdf,
    estimatesUsed: projectCount,
    estimatesRemaining,
    reportsUsed,
    reportsRemaining,
    reportLimit,
    needsUpgrade,
    isLoading,
  };
}
