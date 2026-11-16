import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { q } from '@/lib/db';
import { HELLCORE_APK } from '@/lib/constants';

export const dynamic = 'force-dynamic';

const SITE = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://hellcore-site.vercel.app';

// Download protegido por app. Logado sempre; app pago exige compra paga (ou admin).
// Serve o APK enviado pelo admin (Storage); se não houver e for o hellcore, usa o link público.
export async function GET(request, { params }) {
  const id = String(params?.id || '').replace(/[^a-z0-9_-]/gi, '');
  if (!id) return NextResponse.json({ error: 'App inválido.' }, { status: 400 });
  const user = await currentUser();
  if (!user) return NextResponse.redirect(new URL('/entrar', SITE()));
  const db = supabaseAdmin();
  const app = await q(db.from('apps').select('id, name, is_free').eq('id', id).maybeSingle(), null);
  const isFree = app ? !!app.is_free : id === 'root';
  if (!isFree && !user.is_admin) {
    const mine = await q(db.from('purchases').select('id').eq('user_id', user.id).eq('app_id', id).eq('status', 'paid').limit(1), []);
    if (!mine.length) return NextResponse.redirect(new URL('/apps/' + id, SITE()));
  }
  const filename = ((app && app.name) || id).replace(/[^\w.-]+/g, '_') + '.apk';
  // 1) tenta o APK enviado pelo admin
  try {
    const { data, error } = await db.storage.from('apks').download(`${id}.apk`);
    if (!error && data) {
      const buf = await data.arrayBuffer();
      return new NextResponse(buf, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.android.package-archive',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': String(buf.byteLength),
          'Cache-Control': 'no-store',
        },
      });
    }
  } catch (e) {}
  // 2) fallback: link público (só hellcore)
  if (id === 'hellcore') {
    try {
      const up = await fetch(HELLCORE_APK, { redirect: 'follow', cache: 'no-store' });
      if (up.ok) {
        const buf = await up.arrayBuffer();
        return new NextResponse(buf, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.android.package-archive',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': String(buf.byteLength),
            'Cache-Control': 'no-store',
          },
        });
      }
    } catch (e) {}
  }
  return NextResponse.json({ error: 'Arquivo ainda não disponível para este app.' }, { status: 404 });
}
