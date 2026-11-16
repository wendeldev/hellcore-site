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
    // bucket privado (ignora erro se já existir)
    try { await db.storage.createBucket('apks', { public: false, fileSizeLimit: '200MB' }); } catch (e) {}
    const path = `${appId}.apk`;
    // remove o arquivo anterior para poder assinar um novo upload
    try { await db.storage.from('apks').remove([path]); } catch (e) {}
    const { data, error } = await db.storage.from('apks').createSignedUploadUrl(path);
    if (error || !data) return NextResponse.json({ error: 'Não foi possível preparar o envio. Verifique a chave de serviço do Supabase.' }, { status: 500 });
    return NextResponse.json({ ok: true, path: data.path, token: data.token });
  } catch (e) {
    return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 });
  }
}
