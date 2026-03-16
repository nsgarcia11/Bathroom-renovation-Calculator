'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, X } from 'lucide-react';
import { useState } from 'react';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';

export function TrialBanner() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const { subscription, limits } = useSubscriptionContext();

  if (dismissed || limits.isLoading) return null;

  const planId = subscription?.plan_id || 'free';
  const isPro =
    planId === 'pro' && subscription?.status === 'active';

  // Don't show banner for Pro plans
  if (isPro) return null;

  const reportLimit = limits.reportLimit;

  // Report limit reached (Free or Starter)
  if (!limits.canExportPdf && reportLimit) {
    const periodLabel =
      planId === 'starter' ? ' this month' : '';

    return (
      <div className='bg-red-50 border-b border-red-200 px-4 py-3'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-2 text-sm text-red-700'>
            <FileText size={16} />
            <span>
              You&apos;ve used all {reportLimit} {planId === 'free' ? 'free ' : ''}
              PDF exports{periodLabel}.{' '}
              <button
                onClick={() => router.push('/pricing')}
                className='font-semibold underline hover:text-red-800'
              >
                {planId === 'starter'
                  ? 'Upgrade to Pro'
                  : 'Upgrade your plan'}
              </button>{' '}
              for unlimited exports.
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className='text-red-400 hover:text-red-600'
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Some exports used (Free or Starter)
  if (limits.reportsUsed > 0 && reportLimit) {
    return (
      <div className='bg-amber-50 border-b border-amber-200 px-4 py-3'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-2 text-sm text-amber-700'>
            <FileText size={16} />
            <span>
              {limits.reportsUsed}/{reportLimit} {planId === 'free' ? 'free ' : ''}
              PDF exports used{planId === 'starter' ? ' this month' : ''}.{' '}
              <button
                onClick={() => router.push('/pricing')}
                className='font-semibold underline hover:text-amber-800'
              >
                {planId === 'starter'
                  ? 'Upgrade to Pro for unlimited'
                  : 'Upgrade for unlimited'}
              </button>
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className='text-amber-400 hover:text-amber-600'
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
