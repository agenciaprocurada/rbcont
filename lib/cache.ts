import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

/**
 * Cache de conteúdo compartilhado.
 *
 * O site /ajuda é autenticado, mas o CONTEÚDO (categorias e artigos publicados)
 * é idêntico para todos os usuários. Cacheamos só essas queries — sessão,
 * favoritos e qualquer dado por-usuário continuam fora do cache, sempre
 * dinâmicos. Assim não há risco de vazar dados entre usuários.
 *
 * Invalidação é ON-DEMAND via tags: as server actions do admin chamam
 * revalidateTag(TAGS.articles | TAGS.categories) ao criar/editar/excluir.
 * Enquanto nada muda, as páginas servem do cache (rápido) e não tocam o banco.
 */

export const TAGS = {
  articles: 'articles',
  categories: 'categories',
} as const

// Categorias ativas com contagem de artigos publicados — usada no layout (toda
// página) e na home. Tag: categories (muda contagem) + articles (publicar artigo
// altera o _count).
export const getActiveCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        icon: true,
        _count: { select: { articles: { where: { status: 'PUBLISHED' } } } },
      },
    }),
  ['active-categories'],
  { tags: [TAGS.categories, TAGS.articles] },
)

// Dados agregados da home (trending + contagens). Depende de artigos.
export const getHomeData = unstable_cache(
  async () => {
    const [trending, categories, totalArticles, totalUpdated7d] = await Promise.all([
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { views: 'desc' },
        take: 5,
        select: {
          id: true, title: true, slug: true, views: true, updatedAt: true,
          category: { select: { slug: true, name: true } },
        },
      }),
      prisma.category.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
        take: 8,
        include: { _count: { select: { articles: { where: { status: 'PUBLISHED' } } } } },
      }),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({
        where: {
          status: 'PUBLISHED',
          updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ])
    return { trending, categories, totalArticles, totalUpdated7d }
  },
  ['home-data'],
  { tags: [TAGS.articles, TAGS.categories] },
)

// Página de categoria: artigos publicados paginados + total. Parametrizado por
// slug + página (a key inclui os args automaticamente via unstable_cache).
export const getCategoryPage = (slug: string, page: number, perPage: number) =>
  unstable_cache(
    async () => {
      const category = await prisma.category.findUnique({
        where: { slug, active: true },
      })
      if (!category) return null

      const skip = (page - 1) * perPage
      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where: { categoryId: category.id, status: 'PUBLISHED' },
          orderBy: { views: 'desc' },
          skip,
          take: perPage,
          select: {
            id: true, title: true, slug: true, excerpt: true,
            views: true, updatedAt: true,
          },
        }),
        prisma.article.count({ where: { categoryId: category.id, status: 'PUBLISHED' } }),
      ])
      return { category, articles, total }
    },
    ['category-page', slug, String(page), String(perPage)],
    { tags: [TAGS.articles, TAGS.categories] },
  )()

// Artigos recentes (conteúdo compartilhado). Tag: articles.
export const getRecentArticles = (limit: number) =>
  unstable_cache(
    async () =>
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true, title: true, slug: true, excerpt: true,
          views: true, createdAt: true,
          category: { select: { slug: true, name: true } },
        },
      }),
    ['recent-articles', String(limit)],
    { tags: [TAGS.articles] },
  )()

// Mais acessados na janela de N dias: ranking por views registradas.
// Cacheado por tag (articles) + revalidate de 1h como teto, já que a janela
// depende do tempo atual (a defasagem de 1h numa janela de dias é irrelevante).
export const getMostViewed = (windowDays: number, topLimit: number) =>
  unstable_cache(
    async () => {
      const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000)

      const grouped = await prisma.articleView.groupBy({
        by: ['articleId'],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
        orderBy: { _count: { articleId: 'desc' } },
        take: topLimit,
      })

      const articleIds = grouped.map((g) => g.articleId)
      const articles = articleIds.length
        ? await prisma.article.findMany({
            where: { id: { in: articleIds }, status: 'PUBLISHED' },
            select: {
              id: true, title: true, slug: true, excerpt: true,
              views: true, updatedAt: true,
              category: { select: { slug: true, name: true } },
            },
          })
        : []

      const articleMap = new Map(articles.map((a) => [a.id, a]))
      return grouped
        .map((g) => {
          const article = articleMap.get(g.articleId)
          if (!article) return null
          return { article, viewsInWindow: g._count._all }
        })
        .filter(
          (x): x is { article: (typeof articles)[number]; viewsInWindow: number } =>
            x !== null,
        )
    },
    ['most-viewed', String(windowDays), String(topLimit)],
    { tags: [TAGS.articles], revalidate: 3600 },
  )()
