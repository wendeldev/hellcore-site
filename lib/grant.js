import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseAdmin } from './supabaseAdmin';

// Confere um pagamento no Mercado Pago e, se aprovado, libera a licença.
// É idempotente: pode ser chamado pelo webhook e pela tela de sucesso sem duplicar.
export async function grantFromPayment(paymentId) {
  try {
    if (!paymentId || !process.env.MP_ACCESS_TOKEN) return false;
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const payment = await new Payment(client).get({ id: paymentId });
    if (payment?.status !== 'approved') return false;
    const [userId, appId] = (payment.external_reference || '').split(':');
    if (!userId || !appId) return false;
    const db = supabaseAdmin();
    const { data: ep } = await db.from('payments').select('id').eq('mp_payment_id', String(paymentId)).maybeSingle();
    if (!ep) {
      await db.from('payments').insert({
        user_id: userId, app_id: appId, mp_payment_id: String(paymentId),
        amount_cents: Math.round((payment.transaction_amount || 0) * 100), status: 'approved',
      });
    }
    const { data: already } = await db.from('purchases').select('id').eq('user_id', userId).eq('app_id', appId).eq('status', 'paid').maybeSingle();
    if (!already) {
      const { data: app } = await db.from('apps').select('price_cents').eq('id', appId).maybeSingle();
      const key = Math.random().toString(36).slice(2, 6).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
      await db.from('purchases').insert({
        user_id: userId, app_id: appId, price_cents: app?.price_cents || null,
        status: 'paid', license_type: 'Vitalícia', license_key: key,
      });
    }
    return true;
  } catch (e) {
    return false;
  }
}
