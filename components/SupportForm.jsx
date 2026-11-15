'use client';
import { useState } from 'react';

export default function SupportForm() {
  const [v, setV] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  async function send() {
    if (v.trim().length < 8) { setMsg('Cole o diagnóstico antes de enviar.'); return; }
    setBusy(true); setMsg('');
    try {
      const r = await fetch('/api/suporte', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body: v }) });
      const j = await r.json();
      if (j.ok) { setMsg('Diagnóstico enviado. Protocolo #' + j.id); setV(''); }
      else setMsg(j.error || 'Não foi possível enviar.');
    } catch (e) { setMsg('Falha de conexão.'); }
    setBusy(false);
  }
  return (
    <section className="card">
      <label className="fld" htmlFor="diag">Diagnóstico ou descrição do problema</label>
      <textarea id="diag" value={v} onChange={(e) => setV(e.target.value)} placeholder="Cole aqui o texto de ‘Copiar diagnóstico’ do app..." />
      <div style={{ height: 12 }} />
      <button className="btn primary" onClick={send} disabled={busy}>{busy ? 'Enviando…' : 'Enviar para o suporte'}</button>
      {msg && <p className="pill ink" style={{ marginTop: 12, alignSelf: 'flex-start' }}>{msg}</p>}
    </section>
  );
}
