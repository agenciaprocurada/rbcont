import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Topbar } from '@/components/public/Topbar'
import { Icon } from '@/components/public/Icon'
import { iconForSlug } from '@/lib/categoryIcon'
import { buildHubMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildHubMetadata()
}

function formatDate(d: Date | null): string {
  if (!d) return ''
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(d)
    .replace(/\./g, '')
}

export default async function HubPage() {
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

  const activeCats = categories.filter((c) => c._count.articles > 0).length

  return (
    <>
      <Topbar />

      <div className="tc-page">
        <div className="tc-hero">
          <div className="tc-hero__blob" />
          <div className="tc-hero__inner">
            <div className="tc-hero__eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
              </svg>
              Base de conhecimento · v3.2
            </div>
            <h1 className="tc-hero__title">Como podemos<br />ajudar você hoje?</h1>
            <p className="tc-hero__desc">
              Base de conhecimento RBCont. Use a busca no topo para encontrar
              tutoriais, guias e respostas, ou navegue pelas categorias abaixo.
            </p>
          </div>
          <div className="tc-hero__stats">
            <div className="tc-hero__stat">
              <div className="tc-hero__statVal">{totalArticles}</div>
              <div className="tc-hero__statLbl">Artigos publicados</div>
            </div>
            <div className="tc-hero__stat">
              <div className="tc-hero__statVal">{activeCats}</div>
              <div className="tc-hero__statLbl">Categorias ativas</div>
            </div>
            <div className="tc-hero__stat">
              <div className="tc-hero__statVal">{totalUpdated7d}</div>
              <div className="tc-hero__statLbl">Atualizados esta semana</div>
            </div>
          </div>
        </div>

        {trending.length > 0 && (
          <>
            <div className="tc-sectionH">
              <div className="tc-sectionTitle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2s4 3 4 7c0 2-1 3-2 3.5 0 0 1-2-1-4 0 0 0 4-3 5.5-2 1-3 2.5-3 4.5 0 3 3 4.5 5 4.5s5-1.5 5-5c0-3-3-5-3-7" />
                </svg>
                Mais pesquisados
              </div>
            </div>

            <div className="tc-hotList">
              {trending.map((a, i) => {
                const level = i === 0 ? 'hot' : i < 3 ? 'rising' : 'normal'
                return (
                  <Link
                    key={a.id}
                    href={`/ajuda/${a.category.slug}/${a.slug}`}
                    className="tc-hotRow"
                  >
                    <span className={`tc-hotRank ${i < 3 ? 'is-top' : ''}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="tc-hotTitle">{a.title}</div>
                      <div className="tc-hotMeta">
                        <span>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: -1, marginRight: 3 }}>
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          {a.views.toLocaleString('pt-BR')}
                        </span>
                        <span className="mono" style={{ color: 'var(--ink-4)' }}>
                          upd {formatDate(a.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <span className={`tc-pop ${level}`}>
                      {level === 'hot' && 'Hot'}
                      {level === 'rising' && 'Em alta'}
                      {level === 'normal' && 'Estável'}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        <div className="tc-sectionH">
          <div className="tc-sectionTitle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple-600)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            Categorias
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="tc-searchEmpty">
            <p className="tc-searchEmpty__title">Nenhuma categoria ativa ainda.</p>
            <p className="tc-searchEmpty__text">Peça para um admin cadastrar categorias.</p>
          </div>
        ) : (
          <div className="tc-catGrid">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/ajuda/${cat.slug}`} className="tc-catCard">
                <div className="tc-catCard__head">
                  <div className="tc-catCard__iconBox">
                    <Icon name={iconForSlug(cat.slug)} size={18} strokeWidth={1.9} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="tc-catCard__name">{cat.name}</div>
                    <div className="tc-catCard__count">
                      {cat._count.articles} {cat._count.articles === 1 ? 'artigo' : 'artigos'}
                    </div>
                  </div>
                </div>
                {cat.description && <p className="tc-catCard__desc">{cat.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
