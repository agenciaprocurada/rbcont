import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { addHeadingIds } from '@/lib/htmlUtils'
import { auth } from '@/lib/auth'
import { VideoEmbed } from '@/components/public/VideoEmbed'

export const metadata: Metadata = {
  title: 'Visualização de Rascunho | RBCont Admin',
}

interface Props {
  params: { id: string }
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export default async function ArticlePreviewPage({ params }: Props) {
  const session = await auth()
  if (!session) return <div>Não autorizado</div>

  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  })
  if (!article) notFound()

  const readingTime = estimateReadingTime(article.content)
  const contentWithIds = addHeadingIds(article.content)

  return (
    <div>
      <div style={{
        backgroundColor: 'var(--rose)',
        color: '#fff',
        textAlign: 'center',
        padding: '10px 14px',
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)',
        marginBottom: 18,
        borderRadius: 8,
      }}>
        ⚠️ Modo de visualização — status atual: {article.status}
      </div>

      <Link
        href="/admin/artigos"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: 'var(--ink-3)',
          fontWeight: 600,
          padding: '6px 10px 6px 6px',
          borderRadius: 6,
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          textDecoration: 'none',
          marginBottom: 14,
        }}
      >
        ← Voltar aos artigos
      </Link>

      <div className="tc-artPage__main">
        <div className="tc-artPage__head">
          <div className="tc-artPage__metaRow">
            <span className="tc-artPage__catLink">{article.category.name}</span>
          </div>
          <h1 className="tc-artPage__title">{article.title}</h1>
          {article.excerpt && <p className="tc-artPage__desc">{article.excerpt}</p>}
          <div style={{ marginTop: 12, display: 'flex', gap: 14, fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
            <span>Por {article.author.name}</span>
            <span>{readingTime} min de leitura</span>
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
    </div>
  )
}
