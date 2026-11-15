import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request) {
  const supabase = supabaseServer();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/entrar', request.url), { status: 303 });
}
