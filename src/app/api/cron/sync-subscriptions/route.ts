import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';

/**
 * Cron job that runs daily at midnight to sync subscription periods from Stripe.
 * Ensures current_period_start/end stay up to date even if webhooks are missed,
 * so monthly estimate limits (e.g. Starter plan's 8/month) reset correctly.
 */
export async function GET(request: NextRequest) {
  // Verify the request is from the cron service
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();

    // Get all active paid subscriptions that have a Stripe subscription ID
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('user_id, stripe_subscription_id, current_period_end')
      .in('plan_id', ['starter', 'pro'])
      .eq('status', 'active')
      .not('stripe_subscription_id', 'is', null);

    if (error) {
      console.error('Failed to fetch subscriptions:', error);
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ synced: 0 });
    }

    let synced = 0;

    for (const sub of subscriptions) {
      if (!sub.stripe_subscription_id) continue;

      // Only sync if current period has ended or is about to end (within 1 day)
      if (sub.current_period_end) {
        const periodEnd = new Date(sub.current_period_end);
        const now = new Date();
        // Skip if the period end is still more than 1 day away
        if (periodEnd.getTime() - now.getTime() > 24 * 60 * 60 * 1000) {
          continue;
        }
      }

      try {
        const stripeSubscription = (await stripe.subscriptions.retrieve(
          sub.stripe_subscription_id
        )) as Stripe.Subscription;

        // Extract period from subscription or item
        const subRecord = stripeSubscription as unknown as Record<
          string,
          unknown
        >;
        const item = stripeSubscription.items?.data?.[0] as unknown as
          | Record<string, unknown>
          | undefined;

        const periodStart =
          (subRecord.current_period_start as number) ??
          (item?.current_period_start as number);
        const periodEnd =
          (subRecord.current_period_end as number) ??
          (item?.current_period_end as number);

        if (periodStart && periodEnd) {
          await supabase
            .from('subscriptions')
            .update({
              current_period_start: new Date(
                periodStart * 1000
              ).toISOString(),
              current_period_end: new Date(periodEnd * 1000).toISOString(),
              status: stripeSubscription.status,
            })
            .eq('user_id', sub.user_id);

          synced++;
        }
      } catch (stripeError) {
        console.error(
          `Failed to sync subscription ${sub.stripe_subscription_id}:`,
          stripeError
        );
      }
    }

    return NextResponse.json({ synced, total: subscriptions.length });
  } catch (error) {
    console.error('Cron sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    );
  }
}
