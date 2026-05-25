import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

type SuggestResult = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  categorySlug: string
  categoryName: string
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const q = (request.nextUrl.searchParams.get('q') ?? '').trim()
  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const like = `%${q}%`
  const prefix = `${q}%`

  const results = await prisma.$queryRaw<
    Array<{
      id: string
      title: string
      slug: string
      excerpt: string | null
      categoryId: string
    }>
  >`
    SELECT id, title, slug, excerpt, "categoryId"
    FROM articles
    WHERE status = 'PUBLISHED'
    AND (
      title ILIKE ${like}
      OR excerpt ILIKE ${like}
      OR to_tsvector('portuguese', title || ' ' || content)
         @@ plainto_tsquery('portuguese', ${q})
    )
    ORDER BY
      CASE
        WHEN title ILIKE ${prefix} THEN 0
        WHEN title ILIKE ${like} THEN 1
        WHEN excerpt ILIKE ${like} THEN 2
        ELSE 3
      END,
      title ASC
    LIMIT 8
  `

  const categoryIds = [...new Set(results.map((r) => r.categoryId))]
  const categories =
    categoryIds.length > 0
      ? await prisma.category.findMany({
          where: { id: { in: categoryIds } },
          select: { id: true, slug: true, name: true },
        })
      : []
  const catMap = new Map(categories.map((c) => [c.id, c]))

  const enriched: SuggestResult[] = results
    .map((r) => {
      const cat = catMap.get(r.categoryId)
      if (!cat) return null
      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        categorySlug: cat.slug,
        categoryName: cat.name,
      }
    })
    .filter((r): r is SuggestResult => r !== null)

  return NextResponse.json({ results: enriched })
}
