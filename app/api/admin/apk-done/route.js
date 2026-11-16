import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user || !user.is_admin) return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 });
    const { appId, version } = await request.json();
    if (!appId) return NextResponse.json({ error: 'App inválido.' }, { status: 400 });
    const db = supabaseAdmin();
    await db.from('apps').update({ version: version || null }).eq('id', appId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao registrar a versão.' }, { status: 500 });
  }
}
