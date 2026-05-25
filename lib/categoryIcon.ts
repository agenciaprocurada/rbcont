import type { IconName } from '@/components/public/Icon'

// Mapeia o slug da categoria para um ícone SVG do mockup.
// Fallback: 'book' (genérico). Não usamos a coluna `icon` do banco
// (que armazena emoji) — preferimos manter o estilo line-icon do design system.
const SLUG_TO_ICON: Record<string, IconName> = {
  'primeiros-passos': 'rocket',
  'wordpress': 'edit',
  'dominios': 'globe',
  'dominios-dns': 'globe',
  'dns': 'globe',
  'email': 'mail',
  'e-mail': 'mail',
  'vps': 'server',
  'servidor': 'server',
  'servidores': 'server',
  'seguranca': 'shield',
  'seguranca-backup': 'shield',
  'backup': 'shield',
  'faturamento': 'credit-card',
  'pagamento': 'credit-card',
  'pagamentos': 'credit-card',
  'afiliados': 'users',
  'usuarios': 'users',
  'banco-de-dados': 'database',
  'database': 'database',
  'api': 'database',
  'documentacao': 'book',
  'docs': 'book',
  'configuracao': 'settings',
  'config': 'settings',
}

export function iconForSlug(slug: string | null | undefined): IconName {
  if (!slug) return 'book'
  return SLUG_TO_ICON[slug] ?? 'book'
}
