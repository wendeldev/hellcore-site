import { redirect } from 'next/navigation';
import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { money, dateBR } from '@/lib/format';
import Shell from '@/components/Shell';

export const dynamic = 'force-dynamic';

export default async function Inicio() {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  const db = supabaseAdmin();
  const { data: purchases = [] } = await db
    .from('purchases').select('*, apps(name)').eq('user_id', user.id).eq('status', 'paid')
    .order('created_at', { ascending: false });
  const { data: devices = [] } = await db
    .from('devices').select('*').eq('user_id', user.id).eq('active', true);
  const device = devices[0];
  const hasLic = purchases.length > 0;

  return (
    <Shell user={user} isAdmin={user.is_admin} active="inicio">
      <div>
        <p className="eyebrow">Início</p>
        <h1 className="h-xl" style={{ marginTop: 6 }}>Olá, {user.name.split(' ')[0]}</h1>
        <p className="muted" style={{ marginTop: 4 }}>Aqui está tudo que você já tem.</p>
      </div>
      <div className="grid2">
        <div className="stat"><div className="k">Licença</div><div className="v">
          {hasLic ? <span className="pill ok"><span className="dot" />Ativa</span> : <span className="pill ink">Nenhuma</span>}
        </div></div>
        <div className="stat"><div className="k">Apps ativos</div><div className="v">{hasLic ? purchases.length : 0}</div></div>
      </div>
      <section className="card">
        <h2 className="h-md" style={{ marginBottom: 10 }}>Aplicativos adquiridos</h2>
        {purchases.length ? purchases.map((p) => (
          <div key={p.id} className="between" style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
            <div><div style={{ fontWeight: 600 }}>{p.apps?.name || p.app_id}</div>
              <div className="faint" style={{ fontSize: 12 }}>{dateBR(p.created_at)} · {p.license_type}</div></div>
            <Link className="btn sm ghost" href="/downloads">Baixar</Link>
          </div>
        )) : <p className="muted">Você ainda não comprou nenhum app. Veja em <Link className="pill ink" href="/apps">Aplicativos</Link>.</p>}
      </section>
      <section className="card">
        <h2 className="h-md" style={{ marginBottom: 10 }}>Aparelho conectado</h2>
        {device ? (
          <div className="between">
            <div><div style={{ fontWeight: 600 }}>{device.name}</div>
              <div className="faint" style={{ fontSize: 12 }}>Android {device.android} · ID {device.device_id}</div></div>
            <span className="pill ok"><span className="dot" />Vinculado</span>
          </div>
        ) : <p className="muted">Nenhum aparelho vinculado ainda. Ele aparece aqui depois da ativação por root temporário.</p>}
      </section>
    </Shell>
  );
}
