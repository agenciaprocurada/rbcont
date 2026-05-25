import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { Topbar } from '@/components/public/Topbar'
import { Icon } from '@/components/public/Icon'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Meus favoritos | RBCont',
}

function formatDate(d: Date | null): string {
  if (!d) return '—'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(d)
    .replace(/\./g, '')
}

export default async function FavoritesPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      article: {
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          views: true,
          updatedAt: true,
          status: true,
          category: { select: { slug: true, name: true } },
        },
      },
    },
  })

  const visible = favorites.filter((f) => f.article.status === 'PUBLISHED')

  return (
    <>
      <Topbar crumbs={[{ label: 'Meus favoritos' }]} />

      <div className="tc-page">
        <div className="tc-catHeader">
          <div className="tc-catHeader__iconBig">
            <Icon name="bookmark" size={26} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 className="tc-catHeader__title">Meus favoritos</h1>
            <p className="tc-catHeader__desc">
              Artigos que você salvou para consulta rápida.
            </p>
            <div className="tc-catHeader__meta">
              <span className="tc-catHeader__metaItem">
                <Icon name="file-text" size={12} strokeWidth={1.75} />
                {visible.length} {visible.length === 1 ? 'artigo salvo' : 'artigos salvos'}
              </span>
            </div>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="tc-artList">
            <div className="tc-artList__empty">
              Você ainda não favoritou nenhum artigo. Use o botão{' '}
              <strong>Salvar</strong> no topo de um artigo para guardá-lo aqui.
            </div>
          </div>
        ) : (
          <div className="tc-artList">
            <div className="tc-artList__head">
              <span>Artigo</span>
              <span>Favoritado em</span>
              <span>Views</span>
              <span></span>
            </div>
            {visible.map((f) => (
              <Link
                key={f.id}
                href={`/ajuda/${f.article.category.slug}/${f.article.slug}`}
                className="tc-artList__row"
              >
                <div>
                  <div className="tc-artList__title">{f.article.title}</div>
                  {f.article.excerpt && (
                    <div className="tc-artList__excerpt">{f.article.excerpt}</div>
                  )}
                </div>
                <span className="tc-artList__cell">{formatDate(f.createdAt)}</span>
                <span className="tc-artList__cell">
                  <Icon name="eye" size={11} strokeWidth={1.75} style={{ display: 'inline', verticalAlign: -1, marginRight: 3 }} />
                  {f.article.views.toLocaleString('pt-BR')}
                </span>
                <Icon name="chevron-right" size={14} strokeWidth={1.75} style={{ color: 'var(--ink-4)' }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
