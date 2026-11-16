import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user || !user.is_admin) return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 });
    const { appId } = await request.json();
    if (!appId || !/^[a-z0-9_-]+$/i.test(appId)) return NextResponse.json({ error: 'App inválido.' }, { status: 400 });
    const db = supabaseAdmin();

    // Garante o bucket privado 'apks'. Se já existe, o erro é esperado e ignorado;
    // qualquer outro erro é informado para diagnóstico.
    const mk = await db.storage.createBucket('apks', { public: false }).catch((e) => ({ error: e }));
    if (mk && mk.error) {
      const m = String(mk.error.message || mk.error || '').toLowerCase();
      const exists = m.includes('exist') || m.includes('already') || m.includes('duplicate');
      if (!exists) {
        return NextResponse.json({ error: 'Storage recusou criar o balde de APKs.', detail: String(mk.error.message || mk.error) }, { status: 500 });
      }
    }

    const path = `${appId}.apk`;
    try { await db.storage.from('apks').remove([path]); } catch (e) {}
    const { data, error } = await db.storage.from('apks').createSignedUploadUrl(path);
    if (error || !data) {
      return NextResponse.json({ error: 'Não foi possível preparar o envio.', detail: String((error && error.message) || 'sem dados') }, { status: 500 });
    }
    return NextResponse.json({ ok: true, path: data.path, token: data.token });
  } catch (e) {
    return NextResponse.json({ error: 'Erro no servidor.', detail: String(e && e.message) }, { status: 500 });
  }
}
