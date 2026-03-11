import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Subscription, PdfExport } from '@/types';
import { PLANS, FOUNDERS_TRIAL_PDF_LIMIT } from '@/lib/plans';

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async (): Promise<Subscription | null> => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
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
      } catch (error) {
        console.error('Subscription fetch error:', error);
        return null;
      }
    },
    staleTime: 30_000,
    retry: false,
  });
}

export function usePdfExports() {
  return useQuery({
    queryKey: ['pdf-exports'],
    queryFn: async (): Promise<PdfExport[]> => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
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
      } catch (error) {
        console.error('PDF exports fetch error:', error);
        return [];
      }
    },
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

function useExpireTrialIfNeeded() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('subscriptions')
        .update({
          trial_status: 'expired',
          plan_id: 'free',
        })
        .eq('user_id', user.id)
        .eq('trial_status', 'active');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

export interface SubscriptionLimits {
  currentPlan: (typeof PLANS)[string];
  canCreateEstimate: boolean;
  canExportPdf: boolean;
  isRedownload: (projectId: string) => boolean;
  estimatesUsed: number;
  estimatesRemaining: number | null;
  pdfExportsUsed: number;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  trialPdfRemaining: number;
  needsUpgrade: boolean;
  isLoading: boolean;
}

export function useSubscriptionLimits(
  projectCount: number
): SubscriptionLimits {
  const { data: subscription, isLoading: subLoading } = useSubscription();
  const { data: pdfExports, isLoading: exportsLoading } = usePdfExports();
  const expireTrial = useExpireTrialIfNeeded();
  const hasExpiredRef = useRef(false);

  const isLoading = subLoading || exportsLoading;

  const planId = subscription?.plan_id || 'free';
  const plan = PLANS[planId] || PLANS.free;
  const pdfExportsUsed = pdfExports?.length || 0;

  // Trial calculations
  const isTrialPlan = planId === 'founders_trial';
  const trialEndsAt = subscription?.trial_ends_at
    ? new Date(subscription.trial_ends_at)
    : null;
  const now = new Date();
  const trialDaysRemaining =
    trialEndsAt && isTrialPlan
      ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;
  const trialPdfRemaining = isTrialPlan
    ? Math.max(0, FOUNDERS_TRIAL_PDF_LIMIT - pdfExportsUsed)
    : 0;

  // Check if trial has expired
  const trialTimeExpired = isTrialPlan && trialEndsAt && now > trialEndsAt;
  const trialPdfExpired =
    isTrialPlan && pdfExportsUsed >= FOUNDERS_TRIAL_PDF_LIMIT;
  const isTrialActive =
    isTrialPlan &&
    subscription?.trial_status === 'active' &&
    !trialTimeExpired &&
    !trialPdfExpired;

  // Auto-expire trial if needed (fires once via ref guard)
  const shouldExpire =
    isTrialPlan &&
    subscription?.trial_status === 'active' &&
    trialTimeExpired &&
    !isLoading;

  useEffect(() => {
    if (shouldExpire && !hasExpiredRef.current) {
      hasExpiredRef.current = true;
      expireTrial.mutate();
    }
  }, [shouldExpire, expireTrial]);

  // Estimate limits
  const hasActiveSubscription =
    subscription?.status === 'active' || isTrialActive;

  let canCreateEstimate = true;
  let estimatesRemaining: number | null = null;

  if (isTrialActive) {
    canCreateEstimate = true;
    estimatesRemaining = null;
  } else if (planId === 'pro' && hasActiveSubscription) {
    canCreateEstimate = true;
    estimatesRemaining = null;
  } else if (planId === 'starter' && hasActiveSubscription) {
    estimatesRemaining = Math.max(
      0,
      (plan.estimateLimit || 8) - projectCount
    );
    canCreateEstimate = estimatesRemaining > 0;
  } else {
    // Free tier: 2 total
    estimatesRemaining = Math.max(0, (plan.estimateLimit || 2) - projectCount);
    canCreateEstimate = estimatesRemaining > 0;
  }

  // PDF export limits
  let canExportPdf = true;
  if (isTrialPlan && !isTrialActive) {
    canExportPdf = false;
  } else if (isTrialPlan && isTrialActive && trialPdfExpired) {
    canExportPdf = false;
  }

  const isRedownload = (projectId: string) => {
    return (pdfExports || []).some((e) => e.project_id === projectId);
  };

  const needsUpgrade = !canCreateEstimate || !canExportPdf;

  return {
    currentPlan: plan,
    canCreateEstimate,
    canExportPdf,
    isRedownload,
    estimatesUsed: projectCount,
    estimatesRemaining,
    pdfExportsUsed,
    isTrialActive,
    trialDaysRemaining,
    trialPdfRemaining,
    needsUpgrade,
    isLoading,
  };
}
