import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ajuda.rbcont.com.br'
const SITE_NAME = 'RBCont'
const SITE_DESCRIPTION =
  'Base de conhecimento RBCont — tutoriais, guias e respostas organizados por categoria.'

interface ArticleSeoInput {
  title: string
  slug: string
  excerpt?: string | null
}

interface CategorySeoInput {
  name: string
  slug: string
  description?: string | null
}

export function buildArticleMetadata(
  article: ArticleSeoInput,
  category: CategorySeoInput,
): Metadata {
  const title = `${article.title} | ${SITE_NAME}`
  const description = article.excerpt ?? undefined
  const canonical = `${SITE_URL}/ajuda/${category.slug}/${article.slug}`

  return {
    title,
    description,
    alternates: { canonical },
  }
}

export function buildCategoryMetadata(category: CategorySeoInput): Metadata {
  const title = `${category.name} | ${SITE_NAME}`
  const description = category.description ?? undefined
  const canonical = `${SITE_URL}/ajuda/${category.slug}`

  return {
    title,
    description,
    alternates: { canonical },
  }
}

export function buildHubMetadata(): Metadata {
  const title = `Central de Ajuda | ${SITE_NAME}`
  const canonical = `${SITE_URL}/ajuda`

  return {
    title,
    description: SITE_DESCRIPTION,
    alternates: { canonical },
  }
}
