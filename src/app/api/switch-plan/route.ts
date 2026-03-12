import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase-server';
import { createServerClient } from '@supabase/ssr';

const PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
};

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json();

    const newPriceId = PRICE_IDS[planId];
    if (!planId || !newPriceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Authenticate user
    const supabase = await createClient();
    let {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const accessToken = authHeader.slice(7);
        const tokenClient = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() { return []; },
              setAll() { /* noop */ },
            },
          }
        );
        const { data } = await tokenClient.auth.getUser(accessToken);
        user = data.user;
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current subscription
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    if (!subscription?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Get the current subscription from Stripe to find the item ID
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id
    );

    const currentItem = stripeSubscription.items.data[0];
    if (!currentItem) {
      return NextResponse.json(
        { error: 'No subscription item found' },
        { status: 404 }
      );
    }

    // Switch the plan by updating the subscription item's price
    const updated = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      items: [
        {
          id: currentItem.id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });

    // Update DB immediately so the UI reflects the change without waiting for webhook
    const updatedItem = updated.items.data[0];
    const sub = updated as unknown as Record<string, unknown>;
    const itemRecord = updatedItem as unknown as Record<string, unknown>;
    const periodStart = (sub.current_period_start as number) ?? (itemRecord?.current_period_start as number);
    const periodEnd = (sub.current_period_end as number) ?? (itemRecord?.current_period_end as number);

    await supabaseAdmin
      .from('subscriptions')
      .update({
        plan_id: planId,
        stripe_price_id: newPriceId,
        status: updated.status,
        ...(periodStart && { current_period_start: new Date(periodStart * 1000).toISOString() }),
        ...(periodEnd && { current_period_end: new Date(periodEnd * 1000).toISOString() }),
      })
      .eq('user_id', user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error switching plan:', error);
    return NextResponse.json(
      { error: 'Failed to switch plan' },
      { status: 500 }
    );
  }
}
