import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, unknown> = {};

  // Check env vars
  checks.hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  checks.hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  checks.hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
  checks.webhookSecretPrefix = process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10) + '...';
  checks.hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
  checks.hasStarterPriceId = !!process.env.STRIPE_STARTER_PRICE_ID;
  checks.starterPriceId = process.env.STRIPE_STARTER_PRICE_ID;

  // Test supabaseAdmin
  try {
    const { supabaseAdmin } = await import('@/lib/supabase-admin');
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id, plan_id, status')
      .limit(1);
    checks.supabaseAdmin = { success: true, data, error };
  } catch (e) {
    checks.supabaseAdmin = { success: false, error: String(e) };
  }

  return NextResponse.json(checks);
}
