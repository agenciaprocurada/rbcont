import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Topbar } from '@/components/public/Topbar'
import { Icon } from '@/components/public/Icon'
import { iconForSlug } from '@/lib/categoryIcon'
import { buildCategoryMetadata } from '@/lib/seo'
import { getCategoryPage } from '@/lib/cache'

const ARTICLES_PER_PAGE = 20

interface Props {
  params: { categoria: string }
  searchParams: { page?: string }
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.categoria } })
  if (!category) return { title: 'Categoria não encontrada | RBCont' }
  return buildCategoryMetadata(category)
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page ?? 1))

  const data = await getCategoryPage(params.categoria, page, ARTICLES_PER_PAGE)
  if (!data) notFound()

  const { category, articles, total } = data
  const totalPages = Math.ceil(total / ARTICLES_PER_PAGE)

  return (
    <>
      <Topbar
        crumbs={[
          { label: category.name },
        ]}
      />

      <div className="tc-page">
        <div className="tc-catHeader">
          <div className="tc-catHeader__iconBig">
            <Icon name={iconForSlug(category.slug)} size={26} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 className="tc-catHeader__title">{category.name}</h1>
            {category.description && <p className="tc-catHeader__desc">{category.description}</p>}
            <div className="tc-catHeader__meta">
              <span className="tc-catHeader__metaItem">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                {total} {total === 1 ? 'artigo publicado' : 'artigos publicados'}
              </span>
              <span className="tc-catHeader__metaItem mono">slug: /{category.slug}</span>
            </div>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="tc-artList">
            <div className="tc-artList__empty">Nenhum artigo publicado nesta categoria ainda.</div>
          </div>
        ) : (
          <div className="tc-artList">
            <div className="tc-artList__head">
              <span>Artigo</span>
              <span>Atualizado</span>
              <span>Views</span>
              <span></span>
            </div>
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/ajuda/${category.slug}/${a.slug}`}
                className="tc-artList__row"
              >
                <div>
                  <div className="tc-artList__title">{a.title}</div>
                  {a.excerpt && <div className="tc-artList__excerpt">{a.excerpt}</div>}
                </div>
                <span className="tc-artList__cell">{formatDate(a.updatedAt)}</span>
                <span className="tc-artList__cell">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -1, marginRight: 3 }}>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {a.views.toLocaleString('pt-BR')}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="tc-pagination" aria-label="Paginação">
            {page > 1 ? (
              <Link href={`/ajuda/${params.categoria}?page=${page - 1}`} className="tc-pagination__link">
                ← Anterior
              </Link>
            ) : (
              <span className="tc-pagination__link is-disabled">← Anterior</span>
            )}
            <span className="tc-pagination__info">
              Página {page} de {totalPages}
            </span>
            {page < totalPages ? (
              <Link href={`/ajuda/${params.categoria}?page=${page + 1}`} className="tc-pagination__link">
                Próxima →
              </Link>
            ) : (
              <span className="tc-pagination__link is-disabled">Próxima →</span>
            )}
          </nav>
        )}
      </div>
    </>
  )
}
