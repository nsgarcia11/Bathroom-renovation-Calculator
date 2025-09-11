import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if this is an email verification
      if (type === 'signup') {
        return NextResponse.redirect(`${origin}/auth/verify-email`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // For magic links with tokens in URL fragments, redirect to a client-side handler
  return NextResponse.redirect(`${origin}/auth/callback-handler`);
}
