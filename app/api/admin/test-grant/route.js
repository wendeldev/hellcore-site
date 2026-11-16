import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Só o dono/admin. Libera (ou remove) uma licença de teste na própria conta,
// sem pagamento, para ver a experiência de pós-compra.
export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user || !user.is_admin) return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 });
    const { action } = await request.json();
    const db = supabaseAdmin();

    if (action === 'revoke') {
      await db.from('purchases').delete().eq('user_id', user.id).eq('app_id', 'hellcore');
      await db.from('devices').delete().eq('user_id', user.id);
      return NextResponse.json({ ok: true, state: 'revoked' });
    }

    const { data: already } = await db.from('purchases').select('id').eq('user_id', user.id).eq('app_id', 'hellcore').eq('status', 'paid').maybeSingle();
    if (!already) {
      const key = Math.random().toString(36).slice(2, 6).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
      await db.from('purchases').insert({ user_id: user.id, app_id: 'hellcore', price_cents: 890, status: 'paid', license_type: 'Vitalícia', license_key: key });
    }
    const { data: dev } = await db.from('devices').select('id').eq('user_id', user.id).eq('active', true).maybeSingle();
    if (!dev) {
      await db.from('devices').insert({ user_id: user.id, name: 'Aparelho de teste', android: '15', device_id: 'TESTE' + Math.random().toString(16).slice(2, 5).toUpperCase(), active: true });
    }
    return NextResponse.json({ ok: true, state: 'granted' });
  } catch (e) {
    return NextResponse.json({ error: 'Erro: ' + (e?.message || 'desconhecido') }, { status: 500 });
  }
}
