import { redirect } from 'next/navigation';
import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { q } from '@/lib/db';
import Shell from '@/components/Shell';
import { Flame } from '@/components/Brand';

export const dynamic = 'force-dynamic';

const FALLBACK = [
  { id: 'hellcore', name: 'HELLCORE', is_free: false, version: '3.6' },
  { id: 'root', name: 'Root (instalador)', is_free: true, version: null },
];

export default async function Downloads() {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  const db = supabaseAdmin();
  let apps = await q(db.from('apps').select('*').eq('active', true), []);
  if (!apps.length) apps = FALLBACK;
  const mine = await q(db.from('purchases').select('app_id').eq('user_id', user.id).eq('status', 'paid'), []);
  const owned = new Set(mine.map((m) => m.app_id));
  const list = apps.filter((a) => a.is_free || owned.has(a.id));
  // Quais apps têm APK enviado pelo admin (no Storage)
  const stored = new Set();
  try {
    const { data: files } = await db.storage.from('apks').list('', { limit: 1000 });
    (files || []).forEach((f) => { if (f.name.endsWith('.apk')) stored.add(f.name.replace(/\.apk$/, '')); });
  } catch (e) {}
  const hasFile = (a) => stored.has(a.id) || a.id === 'hellcore';
  return (
    <Shell user={user} isAdmin={user.is_admin} active="downloads">
      <div><p className="eyebrow">Downloads</p><h1 className="h-lg" style={{ marginTop: 6 }}>Seus arquivos</h1></div>
      {list.length ? list.map((a) => (
        <div key={a.id} className="appitem">
          <div className={`ico ${a.id === 'root' ? 'rt' : 'hc'}`}>{a.id === 'root'
            ? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9fe08a" strokeWidth="1.6"><path d="M12 3v7" /><circle cx="12" cy="14" r="4.5" /></svg>
            : <Flame size={26} />}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontFamily: 'Space Grotesk' }}>{a.name}</div>
            <div className="faint" style={{ fontSize: 12 }}>{a.is_free ? 'Grátis' : 'Licença vitalícia'}{a.version ? ' · v' + a.version : ''}</div>
          </div>
          {hasFile(a)
            ? <a className="btn sm primary" href={`/api/download/${a.id}`}>Baixar</a>
            : <span className="pill ink">Em breve</span>}
        </div>
      )) : <p className="muted">Você ainda não tem downloads. Compre o HELLCORE em <Link className="pill ink" href="/apps">Aplicativos</Link>.</p>}
    </Shell>
  );
}
