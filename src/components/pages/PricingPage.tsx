'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { useToast } from '@/contexts/ToastContext';
import { PLANS } from '@/lib/plans';

export function PricingPage() {
  const router = useRouter();
  const { subscription } = useSubscriptionContext();
  const { success: showSuccess, info: showInfo } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      showSuccess('Subscription activated! You now have full access.');
    }
    if (searchParams.get('canceled') === 'true') {
      showInfo('Checkout canceled. No charges were made.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
    }
  };

  const currentPlanId = subscription?.plan_id || 'free';
  const isActive = subscription?.status === 'active';

  const displayPlans = [PLANS.free, PLANS.starter, PLANS.pro];

  return (
    <div className='p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-slate-800 mb-2'>
          Choose Your Plan
        </h1>
        <p className='text-slate-500'>
          Select the plan that best fits your business needs.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {displayPlans.map((plan) => {
          const isCurrent =
            currentPlanId === plan.id && (isActive || plan.id === 'free');
          const isPopular = plan.id === 'pro';

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-sm border-2 p-6 flex flex-col ${
                isPopular
                  ? 'border-blue-500 ring-1 ring-blue-500'
                  : 'border-slate-200'
              }`}
            >
              {isPopular && (
                <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full'>
                  Most Popular
                </div>
              )}

              <div className='mb-4'>
                <h3 className='text-xl font-bold text-slate-800'>
                  {plan.name}
                </h3>
                <p className='text-sm text-slate-500 mt-1'>
                  {plan.description}
                </p>
              </div>

              <div className='mb-6'>
                <span className='text-4xl font-bold text-slate-900'>
                  ${plan.price.toFixed(2)}
                </span>
                {plan.price > 0 && (
                  <span className='text-slate-500 text-sm'>/month</span>
                )}
              </div>

              <ul className='space-y-3 mb-8 flex-grow'>
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className='flex items-start gap-2 text-sm text-slate-600'
                  >
                    <Check
                      size={16}
                      className='text-green-500 mt-0.5 flex-shrink-0'
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <Button
                  variant='outline'
                  disabled
                  className='w-full'
                >
                  Current Plan
                </Button>
              ) : plan.id === 'free' ? (
                <Button variant='outline' disabled className='w-full'>
                  Free
                </Button>
              ) : isActive && currentPlanId !== 'free' ? (
                <Button
                  onClick={handleManageSubscription}
                  variant='outline'
                  className='w-full'
                >
                  Switch Plan
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full ${
                    isPopular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  Get Started
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {isActive && currentPlanId !== 'free' && (
        <div className='mt-8 text-center'>
          <button
            onClick={handleManageSubscription}
            className='text-sm text-slate-500 underline hover:text-slate-700'
          >
            Manage subscription & billing
          </button>
        </div>
      )}

      <div className='mt-8 flex justify-center'>
        <Button
          onClick={() => router.back()}
          variant='ghost'
          className='flex items-center gap-2 text-slate-600 hover:text-slate-800'
        >
          <ArrowLeft size={18} />
          Back
        </Button>
      </div>
    </div>
  );
}
