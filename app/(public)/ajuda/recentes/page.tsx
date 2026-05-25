import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Topbar } from '@/components/public/Topbar'
import { Icon } from '@/components/public/Icon'

export const dynamic = 'force-dynamic'

const RECENT_LIMIT = 10

export const metadata: Metadata = {
  title: 'Recentes | RBCont',
}

function formatDate(d: Date | null): string {
  if (!d) return '—'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(d)
    .replace(/\./g, '')
}

export default async function RecentesPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: RECENT_LIMIT,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      views: true,
      createdAt: true,
      category: { select: { slug: true, name: true } },
    },
  })

  return (
    <>
      <Topbar crumbs={[{ label: 'Recentes' }]} />

      <div className="tc-page">
        <div className="tc-catHeader">
          <div className="tc-catHeader__iconBig">
            <Icon name="clock" size={26} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 className="tc-catHeader__title">Recentes</h1>
            <p className="tc-catHeader__desc">
              Os {RECENT_LIMIT} artigos mais recentes cadastrados na base.
            </p>
            <div className="tc-catHeader__meta">
              <span className="tc-catHeader__metaItem">
                <Icon name="file-text" size={12} strokeWidth={1.75} />
                {articles.length} {articles.length === 1 ? 'artigo' : 'artigos'}
              </span>
            </div>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="tc-artList">
            <div className="tc-artList__empty">
              Nenhum artigo publicado ainda.
            </div>
          </div>
        ) : (
          <div className="tc-artList">
            <div className="tc-artList__head">
              <span>Artigo</span>
              <span>Categoria</span>
              <span>Cadastrado em</span>
              <span></span>
            </div>
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/ajuda/${a.category.slug}/${a.slug}`}
                className="tc-artList__row"
              >
                <div>
                  <div className="tc-artList__title">{a.title}</div>
                  {a.excerpt && <div className="tc-artList__excerpt">{a.excerpt}</div>}
                </div>
                <span className="tc-artList__cell">{a.category.name}</span>
                <span className="tc-artList__cell">{formatDate(a.createdAt)}</span>
                <Icon name="chevron-right" size={14} strokeWidth={1.75} style={{ color: 'var(--ink-4)' }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
