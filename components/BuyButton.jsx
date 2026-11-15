'use client';
import { useState } from 'react';

export default function BuyButton({ appId, label }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  async function buy() {
    setLoading(true); setErr('');
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId }),
      });
      const j = await r.json();
      if (j.init_point) { window.location.href = j.init_point; return; }
      setErr(j.error || 'Não foi possível iniciar o pagamento.');
    } catch (e) { setErr('Falha de conexão. Tente de novo.'); }
    setLoading(false);
  }
  return (
    <>
      <button className="btn primary" onClick={buy} disabled={loading}>{loading ? 'Abrindo pagamento…' : label}</button>
      {err && <p className="pill red" style={{ alignSelf: 'center' }}>{err}</p>}
    </>
  );
}
