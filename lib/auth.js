import { supabaseServer } from './supabaseServer';
import { supabaseAdmin } from './supabaseAdmin';

const OWNER = (process.env.OWNER_EMAIL || 'wendel.nike03@gmail.com').toLowerCase();

// Usuário logado (ou null). Garante que exista um perfil e marca o dono como admin.
export async function currentUser() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  const u = data?.user;
  if (!u) return null;
  const name =
    u.user_metadata?.full_name || u.user_metadata?.name || (u.email || 'Você').split('@')[0];
  const admin = supabaseAdmin();
  try {
    await admin.from('profiles').upsert({ id: u.id, email: u.email, name }, { onConflict: 'id' });
    let { data: prof } = await admin.from('profiles').select('*').eq('id', u.id).single();
    if ((u.email || '').toLowerCase() === OWNER && prof && !prof.is_admin) {
      await admin.from('profiles').update({ is_admin: true }).eq('id', u.id);
      prof = { ...prof, is_admin: true };
    }
    return { id: u.id, email: u.email, name, is_admin: !!(prof && prof.is_admin) };
  } catch (e) {
    return { id: u.id, email: u.email, name, is_admin: (u.email || '').toLowerCase() === OWNER };
  }
}
