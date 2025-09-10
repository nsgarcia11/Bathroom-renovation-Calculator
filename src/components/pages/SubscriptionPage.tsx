'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard, Download, FileText } from 'lucide-react';

export function SubscriptionPage() {
  const { hasActiveSubscription } = useSubscription();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // In a real app, this would redirect to Stripe Checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_monthly_plan', // This would be your actual Stripe price ID
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // For demo purposes, just show success
      alert('Subscription activated! (Demo mode)');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      // In a real app, this would redirect to Stripe Customer Portal
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Subscription</h1>
          <p className='mt-2 text-gray-600'>
            Choose a plan to unlock PDF export and other premium features
          </p>
        </div>

        {hasActiveSubscription ? (
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Check className='h-5 w-5 text-green-600 mr-2' />
                Active Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <p className='text-gray-600'>
                  Your subscription is active and you have access to all premium
                  features.
                </p>
                <div className='flex space-x-4'>
                  <Button onClick={handleManageSubscription}>
                    <CreditCard className='h-4 w-4 mr-2' />
                    Manage Subscription
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => router.push('/estimate')}
                  >
                    <Download className='h-4 w-4 mr-2' />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Free Plan</CardTitle>
                <div className='text-3xl font-bold text-gray-900'>
                  $0<span className='text-lg text-gray-500'>/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-600 mr-2' />
                    <span className='text-sm text-gray-600'>
                      Create estimates
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-600 mr-2' />
                    <span className='text-sm text-gray-600'>
                      All workflow screens
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-600 mr-2' />
                    <span className='text-sm text-gray-600'>
                      Auto-save to database
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-600 mr-2' />
                    <span className='text-sm text-gray-600'>
                      Notes aggregator
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-gray-400 mr-2' />
                    <span className='text-sm text-gray-400'>PDF export</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className='border-blue-500 relative'>
              <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                <span className='bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
                  Recommended
                </span>
              </div>
              <CardHeader>
                <CardTitle>Pro Plan</CardTitle>
                <div className='text-3xl font-bold text-gray-900'>
                  $29<span className='text-lg text-gray-500'>/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-600 mr-2' />
                    <span className='text-sm text-gray-600'>
                      Everything in Free
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-600 mr-2' />
                    <span className='text-sm text-gray-600'>PDF export</span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-600 mr-2' />
                    <span className='text-sm text-gray-600'>
                      Professional templates
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-600 mr-2' />
                    <span className='text-sm text-gray-600'>
                      Priority support
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-600 mr-2' />
                    <span className='text-sm text-gray-600'>
                      Unlimited projects
                    </span>
                  </li>
                </ul>
                <Button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className='w-full mt-6'
                >
                  <CreditCard className='h-4 w-4 mr-2' />
                  {loading ? 'Processing...' : 'Subscribe Now'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Comparison */}
        <Card className='mt-8'>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left py-3 px-4'>Feature</th>
                    <th className='text-center py-3 px-4'>Free</th>
                    <th className='text-center py-3 px-4'>Pro</th>
                  </tr>
                </thead>
                <tbody className='text-sm'>
                  <tr className='border-b'>
                    <td className='py-3 px-4'>Estimate Creation</td>
                    <td className='text-center py-3 px-4'>
                      <Check className='h-4 w-4 text-green-600 mx-auto' />
                    </td>
                    <td className='text-center py-3 px-4'>
                      <Check className='h-4 w-4 text-green-600 mx-auto' />
                    </td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-3 px-4'>Workflow Screens</td>
                    <td className='text-center py-3 px-4'>
                      <Check className='h-4 w-4 text-green-600 mx-auto' />
                    </td>
                    <td className='text-center py-3 px-4'>
                      <Check className='h-4 w-4 text-green-600 mx-auto' />
                    </td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-3 px-4'>Auto-save</td>
                    <td className='text-center py-3 px-4'>
                      <Check className='h-4 w-4 text-green-600 mx-auto' />
                    </td>
                    <td className='text-center py-3 px-4'>
                      <Check className='h-4 w-4 text-green-600 mx-auto' />
                    </td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-3 px-4'>PDF Export</td>
                    <td className='text-center py-3 px-4'>
                      <span className='text-gray-400'>✗</span>
                    </td>
                    <td className='text-center py-3 px-4'>
                      <Check className='h-4 w-4 text-green-600 mx-auto' />
                    </td>
                  </tr>
                  <tr className='border-b'>
                    <td className='py-3 px-4'>Professional Templates</td>
                    <td className='text-center py-3 px-4'>
                      <span className='text-gray-400'>✗</span>
                    </td>
                    <td className='text-center py-3 px-4'>
                      <Check className='h-4 w-4 text-green-600 mx-auto' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className='text-center mt-8'>
          <Button variant='outline' onClick={() => router.push('/')}>
            <FileText className='h-4 w-4 mr-2' />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
