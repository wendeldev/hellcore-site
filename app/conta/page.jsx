import { redirect } from 'next/navigation';
import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import Shell from '@/components/Shell';

export const dynamic = 'force-dynamic';

export default async function Conta() {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  return (
    <Shell user={user} isAdmin={user.is_admin} active="inicio">
      <div><p className="eyebrow">Conta</p><h1 className="h-lg" style={{ marginTop: 6 }}>{user.name}</h1>
        <p className="muted" style={{ fontSize: 13 }}>{user.email}</p></div>
      {user.is_admin && <Link className="btn ghost" href="/admin">Área do administrador</Link>}
      <form action="/api/sair" method="post"><button className="btn line" type="submit" style={{ width: '100%' }}>Sair</button></form>
    </Shell>
  );
}
