import { PlanId } from '@/types';

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number;
  estimateLimit: number | null;
  estimateLimitType: 'total' | 'monthly';
  reportLimit: number | null;
  reportLimitType: 'total' | 'monthly';
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
    estimateLimit: 3,
    estimateLimitType: 'total',
    reportLimit: 3,
    reportLimitType: 'total',
    pdfExportEnabled: true,
    priorityOnboarding: false,
    description: 'Get started with basic estimating',
    features: [
      '3 estimates total',
      '3 free PDF exports',
      'Cloud-ready estimates',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 14.99,
    estimateLimit: null,
    estimateLimitType: 'monthly',
    reportLimit: 8,
    reportLimitType: 'monthly',
    pdfExportEnabled: true,
    priorityOnboarding: false,
    description: 'For active contractors',
    features: [
      'Everything in Free',
      '8 reports per month',
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
    reportLimit: null,
    reportLimitType: 'monthly',
    pdfExportEnabled: true,
    priorityOnboarding: true,
    description: 'Unlimited access for professionals',
    features: [
      'Everything in Starter',
      'Unlimited estimates',
      'Unlimited reports',
      'Priority onboarding call',
    ],
  },
};

export const FREE_REPORT_LIMIT = 3;
export const STARTER_REPORT_LIMIT = 8;
