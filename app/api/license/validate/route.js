import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Revalida a licença. Corpo: { key, deviceId }
function normKey(k) {
  return String(k || '').trim().toUpperCase().replace(/^HC-/, '').replace(/[^A-Z0-9]/g, '');
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const key = normKey(body.key);
    const deviceId = String(body.deviceId || '').trim();
    if (key.length < 4 || !deviceId) return NextResponse.json({ ok: false, reason: 'Dados incompletos.' }, { status: 400 });
    const db = supabaseAdmin();
    const { data: purchase } = await db
      .from('purchases').select('user_id').eq('status', 'paid').eq('license_key', key).maybeSingle();
    if (!purchase) return NextResponse.json({ ok: false, reason: 'Licença inválida.' });
    const { data: dev } = await db.from('devices').select('device_id').eq('user_id', purchase.user_id).eq('active', true).eq('device_id', deviceId).maybeSingle();
    if (!dev) return NextResponse.json({ ok: false, reason: 'Licença ativa em outro aparelho.' });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, reason: 'Erro no servidor.' }, { status: 500 });
  }
}
