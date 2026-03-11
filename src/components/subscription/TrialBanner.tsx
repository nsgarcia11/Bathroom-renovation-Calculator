'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, X } from 'lucide-react';
import { useState } from 'react';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { FOUNDERS_TRIAL_PDF_LIMIT } from '@/lib/plans';

export function TrialBanner() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const { subscription, limits } = useSubscriptionContext();

  if (dismissed || limits.isLoading) return null;

  const isTrialPlan = subscription?.plan_id === 'founders_trial';
  const isTrialExpired = subscription?.trial_status === 'expired';

  if (!isTrialPlan) return null;

  if (isTrialExpired) {
    return (
      <div className='bg-red-50 border-b border-red-200 px-4 py-3'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-2 text-sm text-red-700'>
            <Clock size={16} />
            <span>
              Your Founders Trial has ended.{' '}
              <button
                onClick={() => router.push('/pricing')}
                className='font-semibold underline hover:text-red-800'
              >
                Choose a plan
              </button>{' '}
              to continue.
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

  if (limits.isTrialActive) {
    return (
      <div className='bg-amber-50 border-b border-amber-200 px-4 py-3'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-2 text-sm text-amber-700'>
            <Clock size={16} />
            <span>
              Founders Trial: {limits.trialDaysRemaining} day
              {limits.trialDaysRemaining !== 1 ? 's' : ''} remaining
              {' | '}
              {limits.pdfExportsUsed}/{FOUNDERS_TRIAL_PDF_LIMIT} PDF exports used.{' '}
              <button
                onClick={() => router.push('/pricing')}
                className='font-semibold underline hover:text-amber-800'
              >
                Choose a plan
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
