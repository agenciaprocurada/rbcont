import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const articleId = body?.articleId as string | undefined

  if (!articleId || typeof articleId !== 'string') {
    return NextResponse.json({ error: 'articleId inválido' }, { status: 400 })
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, status: true },
  })
  if (!article || article.status !== 'PUBLISHED') {
    return NextResponse.json({ error: 'Artigo não disponível' }, { status: 404 })
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_articleId: { userId: session.user.id, articleId } },
    select: { id: true },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
    return NextResponse.json({ favorited: false })
  }

  await prisma.favorite.create({
    data: { userId: session.user.id, articleId },
  })
  return NextResponse.json({ favorited: true })
}
