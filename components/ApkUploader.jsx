'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

function Row({ app }) {
  const [version, setVersion] = useState(app.version || '');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function send() {
    if (!file) { setMsg('Escolha um arquivo .apk.'); return; }
    if (!/\.apk$/i.test(file.name)) { setMsg('O arquivo precisa terminar em .apk.'); return; }
    if (file.size > 200 * 1024 * 1024) { setMsg('Arquivo grande demais (máx. 200 MB).'); return; }
    setBusy(true); setMsg('Preparando envio…');
    try {
      const r1 = await fetch('/api/admin/apk-upload-url', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: app.id }),
      });
      const j1 = await r1.json();
      if (!j1.ok) throw new Error((j1.error || 'Falha ao preparar o envio.') + (j1.detail ? ' [' + j1.detail + ']' : ''));
      setMsg('Enviando o APK…');
      const supabase = supabaseBrowser();
      const { error } = await supabase.storage.from('apks').uploadToSignedUrl(j1.path, j1.token, file, {
        contentType: 'application/vnd.android.package-archive',
      });
      if (error) throw new Error('Falha no envio do arquivo.');
      setMsg('Registrando a versão…');
      const r2 = await fetch('/api/admin/apk-done', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: app.id, version: version.trim() || null }),
      });
      const j2 = await r2.json();
      if (!j2.ok) throw new Error(j2.error || 'Enviado, mas não registrou a versão.');
      setMsg('APK enviado! O download no site já usa este arquivo.');
      setFile(null);
    } catch (e) {
      setMsg(e.message || 'Erro no envio.');
    }
    setBusy(false);
  }

  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
      <div className="between">
        <div style={{ fontWeight: 600 }}>{app.name}</div>
        <span className="faint" style={{ fontSize: 12 }}>{app.version ? 'v' + app.version : 'sem versão'}</span>
      </div>
      <div className="row" style={{ marginTop: 8, gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <label className="fld">Arquivo .apk</label>
          <input type="file" accept=".apk,application/vnd.android.package-archive"
            onChange={(e) => { setFile(e.target.files?.[0] || null); setMsg(''); }}
            style={{ fontSize: 12.5, color: 'var(--muted)', width: '100%' }} />
        </div>
        <div style={{ width: 110 }}>
          <label className="fld">Versão</label>
          <input type="text" value={version} placeholder="3.8" onChange={(e) => setVersion(e.target.value)} />
        </div>
      </div>
      <div className="row" style={{ marginTop: 10, gap: 10 }}>
        <button className="btn sm primary" onClick={send} disabled={busy}>{busy ? 'Enviando…' : 'Enviar APK'}</button>
        {msg && <span className="faint" style={{ fontSize: 12.5 }}>{msg}</span>}
      </div>
    </div>
  );
}

export default function ApkUploader({ apps }) {
  if (!apps || !apps.length) return null;
  return (
    <section className="card">
      <h2 className="h-md" style={{ marginBottom: 6 }}>Enviar APK</h2>
      <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
        O arquivo vai para o armazenamento do site e passa a ser servido no download (protegido por licença).
        Isto não publica a atualização automática do app — essa continua pelo GitHub.
      </p>
      {apps.map((a) => <Row key={a.id} app={a} />)}
    </section>
  );
}
