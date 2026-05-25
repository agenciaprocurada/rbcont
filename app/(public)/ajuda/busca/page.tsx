import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Topbar } from '@/components/public/Topbar'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Busca | RBCont',
  robots: { index: false, follow: false },
}

interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
  categoryId: string
}

interface Props {
  searchParams: { q?: string }
}

export default async function BuscaPage({ searchParams }: Props) {
  const query = (searchParams.q ?? '').trim()

  let results: SearchResult[] = []
  if (query.length >= 2) {
    const like = `%${query}%`
    const prefix = `${query}%`
    results = await prisma.$queryRaw<SearchResult[]>`
      SELECT id, title, slug, excerpt, "categoryId"
      FROM articles
      WHERE status = 'PUBLISHED'
      AND (
        title ILIKE ${like}
        OR excerpt ILIKE ${like}
        OR content ILIKE ${like}
        OR to_tsvector('portuguese', title || ' ' || content)
           @@ plainto_tsquery('portuguese', ${query})
      )
      ORDER BY
        CASE
          WHEN title ILIKE ${prefix} THEN 0
          WHEN title ILIKE ${like} THEN 1
          WHEN excerpt ILIKE ${like} THEN 2
          ELSE 3
        END,
        ts_rank(to_tsvector('portuguese', title || ' ' || content),
                plainto_tsquery('portuguese', ${query})) DESC,
        title ASC
      LIMIT 20
    `
  }

  const categoryIds = [...new Set(results.map((r) => r.categoryId))]
  const categories =
    categoryIds.length > 0
      ? await prisma.category.findMany({
          where: { id: { in: categoryIds } },
          select: { id: true, slug: true, name: true },
        })
      : []

  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  return (
    <>
      <Topbar crumbs={[{ label: 'Busca' }]} initialQuery={query} />

      <div className="tc-page">
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '0 0 18px' }}>
          {query ? <>Resultados para <span className="mono" style={{ background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 6, fontSize: 18 }}>&quot;{query}&quot;</span></> : 'Buscar artigos'}
        </h1>

        {query.length > 0 && query.length < 2 && (
          <div className="tc-searchEmpty">
            <p className="tc-searchEmpty__title">Digite pelo menos 2 caracteres</p>
            <p className="tc-searchEmpty__text">A busca precisa de no mínimo 2 caracteres para retornar resultados.</p>
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="tc-searchEmpty">
            <p className="tc-searchEmpty__title">Nenhum resultado para &ldquo;{query}&rdquo;</p>
            <p className="tc-searchEmpty__text">Tente outras palavras-chave ou volte à página inicial.</p>
            <Link href="/" className="tc-pagination__link">← Voltar à base</Link>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 12 }}>
              {results.length} resultado{results.length !== 1 ? 's' : ''}
            </p>
            <div className="tc-artList">
              <div className="tc-artList__head">
                <span>Artigo</span>
                <span>Categoria</span>
                <span></span>
                <span></span>
              </div>
              {results.map((r) => {
                const category = categoryMap.get(r.categoryId)
                if (!category) return null
                return (
                  <Link
                    key={r.id}
                    href={`/ajuda/${category.slug}/${r.slug}`}
                    className="tc-artList__row"
                  >
                    <div>
                      <div className="tc-artList__title">{r.title}</div>
                      {r.excerpt && <div className="tc-artList__excerpt">{r.excerpt}</div>}
                    </div>
                    <span className="tc-artList__cell">{category.name}</span>
                    <span />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </>
  )
}
