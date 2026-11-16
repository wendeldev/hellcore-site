import Link from 'next/link';
import { Flame } from '@/components/Brand';

export const metadata = { title: 'Política de Privacidade — HELLCORE' };

export default function Privacidade() {
  return (
    <main className="wrap view">
      <div className="row" style={{ marginBottom: 6 }}><Flame /><div className="brand">HELL<b>CORE</b></div></div>
      <h1 className="h-lg">Política de Privacidade</h1>
      <p className="faint" style={{ fontSize: 12 }}>Última atualização: novembro de 2026</p>
      <section className="card">
        <ol className="clean" style={{ listStyle: 'decimal', gap: 12 }}>
          <li><b style={{ color: 'var(--fg)' }}>Dados que coletamos.</b> Ao entrar com sua conta Google, recebemos seu <b style={{ color: 'var(--fg)' }}>nome</b> e <b style={{ color: 'var(--fg)' }}>e-mail</b>, usados apenas para identificar sua conta e sua licença. Guardamos também suas compras, a licença e, se você enviar pelo suporte, o texto de diagnóstico do aparelho.</li>
          <li><b style={{ color: 'var(--fg)' }}>Como usamos.</b> Os dados servem para liberar e validar sua licença, mostrar seus aplicativos e dar suporte. Não vendemos nem compartilhamos seus dados com terceiros para publicidade.</li>
          <li><b style={{ color: 'var(--fg)' }}>Pagamento.</b> O pagamento é processado pelo Mercado Pago, que trata os dados financeiros conforme a política própria deles. Não armazenamos dados de cartão.</li>
          <li><b style={{ color: 'var(--fg)' }}>Armazenamento.</b> Os dados ficam guardados em serviços de nuvem (Supabase) usados para operar o site.</li>
          <li><b style={{ color: 'var(--fg)' }}>Seus direitos.</b> Você pode pedir a exclusão da sua conta e dos seus dados pelo e-mail de contato.</li>
          <li><b style={{ color: 'var(--fg)' }}>Contato.</b> wendel.nike03@gmail.com</li>
        </ol>
      </section>
      <p><Link className="pill ink" href="/">Voltar ao site</Link></p>
    </main>
  );
}
