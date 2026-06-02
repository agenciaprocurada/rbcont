import Link from 'next/link'
import type { Metadata } from 'next'
import { Topbar } from '@/components/public/Topbar'
import { Icon } from '@/components/public/Icon'
import { getMostViewed } from '@/lib/cache'

const WINDOW_DAYS = 7
const TOP_LIMIT = 30

export const metadata: Metadata = {
  title: 'Mais acessados | RBCont',
}

function formatDate(d: Date | string | null): string {
  if (!d) return '—'
  const date = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(date)
    .replace(/\./g, '')
}

export default async function MaisAcessadosPage() {
  const ranked = await getMostViewed(WINDOW_DAYS, TOP_LIMIT)

  return (
    <>
      <Topbar crumbs={[{ label: 'Mais acessados' }]} />

      <div className="tc-page">
        <div className="tc-catHeader">
          <div className="tc-catHeader__iconBig">
            <Icon name="trending-up" size={26} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 className="tc-catHeader__title">Mais acessados</h1>
            <p className="tc-catHeader__desc">
              Artigos com mais visualizações nos últimos {WINDOW_DAYS} dias.
            </p>
            <div className="tc-catHeader__meta">
              <span className="tc-catHeader__metaItem">
                <Icon name="clock" size={12} strokeWidth={1.75} />
                Janela: {WINDOW_DAYS}d
              </span>
              <span className="tc-catHeader__metaItem">
                <Icon name="file-text" size={12} strokeWidth={1.75} />
                {ranked.length} {ranked.length === 1 ? 'artigo' : 'artigos'}
              </span>
            </div>
          </div>
        </div>

        {ranked.length === 0 ? (
          <div className="tc-artList">
            <div className="tc-artList__empty">
              Nenhum artigo visualizado nos últimos {WINDOW_DAYS} dias ainda.
            </div>
          </div>
        ) : (
          <div className="tc-artList">
            <div className="tc-artList__head">
              <span>Artigo</span>
              <span>Categoria</span>
              <span>Views ({WINDOW_DAYS}d)</span>
              <span></span>
            </div>
            {ranked.map((r, i) => (
              <Link
                key={r.article.id}
                href={`/ajuda/${r.article.category.slug}/${r.article.slug}`}
                className="tc-artList__row"
              >
                <div>
                  <div className="tc-artList__title">
                    <span className="tc-rank">{String(i + 1).padStart(2, '0')}</span>
                    {r.article.title}
                  </div>
                  {r.article.excerpt && (
                    <div className="tc-artList__excerpt">{r.article.excerpt}</div>
                  )}
                </div>
                <span className="tc-artList__cell">{r.article.category.name}</span>
                <span className="tc-artList__cell">
                  <Icon name="eye" size={11} strokeWidth={1.75} style={{ display: 'inline', verticalAlign: -1, marginRight: 3 }} />
                  {r.viewsInWindow.toLocaleString('pt-BR')}
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
