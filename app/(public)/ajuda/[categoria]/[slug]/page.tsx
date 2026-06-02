import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { TAGS } from '@/lib/cache'
import { Topbar } from '@/components/public/Topbar'
import ViewsTracker from '@/components/public/ViewsTracker'
import FeedbackWidget from '@/components/public/FeedbackWidget'
import { FavoriteButton } from '@/components/public/FavoriteButton'
import { VideoEmbed } from '@/components/public/VideoEmbed'
import { buildArticleMetadata } from '@/lib/seo'
import { addHeadingIds } from '@/lib/htmlUtils'

interface Props {
  params: { categoria: string; slug: string }
}

function formatDate(d: Date | string | null): string {
  if (!d) return '—'
  // unstable_cache serializa Date -> string; reconverte para evitar "Invalid time value".
  const date = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(date)
    .replace(/\./g, '')
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

// Conteúdo do artigo (igual para todos): cacheado on-demand por tag `articles`.
// O React.cache externo de-duplica a chamada dentro da mesma requisição
// (generateMetadata + ArticlePage), e o unstable_cache evita ir ao banco entre
// requisições até o admin editar/publicar um artigo.
const getArticle = cache((categoria: string, slug: string) =>
  unstable_cache(
    () =>
      prisma.article.findFirst({
        where: { slug, status: 'PUBLISHED', category: { slug: categoria } },
        include: {
          category: true,
          author: { select: { name: true } },
        },
      }),
    ['article', categoria, slug],
    { tags: [TAGS.articles] },
  )(),
)

// Artigos relacionados (conteúdo compartilhado) — também cacheado por tag.
const getRelated = (categoryId: string, excludeId: string) =>
  unstable_cache(
    () =>
      prisma.article.findMany({
        where: { categoryId, status: 'PUBLISHED', id: { not: excludeId } },
        orderBy: { views: 'desc' },
        take: 5,
        select: { id: true, title: true, slug: true, category: { select: { slug: true } } },
      }),
    ['related', categoryId, excludeId],
    { tags: [TAGS.articles] },
  )()

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.categoria, params.slug)
  if (!article) return { title: 'Artigo não encontrado | RBCont' }
  return buildArticleMetadata(article, article.category)
}

export default async function ArticlePage({ params }: Props) {
  const session = await auth()
  const article = await getArticle(params.categoria, params.slug)
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

  const related = await getRelated(article.categoryId, article.id)

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
