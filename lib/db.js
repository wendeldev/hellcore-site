// Executa uma consulta do Supabase com segurança: se der erro ou não houver
// configuração, devolve o valor de reserva em vez de quebrar a página.
export async function q(builder, fallback) {
  try {
    const { data, error } = await builder;
    if (error) return fallback;
    return data == null ? fallback : data;
  } catch (e) {
    return fallback;
  }
}
