import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user || !user.is_admin) return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 });
    const { apps } = await request.json();
    if (!Array.isArray(apps)) return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    const db = supabaseAdmin();
    for (const a of apps) {
      await db.from('apps').update({
        is_free: !!a.is_free,
        price_cents: a.is_free ? 0 : (Number(a.price_cents) || 0),
        version: a.version || null,
      }).eq('id', a.id);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao salvar.' }, { status: 500 });
  }
}
