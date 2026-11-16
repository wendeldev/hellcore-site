import { redirect } from 'next/navigation';
import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { grantFromPayment } from '@/lib/grant';
import Shell from '@/components/Shell';

export const dynamic = 'force-dynamic';

export default async function Sucesso({ searchParams }) {
  const user = await currentUser();
  if (!user) redirect('/entrar');
  const paymentId = searchParams?.payment_id || searchParams?.collection_id || null;
  let granted = false;
  if (paymentId) granted = await grantFromPayment(paymentId);
  return (
    <Shell user={user} isAdmin={user.is_admin} active="inicio">
      <div style={{ textAlign: 'center', paddingTop: 10 }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, margin: '0 auto', display: 'grid', placeItems: 'center', background: 'rgba(24,181,106,.14)', border: '1px solid rgba(24,181,106,.4)' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#18b56a" strokeWidth="2.2"><path d="M5 12l5 5 9-11" /></svg></div>
        <h1 className="h-xl" style={{ marginTop: 14 }}>{granted ? 'Compra aprovada' : 'Pagamento recebido'}</h1>
        <p className="muted" style={{ marginTop: 6 }}>{granted
          ? 'Sua licença já está ativa. Baixe o app em Downloads.'
          : 'Assim que o Mercado Pago confirmar, sua licença aparece como ativa. Pode levar alguns segundos — recarregue esta página.'}</p>
      </div>
      <Link className="btn primary" href="/downloads">Ir para downloads</Link>
      <Link className="btn ghost" href="/">Voltar ao início</Link>
    </Shell>
  );
}
