import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Cliente do Supabase para componentes de servidor (lê a sessão do usuário pelos cookies).
export function supabaseServer() {
  const store = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return store.getAll(); },
        setAll(list) {
          try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch (e) {}
        },
      },
    }
  );
}
