import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Mercado Pago avisa aqui quando um pagamento muda de estado.
export async function POST(request) {
  try {
    const url = new URL(request.url);
    let paymentId = url.searchParams.get('data.id') || url.searchParams.get('id');
    let type = url.searchParams.get('type') || url.searchParams.get('topic');
    try {
      const body = await request.json();
      if (body?.data?.id) paymentId = body.data.id;
      if (body?.type) type = body.type;
    } catch (e) {}

    if (type && type !== 'payment') return NextResponse.json({ ok: true });
    if (!paymentId || !process.env.MP_ACCESS_TOKEN) return NextResponse.json({ ok: true });

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const payment = await new Payment(client).get({ id: paymentId });
    if (payment?.status !== 'approved') return NextResponse.json({ ok: true });

    const ref = payment.external_reference || '';
    const [userId, appId] = ref.split(':');
    if (!userId || !appId) return NextResponse.json({ ok: true });

    const db = supabaseAdmin();
    // registra o pagamento (idempotente pelo mp_payment_id)
    const { data: existingPay } = await db.from('payments').select('id').eq('mp_payment_id', String(paymentId)).maybeSingle();
    if (!existingPay) {
      await db.from('payments').insert({
        user_id: userId, app_id: appId, mp_payment_id: String(paymentId),
        amount_cents: Math.round((payment.transaction_amount || 0) * 100), status: 'approved',
      });
    }
    // libera a licença se ainda não existe
    const { data: already } = await db.from('purchases').select('id')
      .eq('user_id', userId).eq('app_id', appId).eq('status', 'paid').maybeSingle();
    if (!already) {
      const { data: app } = await db.from('apps').select('price_cents').eq('id', appId).single();
      const key = Math.random().toString(36).slice(2, 6).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
      await db.from('purchases').insert({
        user_id: userId, app_id: appId, price_cents: app?.price_cents || null,
        status: 'paid', license_type: 'Vitalícia', license_key: key,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: true });
  }
}
