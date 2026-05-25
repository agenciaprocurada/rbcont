import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { pruneOldSearchActivities } from '@/app/actions/search-insights'
import { SearchActivitiesClient } from '@/components/admin/SearchActivitiesClient'

export const dynamic = 'force-dynamic'

const WINDOW_DAYS = 30

export default async function AtividadesPesquisaPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')

  if (session.user.role !== 'SUPER_ADMIN') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Sem permissão</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Apenas Administradores têm acesso a esta página.
        </p>
      </div>
    )
  }

  // Cleanup oportunista de retenção (60d) — não bloqueia a página
  pruneOldSearchActivities().catch((e) =>
    console.error('[searchActivities] prune falhou:', e)
  )

  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000)

  // Lista paginada simples (últimos 200 logs)
  const recent = await prisma.searchActivity.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  })

  // Top grupos sem resultado (últimos 30 dias)
  const failed = await prisma.searchActivity.findMany({
    where: { resultsCount: 0, createdAt: { gte: since } },
    select: { query: true, normalizedQ: true, userId: true, createdAt: true },
  })

  type Group = {
    normalizedQ: string
    variants: Set<string>
    users: Set<string>
    total: number
    lastSeen: Date
  }
  const groupsMap = new Map<string, Group>()
  for (const r of failed) {
    const g = groupsMap.get(r.normalizedQ) ?? {
      normalizedQ: r.normalizedQ,
      variants: new Set<string>(),
      users: new Set<string>(),
      total: 0,
      lastSeen: r.createdAt,
    }
    g.variants.add(r.query.trim())
    g.users.add(r.userId)
    g.total += 1
    if (r.createdAt > g.lastSeen) g.lastSeen = r.createdAt
    groupsMap.set(r.normalizedQ, g)
  }
  const failedGroups = [...groupsMap.values()]
    .map((g) => ({
      normalizedQ: g.normalizedQ,
      variants: [...g.variants],
      distinctUsers: g.users.size,
      total: g.total,
      lastSeen: g.lastSeen.toISOString(),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 50)

  // Stats agregadas
  const [totalAll, totalFailed] = await Promise.all([
    prisma.searchActivity.count({ where: { createdAt: { gte: since } } }),
    prisma.searchActivity.count({
      where: { resultsCount: 0, createdAt: { gte: since } },
    }),
  ])

  const recentSerializable = recent.map((r) => ({
    id: r.id,
    query: r.query,
    normalizedQ: r.normalizedQ,
    resultsCount: r.resultsCount,
    createdAt: r.createdAt.toISOString(),
    user: r.user,
  }))

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '4px',
            letterSpacing: '-0.3px',
          }}
        >
          Atividades de pesquisa
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', margin: 0 }}>
          Pesquisas feitas pelos usuários nos últimos {WINDOW_DAYS} dias. Use a análise
          de IA para identificar lacunas de conteúdo a partir das buscas sem resultado.
        </p>
      </div>

      <SearchActivitiesClient
        recent={recentSerializable}
        failedGroups={failedGroups}
        stats={{
          totalAll,
          totalFailed,
          windowDays: WINDOW_DAYS,
          canAnalyze: totalFailed >= 3,
        }}
      />
    </div>
  )
}
