import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Shell from '@/components/Shell';
import UnbindButton from '@/components/UnbindButton';

export const dynamic = 'force-dynamic';

export default async function Aparelhos() {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  const db = supabaseAdmin();
  const { data: devices = [] } = await db.from('devices').select('*').eq('user_id', user.id).eq('active', true);
  return (
    <Shell user={user} isAdmin={user.is_admin} active="aparelhos">
      <div><p className="eyebrow">Aparelhos</p><h1 className="h-lg" style={{ marginTop: 6 }}>Seus aparelhos</h1></div>
      {devices.length ? devices.map((d) => (
        <section key={d.id} className="card">
          <div className="between"><div><div style={{ fontWeight: 600 }}>{d.name}</div>
            <div className="faint" style={{ fontSize: 12 }}>Android {d.android} · ID {d.device_id}</div></div>
            <span className="pill ok"><span className="dot" />Vinculado</span></div>
          <hr className="divider" />
          <UnbindButton id={d.id} />
        </section>
      )) : <section className="card"><p className="muted">Nenhum aparelho vinculado. Ele é registrado na primeira ativação por root temporário.</p></section>}
      <p className="faint" style={{ fontSize: 12 }}>A licença vitalícia vale para 1 aparelho por vez. Desvincular libera a licença para outro aparelho.</p>
    </Shell>
  );
}
