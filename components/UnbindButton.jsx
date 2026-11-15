'use client';
import { useState } from 'react';
export default function UnbindButton({ id }) {
  const [busy, setBusy] = useState(false);
  async function unbind() {
    setBusy(true);
    try { await fetch('/api/aparelho', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); } catch (e) {}
    window.location.reload();
  }
  return <button className="btn line" onClick={unbind} disabled={busy}>{busy ? 'Desvinculando…' : 'Desvincular aparelho'}</button>;
}
