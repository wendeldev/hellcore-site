'use client';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function GoogleButton() {
  async function login() {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }
  return (
    <button className="gbtn" onClick={login}>
      <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.4-.2-2H12v3.8h5.9c-.1 1-.8 2.5-2.3 3.5l3.4 2.6c2-1.9 3.5-4.6 3.5-7.9z"/><path fill="#34A853" d="M12 23c3 0 5.6-1 7.4-2.7l-3.4-2.6c-.9.6-2.1 1.1-4 1.1-3 0-5.6-2-6.5-4.8l-3.6 2.7C3.3 20.5 7.3 23 12 23z"/><path fill="#FBBC05" d="M5.5 14c-.2-.6-.4-1.3-.4-2s.1-1.4.4-2L1.9 7.3C1.3 8.7 1 10.3 1 12s.3 3.3.9 4.7z"/><path fill="#EA4335" d="M12 5.4c1.7 0 2.8.7 3.5 1.3l2.9-2.9C16.6 2.2 14 1 12 1 7.3 1 3.3 3.5 1.9 7.3l3.6 2.7C6.4 7.3 9 5.4 12 5.4z"/></svg>
      Entrar com Google
    </button>
  );
}
