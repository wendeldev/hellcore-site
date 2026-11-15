import { createClient } from '@supabase/supabase-js';

// Cliente com a chave SECRETA (service role). Passa por cima das regras (RLS).
// Usado só no servidor para liberar licença, confirmar pagamento, ler tudo no admin.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
