import { createClient } from '@supabase/supabase-js';

// Cliente com a chave SECRETA (service role). Usa valores de reserva para NUNCA
// lançar erro na criação; se a chave estiver ausente, as consultas simplesmente
// falham e o site trata como "sem dados".
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
