'use client';
import { useState } from 'react';

export default function TestGrant() {
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  async function run(action) {
    setBusy(true); setMsg('');
    try {
      const r = await fetch('/api/admin/test-grant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) });
      const j = await r.json();
      if (j.ok) {
        setMsg(j.state === 'granted' ? 'Licença de teste liberada! Veja em Início, Licença e Downloads.' : 'Licença de teste removida.');
        setTimeout(() => { window.location.reload(); }, 900);
      } else setMsg(j.error || 'Erro.');
    } catch (e) { setMsg('Falha de conexão.'); }
    setBusy(false);
  }
  return (
    <section className="card">
      <h2 className="h-md" style={{ marginBottom: 6 }}>Teste (só para você)</h2>
      <p className="muted" style={{ marginBottom: 12, fontSize: 13.5 }}>Libera uma licença do HELLCORE na sua conta sem pagamento, para ver como fica depois da compra. Não afeta clientes.</p>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn primary" onClick={() => run('grant')} disabled={busy}>Liberar licença de teste</button>
        <button className="btn line" onClick={() => run('revoke')} disabled={busy}>Remover</button>
      </div>
      {msg && <p className="pill ink" style={{ marginTop: 12, alignSelf: 'flex-start' }}>{msg}</p>}
    </section>
  );
}
