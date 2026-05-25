'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normalizeSearchQuery } from '@/lib/searchNormalize'

/**
 * Registra uma pesquisa que NÃO retornou resultados.
 * Chamada apenas quando o usuário "termina a tentativa" (Enter, fechou modal,
 * apagou tudo). A dedup por sessão é feita no client via sessionStorage —
 * aqui apenas validamos auth e inserimos.
 */
export async function logFailedSearch(query: string): Promise<{ ok: boolean }> {
  const session = await auth()
  if (!session?.user?.id) return { ok: false }

  const trimmed = query.trim()
  if (trimmed.length < 2) return { ok: false }

  const normalizedQ = normalizeSearchQuery(trimmed)
  if (!normalizedQ) return { ok: false }

  await prisma.searchActivity.create({
    data: {
      query: trimmed,
      normalizedQ,
      resultsCount: 0,
      userId: session.user.id,
    },
  })

  return { ok: true }
}
