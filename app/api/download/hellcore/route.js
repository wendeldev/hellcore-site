import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { q } from '@/lib/db';
import { HELLCORE_APK } from '@/lib/constants';

export const dynamic = 'force-dynamic';

// Download protegido: só entrega o APK do HELLCORE para quem está logado
// e tem a compra paga (ou é admin). O link público do GitHub não aparece na página.
export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.redirect(new URL('/entrar', process.env.NEXT_PUBLIC_SITE_URL || 'https://hellcore-site.vercel.app'));
  }
  let entitled = !!user.is_admin;
  if (!entitled) {
    const db = supabaseAdmin();
    const mine = await q(
      db.from('purchases').select('id').eq('user_id', user.id).eq('app_id', 'hellcore').eq('status', 'paid').limit(1),
      [],
    );
    entitled = mine.length > 0;
  }
  if (!entitled) {
    return NextResponse.redirect(new URL('/apps/hellcore', process.env.NEXT_PUBLIC_SITE_URL || 'https://hellcore-site.vercel.app'));
  }
  try {
    const upstream = await fetch(HELLCORE_APK, { redirect: 'follow', cache: 'no-store' });
    if (!upstream.ok) throw new Error('upstream ' + upstream.status);
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="HELLCORE.apk"',
        'Content-Length': String(buf.byteLength),
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Não foi possível baixar agora. Tente de novo em instantes.' }, { status: 502 });
  }
}
