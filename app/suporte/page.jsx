import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { dateBR } from '@/lib/format';
import Shell from '@/components/Shell';
import SupportForm from '@/components/SupportForm';

export const dynamic = 'force-dynamic';

export default async function Suporte() {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  const db = supabaseAdmin();
  const { data: tickets = [] } = await db.from('tickets').select('id, status, created_at').eq('user_id', user.id).order('created_at', { ascending: false });
  return (
    <Shell user={user} isAdmin={user.is_admin} active="suporte">
      <div><p className="eyebrow">Suporte</p><h1 className="h-lg" style={{ marginTop: 6 }}>Enviar diagnóstico</h1>
        <p className="muted" style={{ marginTop: 4 }}>No HELLCORE, toque em “Copiar diagnóstico” e cole aqui. A gente analisa e responde.</p></div>
      <SupportForm />
      {tickets.length > 0 && (
        <section className="card"><h2 className="h-md" style={{ marginBottom: 10 }}>Seus envios</h2>
          {tickets.map((t) => (
            <div key={t.id} className="between" style={{ padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
              <div><div style={{ fontWeight: 600, fontSize: 13.5 }}>#{t.id}</div><div className="faint" style={{ fontSize: 12 }}>{dateBR(t.created_at)}</div></div>
              <span className="pill warn">{t.status}</span>
            </div>
          ))}
        </section>
      )}
    </Shell>
  );
}
