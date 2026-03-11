'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, X } from 'lucide-react';
import { useState } from 'react';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { FREE_PDF_EXPORT_LIMIT } from '@/lib/plans';

export function TrialBanner() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const { subscription, limits } = useSubscriptionContext();

  if (dismissed || limits.isLoading) return null;

  const planId = subscription?.plan_id || 'free';
  const isPaidPlan =
    (planId === 'starter' || planId === 'pro') &&
    subscription?.status === 'active';

  // Don't show banner for paid plans
  if (isPaidPlan) return null;

  // PDF limit reached
  if (!limits.canExportPdf) {
    return (
      <div className='bg-red-50 border-b border-red-200 px-4 py-3'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-2 text-sm text-red-700'>
            <FileText size={16} />
            <span>
              You&apos;ve used all {FREE_PDF_EXPORT_LIMIT} free PDF exports.{' '}
              <button
                onClick={() => router.push('/pricing')}
                className='font-semibold underline hover:text-red-800'
              >
                Upgrade your plan
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

  // Free plan with some exports used
  if (limits.pdfExportsUsed > 0) {
    return (
      <div className='bg-amber-50 border-b border-amber-200 px-4 py-3'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-2 text-sm text-amber-700'>
            <FileText size={16} />
            <span>
              {limits.pdfExportsUsed}/{FREE_PDF_EXPORT_LIMIT} free PDF exports
              used.{' '}
              <button
                onClick={() => router.push('/pricing')}
                className='font-semibold underline hover:text-amber-800'
              >
                Upgrade for unlimited
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
