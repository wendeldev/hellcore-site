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
  hellcore: { id: 'hellcore', name: 'HELLCORE', tagline: 'Perfis de desempenho para jogos', price_cents: 890, is_free: false, version: '3.6' },
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
        <span className="pill ink">Ativação por chave</span>
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
      <section className="card"><h2 className="h-md" style={{ marginBottom: 8 }}>Como ativar</h2>
        <ol className="clean" style={{ listStyle: 'decimal', paddingLeft: 20 }}>
          <li>Depois de comprar, abra <b style={{ color: 'var(--fg)' }}>Licença</b> aqui no site e copie sua chave <code>HC-…</code>.</li>
          <li>No app HELLCORE, cole a chave no cartão <b style={{ color: 'var(--fg)' }}>Licença</b> e toque em Ativar.</li>
          <li>A licença fica presa a este aparelho. Para usar em outro, é só desvincular em <b style={{ color: 'var(--fg)' }}>Aparelhos</b>.</li>
        </ol></section>
      <section className="card"><h2 className="h-md" style={{ marginBottom: 10 }}>O que cada tipo de acesso libera</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div className="row" style={{ gap: 8, marginBottom: 6 }}>
              <span className="pill red">Com root</span>
              <span className="faint" style={{ fontSize: 12 }}>Magisk / KernelSU — experiência completa</span>
            </div>
            <ul className="clean">
              <li>Modos <b style={{ color: 'var(--fg)' }}>Eco, Moderado e Extremo</b> fixando CPU e GPU.</li>
              <li>GPU no máximo e restauração automática ao fim da sessão.</li>
              <li>Destrave de <b style={{ color: 'var(--fg)' }}>120 FPS</b> (Xiaomi) automático e otimização pré-jogo.</li>
            </ul>
          </div>
          <div>
            <div className="row" style={{ gap: 8, marginBottom: 6 }}>
              <span className="pill ink">Sem root — Modo Leve</span>
              <span className="faint" style={{ fontSize: 12 }}>já incluso, sem instalar nada</span>
            </div>
            <ul className="clean">
              <li>Trava a tela no <b style={{ color: 'var(--fg)' }}>máximo de Hz</b> e mantém o jogo ativo.</li>
              <li>Silencia notificações durante a sessão. Tudo reversível.</li>
              <li>Não fixa CPU/GPU — isso exige root.</li>
            </ul>
          </div>
        </div>
        <hr className="divider" />
        <p className="faint" style={{ fontSize: 12.5 }}>Para a experiência completa (Eco, Moderado e Extremo), o aparelho precisa estar com root (Magisk ou KernelSU). Sem root, o Modo Leve funciona em qualquer celular.</p></section>
      {owned
        ? <p className="pill ok" style={{ alignSelf: 'center' }}>Você já tem este app</p>
        : <BuyButton appId={a.id} label={`Comprar · ${money(a.price_cents)}`} />}
    </Shell>
  );
}
