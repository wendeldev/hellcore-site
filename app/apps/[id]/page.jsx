import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { q } from '@/lib/db';
import { money } from '@/lib/format';
import Shell from '@/components/Shell';
import { Flame } from '@/components/Brand';
import BuyButton from '@/components/BuyButton';

export const dynamic = 'force-dynamic';

const FALLBACK = {
  hellcore: { id: 'hellcore', name: 'HELLCORE', tagline: 'Perfis de desempenho para jogos', price_cents: 890, is_free: false, version: '3.4' },
  root: { id: 'root', name: 'Root (instalador)', tagline: 'Ferramenta de root — grátis', price_cents: 0, is_free: true },
};

export default async function Produto({ params }) {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  const db = supabaseAdmin();
  let a = await q(db.from('apps').select('*').eq('id', params.id).single(), null);
  if (!a) a = FALLBACK[params.id] || null;
  if (!a) notFound();
  const mine = await q(db.from('purchases').select('id').eq('user_id', user.id).eq('app_id', a.id).eq('status', 'paid'), []);
  const owned = mine.length > 0;

  if (a.is_free) {
    return (
      <Shell user={user} isAdmin={user.is_admin} active="apps">
        <Link className="back" href="/apps">‹ Aplicativos</Link>
        <div className="row"><div className="ico rt" style={{ width: 60, height: 60 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9fe08a" strokeWidth="1.6"><path d="M12 3v7" /><circle cx="12" cy="14" r="4.5" /></svg></div>
          <div><h1 className="h-lg">{a.name}</h1><p className="muted" style={{ fontSize: 13 }}>{a.tagline}</p></div></div>
        <section className="card"><h2 className="h-md" style={{ marginBottom: 8 }}>Sobre</h2>
          <p className="muted">Instalador de root para preparar o aparelho. Download gratuito. Use por sua conta e risco; root pode afetar a garantia.</p></section>
        <Link className="btn primary" href="/downloads">Ir para downloads</Link>
      </Shell>
    );
  }

  return (
    <Shell user={user} isAdmin={user.is_admin} active="apps">
      <Link className="back" href="/apps">‹ Aplicativos</Link>
      <div className="row"><div className="ico hc" style={{ width: 62, height: 62 }}><Flame size={26} /></div>
        <div><h1 className="h-lg">{a.name}</h1><p className="muted" style={{ fontSize: 13 }}>{a.tagline}</p></div></div>
      <div className="row wrap-f" style={{ gap: 8 }}>
        <span className="pill red">{money(a.price_cents)}</span>
        <span className="pill ink">Licença vitalícia</span>
        <span className="pill ink">Ativação: root temporário</span>
        {a.version && <span className="pill ok">v{a.version}</span>}
      </div>
      <section className="card"><h2 className="h-md" style={{ marginBottom: 8 }}>Sobre o aplicativo</h2>
        <p className="muted">{a.description || 'O HELLCORE ajusta CPU e GPU do seu celular para jogos, com três modos — Eco, Moderado e Extremo — que se adaptam ao hardware de cada aparelho. Inclui tela de compatibilidade, otimização pré-jogo e o destrave de 120 FPS em celulares Xiaomi.'}</p>
        <hr className="divider" />
        <ul className="clean">
          <li>Perfis de desempenho adaptados a cada processador.</li>
          <li>GPU no máximo e restauração automática ao fim da sessão.</li>
          <li>Licença vitalícia: pague uma vez, use sempre.</li>
        </ul></section>
      <section className="card"><h2 className="h-md" style={{ marginBottom: 8 }}>Modo de ativação</h2>
        <p className="muted">A ativação é por <b style={{ color: 'var(--fg)' }}>root temporário</b>, disponibilizado pelo próprio site. Os perfis de CPU/GPU exigem root; sem root, o app ainda oferece o Modo Leve.</p></section>
      {owned
        ? <p className="pill ok" style={{ alignSelf: 'center' }}>Você já tem este app</p>
        : <BuyButton appId={a.id} label={`Comprar · ${money(a.price_cents)}`} />}
    </Shell>
  );
}
