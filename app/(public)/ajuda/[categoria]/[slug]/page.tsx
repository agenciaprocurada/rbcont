import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { Topbar } from '@/components/public/Topbar'
import ViewsTracker from '@/components/public/ViewsTracker'
import FeedbackWidget from '@/components/public/FeedbackWidget'
import { FavoriteButton } from '@/components/public/FavoriteButton'
import { VideoEmbed } from '@/components/public/VideoEmbed'
import { buildArticleMetadata } from '@/lib/seo'
import { addHeadingIds } from '@/lib/htmlUtils'

export const dynamic = 'force-dynamic'

interface Props {
  params: { categoria: string; slug: string }
}

function formatDate(d: Date | null): string {
  if (!d) return '—'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(d)
    .replace(/\./g, '')
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.article.findFirst({
    where: { slug: params.slug, status: 'PUBLISHED', category: { slug: params.categoria } },
    include: { category: true },
  })
  if (!article) return { title: 'Artigo não encontrado | RBCont' }
  return buildArticleMetadata(article, article.category)
}

export default async function ArticlePage({ params }: Props) {
  const session = await auth()
  const article = await prisma.article.findFirst({
    where: { slug: params.slug, status: 'PUBLISHED', category: { slug: params.categoria } },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  })
  if (!article) notFound()

  const isFavorited = session
    ? Boolean(
        await prisma.favorite.findUnique({
          where: { userId_articleId: { userId: session.user.id, articleId: article.id } },
          select: { id: true },
        }),
      )
    : false

  const readingTime = estimateReadingTime(article.content)
  const contentWithIds = addHeadingIds(article.content)

  const related = await prisma.article.findMany({
    where: { categoryId: article.categoryId, status: 'PUBLISHED', id: { not: article.id } },
    orderBy: { views: 'desc' },
    take: 5,
    select: { id: true, title: true, slug: true, category: { select: { slug: true } } },
  })

  return (
    <>
      <Topbar
        crumbs={[
          { label: article.category.name, href: `/ajuda/${article.category.slug}` },
          { label: article.title },
        ]}
      />

      <ViewsTracker articleId={article.id} />

      <div className="tc-artPage">
        <Link href={`/ajuda/${article.category.slug}`} className="tc-back">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m11 6-6 6 6 6" />
          </svg>
          Voltar à categoria
        </Link>

        <div className="tc-artPage__grid">
          <div className="tc-artPage__main">
            <div className="tc-artPage__head">
              <div className="tc-artPage__headRow">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="tc-artPage__metaRow">
                    <Link href={`/ajuda/${article.category.slug}`} className="tc-artPage__catLink">
                      {article.category.name}
                    </Link>
                  </div>
                  <h1 className="tc-artPage__title">{article.title}</h1>
                  {article.excerpt && <p className="tc-artPage__desc">{article.excerpt}</p>}
                </div>
                <FavoriteButton articleId={article.id} initialFavorited={isFavorited} />
              </div>
            </div>

            {article.type === 'VIDEO' ? (
              <>
                {article.videoUrl && <VideoEmbed url={article.videoUrl} />}
                {article.content && (
                  <div
                    className="tc-artPage__body"
                    style={{ marginTop: 18 }}
                    dangerouslySetInnerHTML={{ __html: contentWithIds }}
                  />
                )}
              </>
            ) : (
              <div
                className="tc-artPage__body"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />
            )}
          </div>

          <aside className="tc-artPage__side">
            <div className="tc-artPage__sideCard">
              <div className="tc-artPage__sideLabel">Detalhes</div>
              <div className="tc-artPage__metaList">
                <span className="tc-artPage__metaKey">Tempo</span>
                <span className="tc-artPage__metaVal">{readingTime} min</span>
                <span className="tc-artPage__metaKey">Views</span>
                <span className="tc-artPage__metaVal">{article.views.toLocaleString('pt-BR')}</span>
                <span className="tc-artPage__metaKey">Atualizado</span>
                <span className="tc-artPage__metaVal">{formatDate(article.updatedAt)}</span>
                <span className="tc-artPage__metaKey">Autor</span>
                <span className="tc-artPage__metaVal" style={{ fontFamily: 'inherit', textTransform: 'none', letterSpacing: 0 }}>{article.author.name}</span>
              </div>
            </div>

            {related.length > 0 && (
              <div className="tc-artPage__sideCard">
                <div className="tc-artPage__sideLabel">Artigos relacionados</div>
                <div className="tc-artPage__related">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/ajuda/${r.category.slug}/${r.slug}`}
                      className="tc-artPage__relatedItem"
                    >
                      {r.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="tc-artPage__sideCard tc-artPage__feedbackBox">
              <div className="tc-artPage__sideLabel">Esse artigo resolveu?</div>
              <FeedbackWidget articleId={article.id} />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
