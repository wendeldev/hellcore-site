import { redirect } from 'next/navigation';
import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { money } from '@/lib/format';
import Shell from '@/components/Shell';
import { Flame } from '@/components/Brand';

export const dynamic = 'force-dynamic';

export default async function Apps() {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  const db = supabaseAdmin();
  const { data: apps = [] } = await db.from('apps').select('*').eq('active', true).order('is_free');
  const { data: mine = [] } = await db.from('purchases').select('app_id').eq('user_id', user.id).eq('status', 'paid');
  const owned = new Set(mine.map((m) => m.app_id));
  return (
    <Shell user={user} isAdmin={user.is_admin} active="apps">
      <div><p className="eyebrow">Aplicativos</p><h1 className="h-lg" style={{ marginTop: 6 }}>Catálogo</h1></div>
      {apps.map((a) => (
        <Link key={a.id} href={`/apps/${a.id}`} className="appitem">
          <div className={`ico ${a.id === 'root' ? 'rt' : 'hc'}`}>{a.id === 'root'
            ? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9fe08a" strokeWidth="1.6"><path d="M12 3v7" /><circle cx="12" cy="14" r="4.5" /></svg>
            : <Flame size={26} />}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="between"><div style={{ fontWeight: 700, fontFamily: 'Space Grotesk' }}>{a.name}</div>
              {a.is_free ? <span className="pill ok">Grátis</span> : <span className="pill red">{money(a.price_cents)}</span>}</div>
            <div className="faint" style={{ fontSize: 12.5, marginTop: 2 }}>{a.tagline}</div>
            {owned.has(a.id) && <div style={{ marginTop: 4 }}><span className="pill ink">Adquirido</span></div>}
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d6d79" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
        </Link>
      ))}
    </Shell>
  );
}
