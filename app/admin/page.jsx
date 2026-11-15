import { redirect } from 'next/navigation';
import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Shell from '@/components/Shell';
import CatalogEditor from '@/components/CatalogEditor';

export const dynamic = 'force-dynamic';

export default async function Admin() {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  if (!user.is_admin) redirect('/');
  const db = supabaseAdmin();
  const { data: tickets = [] } = await db.from('tickets').select('*').order('created_at', { ascending: false }).limit(100);
  const { data: apps = [] } = await db.from('apps').select('*').order('is_free');
  const { count } = await db.from('purchases').select('*', { count: 'exact', head: true }).eq('status', 'paid');
  return (
    <Shell user={user} isAdmin active="inicio">
      <div className="between"><div><p className="eyebrow">Administrador</p><h1 className="h-lg" style={{ marginTop: 6 }}>Painel</h1></div>
        <Link className="btn sm ghost" href="/">Sair do painel</Link></div>
      <div className="grid2">
        <div className="stat"><div className="k">Licenças pagas</div><div className="v">{count || 0}</div></div>
        <div className="stat"><div className="k">Diagnósticos</div><div className="v">{tickets.length}</div></div>
      </div>
      <section className="card">
        <h2 className="h-md" style={{ marginBottom: 10 }}>Diagnósticos recebidos</h2>
        {tickets.length ? tickets.map((t) => (
          <details key={t.id} style={{ borderBottom: '1px solid var(--line)' }}>
            <summary style={{ cursor: 'pointer', padding: '10px 0', display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <span><b>#{t.id}</b> · {t.email}</span><span className="faint" style={{ fontSize: 12 }}>{new Date(t.created_at).toLocaleString('pt-BR')}</span></summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11.5, color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 8, padding: 10, overflowX: 'auto', margin: '0 0 10px' }}>{t.body}</pre>
          </details>
        )) : <p className="muted">Nenhum diagnóstico recebido ainda.</p>}
      </section>
      <CatalogEditor apps={apps} />
      <section className="card"><h2 className="h-md" style={{ marginBottom: 8 }}>Enviar APK</h2>
        <p className="muted">O envio e a hospedagem dos APKs entram na próxima etapa (armazenamento com link por licença). Por enquanto, o download aponta para a versão pública.</p></section>
    </Shell>
  );
}
