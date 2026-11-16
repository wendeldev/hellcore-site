import { supabaseServer } from './supabaseServer';
import { supabaseAdmin } from './supabaseAdmin';

// E-mails que são administradores (dono do site). Pode ter mais de um.
const OWNERS = (process.env.OWNER_EMAILS || 'wendel.nike03@gmail.com')
  .toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);

export async function currentUser() {
  try {
    const supabase = supabaseServer();
    const { data } = await supabase.auth.getUser();
    const u = data?.user;
    if (!u) return null;
    const email = (u.email || '').toLowerCase();
    const isOwner = OWNERS.includes(email);
    const name =
      u.user_metadata?.full_name || u.user_metadata?.name || (u.email || 'Você').split('@')[0];
    let dbAdmin = false;
    try {
      const admin = supabaseAdmin();
      await admin.from('profiles').upsert({ id: u.id, email: u.email, name }, { onConflict: 'id' });
      const { data: prof } = await admin.from('profiles').select('is_admin').eq('id', u.id).single();
      dbAdmin = !!(prof && prof.is_admin);
      if (isOwner && !dbAdmin) {
        await admin.from('profiles').update({ is_admin: true }).eq('id', u.id);
        dbAdmin = true;
      }
    } catch (e) {}
    // O dono é sempre admin, mesmo se o banco estiver indisponível.
    return { id: u.id, email: u.email, name, is_admin: isOwner || dbAdmin };
  } catch (e) {
    return null;
  }
}
