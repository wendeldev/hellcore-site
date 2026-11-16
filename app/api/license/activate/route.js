import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Ativa a licença num aparelho. Chamado pelo app HELLCORE (sem login de site).
// Corpo: { key, deviceId, name, android }
function normKey(k) {
  return String(k || '').trim().toUpperCase().replace(/^HC-/, '').replace(/[^A-Z0-9]/g, '');
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const key = normKey(body.key);
    const deviceId = String(body.deviceId || '').trim();
    if (key.length < 4 || !deviceId) {
      return NextResponse.json({ ok: false, reason: 'Dados incompletos.' }, { status: 400 });
    }
    const db = supabaseAdmin();
    const { data: purchase } = await db
      .from('purchases')
      .select('id, user_id, app_id, license_key, license_type')
      .eq('status', 'paid').eq('license_key', key).maybeSingle();
    if (!purchase) {
      return NextResponse.json({ ok: false, reason: 'Licença inválida ou não encontrada.' });
    }
    const userId = purchase.user_id;
    const { data: devices = [] } = await db.from('devices').select('*').eq('user_id', userId).eq('active', true);
    const same = devices.find((d) => d.device_id === deviceId);
    if (same) {
      return NextResponse.json({ ok: true, state: 'already', license_type: purchase.license_type });
    }
    if (devices.length > 0) {
      return NextResponse.json({ ok: false, reason: 'Esta licença já está ativa em outro aparelho. Desvincule no site para usar aqui.' });
    }
    await db.from('devices').insert({
      user_id: userId, name: String(body.name || 'Aparelho').slice(0, 80),
      android: String(body.android || '').slice(0, 10), device_id: deviceId, active: true,
    });
    return NextResponse.json({ ok: true, state: 'activated', license_type: purchase.license_type });
  } catch (e) {
    return NextResponse.json({ ok: false, reason: 'Erro no servidor.' }, { status: 500 });
  }
}
