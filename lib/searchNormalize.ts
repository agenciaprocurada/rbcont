/**
 * Normaliza um termo de busca para agrupamento de consultas semelhantes.
 * - lowercase
 * - remove acentos (diacríticos)
 * - colapsa whitespace
 * - remove pontuação
 */
export function normalizeSearchQuery(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{Letter}\p{Number}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
