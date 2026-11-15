import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { Flame } from '@/components/Brand';
import GoogleButton from '@/components/GoogleButton';

export default async function Entrar() {
  const user = await currentUser();
  if (user) redirect('/');
  return (
    <main className="wrap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 18, textAlign: 'center', paddingTop: 40, paddingBottom: 40 }}>
      <div className="row"><Flame size={28} /><div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '.2em', fontSize: 24 }}>HELL<b style={{ color: 'var(--accent)' }}>CORE</b></div></div>
      <h1 className="h-xl">Desempenho de verdade<br />no seu jogo</h1>
      <p className="muted" style={{ maxWidth: 360 }}>Perfis de CPU e GPU, otimização pré-jogo e destrave de 120 FPS. Entre com sua conta Google para ver sua licença e seus aplicativos.</p>
      <GoogleButton />
      <p className="faint" style={{ fontSize: 12, maxWidth: 320 }}>Usamos sua conta Google só para identificar você. Nada é publicado.</p>
    </main>
  );
}
