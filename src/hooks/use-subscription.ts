import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Subscription, PdfExport } from '@/types';
import { PLANS, FREE_PDF_EXPORT_LIMIT } from '@/lib/plans';

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

export interface SubscriptionLimits {
  currentPlan: (typeof PLANS)[string];
  canCreateEstimate: boolean;
  canExportPdf: boolean;
  isRedownload: (projectId: string) => boolean;
  estimatesUsed: number;
  estimatesRemaining: number | null;
  pdfExportsUsed: number;
  freePdfRemaining: number;
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
  const pdfExportsUsed = pdfExports?.length || 0;

  const isPaidPlan =
    (planId === 'starter' || planId === 'pro') &&
    subscription?.status === 'active';

  const pdfLimitReached =
    !isPaidPlan && pdfExportsUsed >= FREE_PDF_EXPORT_LIMIT;
  const freePdfRemaining = isPaidPlan
    ? Infinity
    : Math.max(0, FREE_PDF_EXPORT_LIMIT - pdfExportsUsed);

  // Estimate limits
  let canCreateEstimate = true;
  let estimatesRemaining: number | null = null;

  if (planId === 'pro' && isPaidPlan) {
    canCreateEstimate = true;
    estimatesRemaining = null;
  } else if (planId === 'starter' && isPaidPlan) {
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

  // PDF export limits — paid plans: unlimited, everyone else: 3 free exports
  const canExportPdf = isPaidPlan || !pdfLimitReached;

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
    freePdfRemaining,
    needsUpgrade,
    isLoading,
  };
}
