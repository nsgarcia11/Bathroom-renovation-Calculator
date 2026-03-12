import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';

function getPlanIdFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter';
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro';
  return 'free';
}

function getSubscriptionPeriod(subscription: Stripe.Subscription) {
  // In newer Stripe API versions, period may be on items
  const sub = subscription as unknown as Record<string, unknown>;
  const item = subscription.items?.data?.[0] as unknown as Record<string, unknown> | undefined;

  const periodStart = (sub.current_period_start as number) ?? (item?.current_period_start as number);
  const periodEnd = (sub.current_period_end as number) ?? (item?.current_period_end as number);

  return {
    ...(periodStart && {
      current_period_start: new Date(periodStart * 1000).toISOString(),
    }),
    ...(periodEnd && {
      current_period_end: new Date(periodEnd * 1000).toISOString(),
    }),
  };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const userId = session.metadata?.user_id;

        if (!userId) {
          console.error('Webhook error: missing user_id in session metadata');
          return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
        }

        // Get subscription details
        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId
        )) as Stripe.Subscription;

        const subItem = subscription.items?.data?.[0];
        const priceId = subItem?.price?.id || '';
        const metaPlanId = session.metadata?.plan_id;
        const planId = (metaPlanId && metaPlanId !== 'unknown')
          ? metaPlanId
          : getPlanIdFromPriceId(priceId);

        const period = getSubscriptionPeriod(subscription);

        // Update or insert subscription in database
        const subscriptionData = {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscriptionId,
          stripe_price_id: priceId,
          status: subscription.status,
          plan_id: planId,
          ...period,
        };

        // Try update first (row exists)
        const { data: updated, error: updateError } = await supabaseAdmin
          .from('subscriptions')
          .update(subscriptionData)
          .eq('user_id', userId)
          .select();

        if (updateError) {
          console.error('Failed to update subscription:', updateError);
          return NextResponse.json(
            { error: 'Database update failed', details: updateError.message },
            { status: 500 }
          );
        }

        // If no row was updated, insert a new one
        if (!updated || updated.length === 0) {
          const { error: insertError } = await supabaseAdmin
            .from('subscriptions')
            .insert(subscriptionData);

          if (insertError) {
            console.error('Failed to insert subscription:', insertError);
            return NextResponse.json(
              { error: 'Database insert failed', details: insertError.message },
              { status: 500 }
            );
          }
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const subItem = subscription.items?.data?.[0];
        const priceId = subItem?.price?.id || '';
        const planId = getPlanIdFromPriceId(priceId);
        const period = getSubscriptionPeriod(subscription);

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            plan_id: planId,
            stripe_price_id: priceId,
            ...period,
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            plan_id: 'free',
            stripe_subscription_id: null,
            stripe_price_id: null,
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as unknown as Record<string, unknown>;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', subscriptionId);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
