'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type { ArticleStatus, ArticleType } from '@prisma/client'

export async function saveArticle(data: {
  id?: string
  title: string
  slug: string
  type: ArticleType
  content: string
  excerpt: string
  videoUrl?: string | null
  status: ArticleStatus
  featured: boolean
  categoryId: string
  authorId: string
}) {
  const session = await auth()

  // Apenas EDITOR e SUPER_ADMIN podem criar/editar artigos.
  if (!session || (session.user.role !== 'EDITOR' && session.user.role !== 'SUPER_ADMIN')) {
    throw new Error('Não autorizado')
  }

  if (data.type === 'VIDEO' && !data.videoUrl?.trim()) {
    throw new Error('URL do vídeo é obrigatória para artigos do tipo VIDEO.')
  }

  const payload = {
    title: data.title,
    slug: data.slug,
    type: data.type,
    content: data.content,
    excerpt: data.excerpt,
    videoUrl: data.type === 'VIDEO' ? (data.videoUrl?.trim() || null) : null,
    status: data.status,
    featured: data.featured,
    categoryId: data.categoryId,
    ...(data.status === 'PUBLISHED' ? { publishedAt: new Date() } : {}),
  }

  let articleId: string

  if (data.id) {
    await prisma.article.update({ where: { id: data.id }, data: payload })
    articleId = data.id
  } else {
    const created = await prisma.article.create({
      data: { ...payload, authorId: data.authorId },
    })
    articleId = created.id
  }

  revalidatePath('/ajuda')
  revalidatePath('/admin/artigos')
  revalidatePath(`/ajuda/[categoria]`, 'page')
  revalidatePath(`/ajuda/[categoria]/[slug]`, 'page')

  return { success: true, articleId }
}

export async function deleteArticles(ids: string[]) {
  const session = await auth()
  if (!session || (session.user.role !== 'EDITOR' && session.user.role !== 'SUPER_ADMIN')) {
    throw new Error('Permissão negada.')
  }

  await prisma.article.deleteMany({ where: { id: { in: ids } } })

  revalidatePath('/admin/artigos')
  return { success: true }
}
