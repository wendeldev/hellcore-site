export function money(cents) {
  return 'R$ ' + ((cents || 0) / 100).toFixed(2).replace('.', ',');
}
export function dateBR(iso) {
  try { return new Date(iso).toLocaleDateString('pt-BR'); } catch (e) { return ''; }
}
