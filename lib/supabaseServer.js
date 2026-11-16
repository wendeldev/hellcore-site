import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function supabaseServer() {
  const store = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        getAll() { try { return store.getAll(); } catch (e) { return []; } },
        setAll(list) {
          try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch (e) {}
        },
      },
    }
  );
}
