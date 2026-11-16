import Link from 'next/link';
import { Flame } from '@/components/Brand';

export const metadata = { title: 'Termos de Uso — HELLCORE' };

export default function Termos() {
  return (
    <main className="wrap view">
      <div className="row" style={{ marginBottom: 6 }}><Flame /><div className="brand">HELL<b>CORE</b></div></div>
      <h1 className="h-lg">Termos de Uso</h1>
      <p className="faint" style={{ fontSize: 12 }}>Última atualização: novembro de 2026</p>
      <section className="card">
        <ol className="clean" style={{ listStyle: 'decimal', gap: 12 }}>
          <li><b style={{ color: 'var(--fg)' }}>Licença.</b> Ao comprar o HELLCORE você recebe uma licença pessoal e vitalícia de uso do aplicativo, vinculada à sua conta e ao seu aparelho na ativação. É proibido revender, redistribuir ou compartilhar o APK adquirido.</li>
          <li><b style={{ color: 'var(--fg)' }}>Root.</b> Os perfis de CPU/GPU do HELLCORE exigem acesso root. Root pode afetar a garantia e a segurança do aparelho. O uso é por sua conta e risco. O HELLCORE não instala root e apenas ajusta limites de frequência que o próprio sistema já oferece; não altera tensões nem aplica ajustes no boot.</li>
          <li><b style={{ color: 'var(--fg)' }}>Desempenho.</b> O ganho de desempenho e a temperatura variam conforme o aparelho, o jogo e o resfriamento. Tela em 120 Hz não garante 120 FPS. O app não desbloqueia opções bloqueadas pelo próprio jogo.</li>
          <li><b style={{ color: 'var(--fg)' }}>Pagamento.</b> As compras são processadas pelo Mercado Pago. O valor e a forma de pagamento são exibidos antes da confirmação.</li>
          <li><b style={{ color: 'var(--fg)' }}>Marcas.</b> HELLCORE é um produto independente, sem vínculo com Qualcomm, MediaTek, Xiaomi, Samsung, Google ou qualquer fabricante.</li>
          <li><b style={{ color: 'var(--fg)' }}>Contato.</b> Dúvidas e suporte pelo e-mail abaixo.</li>
        </ol>
      </section>
      <p className="muted" style={{ fontSize: 13 }}>Contato: wendel.nike03@gmail.com</p>
      <p><Link className="pill ink" href="/">Voltar ao site</Link></p>
    </main>
  );
}
