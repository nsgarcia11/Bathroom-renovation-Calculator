import { PlanId } from '@/types';

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number;
  estimateLimit: number | null;
  estimateLimitType: 'total' | 'monthly';
  pdfExportEnabled: boolean;
  priorityOnboarding: boolean;
  description: string;
  features: string[];
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    estimateLimit: 2,
    estimateLimitType: 'total',
    pdfExportEnabled: true,
    priorityOnboarding: false,
    description: 'Get started with basic estimating',
    features: [
      '2 estimates total',
      '3 free PDF exports',
      'Cloud-ready estimates',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 14.99,
    estimateLimit: 8,
    estimateLimitType: 'monthly',
    pdfExportEnabled: true,
    priorityOnboarding: false,
    description: 'For active contractors',
    features: [
      'Everything in Free',
      '8 estimates per month',
      'Professional PDF export',
      'Cloud-ready estimates',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    estimateLimit: null,
    estimateLimitType: 'monthly',
    pdfExportEnabled: true,
    priorityOnboarding: true,
    description: 'Unlimited access for professionals',
    features: [
      'Everything in Starter',
      'Unlimited estimates',
      'Professional PDF export',
      'Priority onboarding call',
    ],
  },
  founders_trial: {
    id: 'founders_trial',
    name: 'Founders Trial',
    price: 0,
    estimateLimit: null,
    estimateLimitType: 'monthly',
    pdfExportEnabled: true,
    priorityOnboarding: true,
    description: 'Full Pro access for 30 days',
    features: [
      'Full Pro features for 30 days',
      '3 unique PDF exports',
      'Unlimited estimates',
    ],
  },
};

export const FOUNDERS_TRIAL_DURATION_DAYS = 30;
export const FREE_PDF_EXPORT_LIMIT = 3;
