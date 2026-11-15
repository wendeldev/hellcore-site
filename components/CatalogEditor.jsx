'use client';
import { useState } from 'react';

export default function CatalogEditor({ apps }) {
  const [rows, setRows] = useState(apps.map((a) => ({ ...a, priceStr: ((a.price_cents || 0) / 100).toFixed(2).replace('.', ',') })));
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  function upd(id, field, val) { setRows((r) => r.map((a) => (a.id === id ? { ...a, [field]: val } : a))); }
  async function save() {
    setBusy(true); setMsg('');
    const payload = rows.map((a) => ({
      id: a.id, is_free: !!a.is_free, version: a.version || null,
      price_cents: a.is_free ? 0 : Math.round(parseFloat(String(a.priceStr).replace('.', '').replace(',', '.')) * 100) || 0,
    }));
    try {
      const r = await fetch('/api/admin/catalog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apps: payload }) });
      const j = await r.json(); setMsg(j.ok ? 'Catálogo salvo.' : (j.error || 'Erro ao salvar.'));
    } catch (e) { setMsg('Falha de conexão.'); }
    setBusy(false);
  }
  return (
    <section className="card">
      <h2 className="h-md" style={{ marginBottom: 10 }}>Aplicativos e preços</h2>
      {rows.map((a) => (
        <div key={a.id} style={{ padding: '11px 0', borderBottom: '1px solid var(--line)' }}>
          <div className="between"><div style={{ fontWeight: 600 }}>{a.name}</div>
            <label className="pill ink" style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={!!a.is_free} onChange={(e) => upd(a.id, 'is_free', e.target.checked)} style={{ marginRight: 6, accentColor: 'var(--accent)' }} />Grátis</label></div>
          <div className="row" style={{ marginTop: 8, gap: 8 }}>
            <div style={{ flex: 1 }}><label className="fld">Preço (R$)</label>
              <input type="text" inputMode="decimal" value={a.priceStr} disabled={!!a.is_free} onChange={(e) => upd(a.id, 'priceStr', e.target.value)} /></div>
            <div style={{ flex: 1 }}><label className="fld">Versão</label>
              <input type="text" value={a.version || ''} onChange={(e) => upd(a.id, 'version', e.target.value)} /></div>
          </div>
        </div>
      ))}
      <div style={{ height: 12 }} />
      <button className="btn primary" onClick={save} disabled={busy}>{busy ? 'Salvando…' : 'Salvar alterações'}</button>
      {msg && <p className="pill ink" style={{ marginTop: 12, alignSelf: 'flex-start' }}>{msg}</p>}
    </section>
  );
}
