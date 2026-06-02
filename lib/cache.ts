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
