import Link from 'next/link';
import { Flame } from './Brand';

const ICONS = {
  inicio: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  apps: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  downloads: '<path d="M12 3v12"/><path d="M8 11l4 4 4-4"/><path d="M4 21h16"/>',
  licenca: '<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
  aparelhos: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
  suporte: '<path d="M21 15a2 2 0 0 1-2 2H8l-4 3V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/>',
};
const NAV = [
  ['inicio', 'Iniciar', '/'],
  ['apps', 'Apps', '/apps'],
  ['downloads', 'Downloads', '/downloads'],
  ['licenca', 'Licença', '/licenca'],
  ['aparelhos', 'Aparelhos', '/aparelhos'],
  ['suporte', 'Suporte', '/suporte'],
];

function NavIcon({ name }) {
  return <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />;
}

export default function Shell({ user, isAdmin, active, children }) {
  const first = (user?.name || 'Você').split(' ')[0];
  const initial = (user?.name || 'U').charAt(0).toUpperCase();
  return (
    <>
      <header className="top">
        <div className="wrap top-in">
          <div className="brand"><Flame />HELL<b>CORE</b></div>
          <div className="spacer" />
          {isAdmin && (
            <Link href="/admin" className="pill ink" style={{ padding: '6px 11px' }}>Admin</Link>
          )}
          <Link href="/conta" className="chip">
            <span className="ava">{initial}</span>
            <span>{first}</span>
          </Link>
        </div>
      </header>
      <main className="wrap view">{children}</main>
      <nav className="nav">
        <div className="nav-in">
          {NAV.map(([key, label, href]) => (
            <Link key={key} href={href} className={active === key ? 'on' : ''}>
              <NavIcon name={key} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
