import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { supabaseServer } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const FALLBACK = {
  hellcore: { id: 'hellcore', name: 'HELLCORE', price_cents: 890, is_free: false },
};

function siteUrl(request) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

export async function POST(request) {
  try {
    const { appId } = await request.json();
    const supabase = supabaseServer();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return NextResponse.json({ error: 'Faça login primeiro.' }, { status: 401 });

    let app = null;
    try {
      const db = supabaseAdmin();
      const r = await db.from('apps').select('*').eq('id', appId).maybeSingle();
      app = r.data;
    } catch (e) {}
    if (!app) app = FALLBACK[appId] || null;
    if (!app) return NextResponse.json({ error: 'App não encontrado.' }, { status: 404 });
    if (app.is_free || !app.price_cents) return NextResponse.json({ error: 'Este app é gratuito.' }, { status: 400 });

    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Pagamento ainda não configurado (MP_ACCESS_TOKEN ausente).' }, { status: 500 });
    }

    const site = siteUrl(request);
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const pref = await new Preference(client).create({
      body: {
        items: [{
          id: app.id, title: 'HELLCORE — ' + app.name, quantity: 1,
          unit_price: Number((app.price_cents / 100).toFixed(2)), currency_id: 'BRL',
        }],
        payer: { email: user.email },
        external_reference: `${user.id}:${app.id}`,
        back_urls: { success: `${site}/sucesso`, pending: `${site}/sucesso`, failure: `${site}/apps/${app.id}` },
        auto_return: 'approved',
        notification_url: `${site}/api/mp-webhook`,
        statement_descriptor: 'HELLCORE',
      },
    });
    return NextResponse.json({ init_point: pref.init_point });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao criar o pagamento: ' + (e?.message || 'desconhecido') }, { status: 500 });
  }
}
