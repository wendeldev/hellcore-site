import { redirect } from 'next/navigation';
import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { dateBR } from '@/lib/format';
import Shell from '@/components/Shell';

export const dynamic = 'force-dynamic';

export default async function Licenca() {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  const db = supabaseAdmin();
  const { data: p } = await db.from('purchases').select('*').eq('user_id', user.id).eq('app_id', 'hellcore').eq('status', 'paid').maybeSingle();
  const { data: devices = [] } = await db.from('devices').select('name').eq('user_id', user.id).eq('active', true);
  if (!p) {
    return (
      <Shell user={user} isAdmin={user.is_admin} active="licenca">
        <div><p className="eyebrow">Licença</p><h1 className="h-lg" style={{ marginTop: 6 }}>Nenhuma licença ativa</h1></div>
        <section className="card"><p className="muted" style={{ marginBottom: 12 }}>Você ainda não ativou uma licença do HELLCORE.</p>
          <Link className="btn primary" href="/apps">Ver aplicativos</Link></section>
      </Shell>
    );
  }
  return (
    <Shell user={user} isAdmin={user.is_admin} active="licenca">
      <div><p className="eyebrow">Licença</p><h1 className="h-lg" style={{ marginTop: 6 }}>HELLCORE</h1></div>
      <section className="card">
        <div className="between" style={{ marginBottom: 6 }}><h2 className="h-md">Detalhes</h2><span className="pill ok"><span className="dot" />Ativa</span></div>
        <div className="kv"><span>Tipo</span><span className="muted">{p.license_type}</span></div>
        <div className="kv"><span>Ativação</span><span className="muted">Root temporário</span></div>
        <div className="kv"><span>Chave</span><span className="muted">HC-{p.license_key || '----'}</span></div>
        <div className="kv"><span>Comprada em</span><span className="muted">{dateBR(p.created_at)}</span></div>
        <div className="kv"><span>Aparelho vinculado</span><span className="muted">{devices[0]?.name || '—'}</span></div>
      </section>
    </Shell>
  );
}
