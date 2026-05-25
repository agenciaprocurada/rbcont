'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  analyzeSearchActivities,
  type ContentSuggestion,
} from '@/app/actions/search-insights'

type RecentItem = {
  id: string
  query: string
  normalizedQ: string
  resultsCount: number
  createdAt: string
  user: { id: string; name: string; email: string }
}

type FailedGroup = {
  normalizedQ: string
  variants: string[]
  distinctUsers: number
  total: number
  lastSeen: string
}

type Stats = {
  totalAll: number
  totalFailed: number
  canAnalyze: boolean
  windowDays: number
}

type Props = {
  recent: RecentItem[]
  failedGroups: FailedGroup[]
  stats: Stats
}

type Tab = 'recent' | 'failed' | 'insights'

const prioridadeColor: Record<string, string> = {
  alta: '#dc2626',
  media: '#d97706',
  baixa: '#059669',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function SearchActivitiesClient({ recent, failedGroups, stats }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('failed')
  const [filterMode, setFilterMode] = useState<'all' | 'failed'>('all')

  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const [suggestions, setSuggestions] = useState<ContentSuggestion[] | null>(null)
  const [analysisMeta, setAnalysisMeta] = useState<{
    totalAnalyzed: number
  } | null>(null)

  const filteredRecent =
    filterMode === 'failed' ? recent.filter((r) => r.resultsCount === 0) : recent

  async function handleAnalyze() {
    setAnalyzing(true)
    setAnalysisError('')
    setSuggestions(null)
    setAnalysisMeta(null)
    try {
      const result = await analyzeSearchActivities()
      setSuggestions(result.suggestions)
      setAnalysisMeta({ totalAnalyzed: result.totalAnalyzed })
      setTab('insights')
    } catch (err: any) {
      setAnalysisError(err?.message ?? 'Falha na análise.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <>
      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <StatBox label={`Pesquisas (${stats.windowDays}d)`} value={stats.totalAll} />
        <StatBox label="Sem resultado" value={stats.totalFailed} accent="#dc2626" />
        <StatBox
          label="Pronto para análise"
          value={stats.canAnalyze ? stats.totalFailed : 0}
          accent="#0ea5e9"
          hint={stats.canAnalyze ? 'Volume mínimo atingido' : 'Mín. 3 buscas sem resultado'}
        />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <TabButton active={tab === 'failed'} onClick={() => setTab('failed')}>
          Sem resultado (agrupado)
        </TabButton>
        <TabButton active={tab === 'recent'} onClick={() => setTab('recent')}>
          Atividades recentes
        </TabButton>
        <TabButton active={tab === 'insights'} onClick={() => setTab('insights')}>
          Sugestões IA
        </TabButton>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="btn-primary"
            title={
              stats.canAnalyze
                ? 'Analisar pesquisas sem resultado com Gemini Flash (agrupamento semântico)'
                : 'Volume insuficiente (mín. 3 buscas sem resultado em 30d) — análise retornará vazia'
            }
            style={{ opacity: analyzing ? 0.6 : 1 }}
          >
            {analyzing ? 'Analisando…' : '✨ Analisar com IA'}
          </button>
          <button
            onClick={() => router.refresh()}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 13,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            ↻ Atualizar
          </button>
        </div>
      </div>

      {analysisError && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {analysisError}
        </div>
      )}

      {/* === FAILED GROUPS === */}
      {tab === 'failed' && (
        <div>
          {failedGroups.length === 0 ? (
            <EmptyState message={`Nenhuma pesquisa sem resultado nos últimos ${stats.windowDays} dias.`} />
          ) : (
            <div className="tc-artList" style={{ background: 'var(--surface)', borderRadius: 8, overflow: 'hidden' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
                  padding: '12px 16px',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-tertiary)',
                  fontWeight: 600,
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface-2, #fafafa)',
                }}
              >
                <span>Termo normalizado</span>
                <span>Variações</span>
                <span>Usuários</span>
                <span>Total</span>
                <span>Última vez</span>
              </div>
              {failedGroups.map((g) => {
                return (
                  <div
                    key={g.normalizedQ}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border)',
                      fontSize: 14,
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {g.normalizedQ}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--text-tertiary)',
                          marginTop: 4,
                        }}
                      >
                        {g.variants.slice(0, 4).map((v, i) => (
                          <span key={i}>
                            {i > 0 && ' · '}
                            <span style={{ background: 'var(--surface-2, #f3f4f6)', padding: '1px 6px', borderRadius: 4 }}>
                              {v}
                            </span>
                          </span>
                        ))}
                        {g.variants.length > 4 && <> · +{g.variants.length - 4}</>}
                      </div>
                    </div>
                    <span>{g.variants.length}</span>
                    <span>{g.distinctUsers}</span>
                    <span style={{ fontWeight: 600 }}>{g.total}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{formatDate(g.lastSeen)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* === RECENT === */}
      {tab === 'recent' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => setFilterMode('all')}
              style={chipStyle(filterMode === 'all')}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterMode('failed')}
              style={chipStyle(filterMode === 'failed')}
            >
              Sem resultado
            </button>
          </div>

          {filteredRecent.length === 0 ? (
            <EmptyState message="Nenhuma atividade encontrada." />
          ) : (
            <div style={{ background: 'var(--surface)', borderRadius: 8, overflow: 'hidden' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1.5fr 1fr',
                  padding: '12px 16px',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-tertiary)',
                  fontWeight: 600,
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface-2, #fafafa)',
                }}
              >
                <span>Pesquisa</span>
                <span>Resultados</span>
                <span>Usuário</span>
                <span>Data</span>
              </div>
              {filteredRecent.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1.5fr 1fr',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)',
                    fontSize: 14,
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{r.query}</div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-tertiary)',
                        fontFamily: 'monospace',
                        marginTop: 2,
                      }}
                    >
                      {r.normalizedQ}
                    </div>
                  </div>
                  <span
                    style={{
                      color: r.resultsCount === 0 ? '#dc2626' : 'var(--text-primary)',
                      fontWeight: r.resultsCount === 0 ? 600 : 400,
                    }}
                  >
                    {r.resultsCount}
                  </span>
                  <div>
                    <div style={{ fontSize: 13 }}>{r.user.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{r.user.email}</div>
                  </div>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{formatDate(r.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === INSIGHTS === */}
      {tab === 'insights' && (
        <div>
          {!suggestions && !analyzing && (
            <EmptyState
              message='Clique em "Analisar com IA" para gerar sugestões baseadas nas pesquisas sem resultado.'
            />
          )}

          {analyzing && <EmptyState message="Analisando pesquisas com Gemini Flash…" />}

          {suggestions && (
            <>
              {analysisMeta && (
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-tertiary)',
                    marginBottom: 16,
                    padding: '10px 14px',
                    background: 'var(--surface-2, #f9fafb)',
                    borderRadius: 6,
                  }}
                >
                  {analysisMeta.totalAnalyzed} pesquisa(s) sem resultado analisada(s) pelo Gemini com agrupamento semântico
                </div>
              )}

              {suggestions.length === 0 ? (
                <EmptyState
                  message={
                    analysisMeta && analysisMeta.totalAnalyzed < 3
                      ? `Volume insuficiente: apenas ${analysisMeta.totalAnalyzed} pesquisa(s) sem resultado nos últimos 30 dias (mínimo: 3).`
                      : 'A IA analisou as pesquisas mas não encontrou tema(s) com intenção clara e recorrente para sugerir conteúdo.'
                  }
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {suggestions.map((s, i) => (
                    <SuggestionCard key={i} suggestion={s} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

function SuggestionCard({ suggestion }: { suggestion: ContentSuggestion }) {
  const color = prioridadeColor[suggestion.prioridade] ?? '#64748b'
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: `4px solid ${color}`,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Prioridade {suggestion.prioridade}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            {suggestion.tema}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '8px 0 0' }}>
            {suggestion.intencaoDoUsuario}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-tertiary)',
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Evidência (termos buscados)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {suggestion.evidencia.map((e, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                background: 'var(--surface-2, #f3f4f6)',
                padding: '2px 8px',
                borderRadius: 4,
                fontFamily: 'monospace',
              }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          padding: 12,
          background: 'var(--surface-2, #f9fafb)',
          borderRadius: 6,
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-tertiary)',
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          Sugestão de artigo
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
          {suggestion.sugestaoDeArtigo.titulo}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          {suggestion.sugestaoDeArtigo.excerpt}
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)' }}>
          {suggestion.sugestaoDeArtigo.topicos.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function StatBox({
  label,
  value,
  accent,
  hint,
}: {
  label: string
  value: number
  accent?: string
  hint?: string
}) {
  return (
    <div
      style={{
        padding: 16,
        background: 'var(--surface)',
        borderRadius: 8,
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-tertiary)',
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: accent ?? 'var(--text-primary)',
          marginTop: 4,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
      {hint && (
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{hint}</div>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: 'none',
        padding: '10px 14px',
        fontSize: 14,
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--color-primary)' : 'var(--text-secondary)',
        borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
        cursor: 'pointer',
        marginBottom: -1,
      }}
    >
      {children}
    </button>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: 40,
        textAlign: 'center',
        color: 'var(--text-tertiary)',
        background: 'var(--surface)',
        borderRadius: 8,
        border: '1px dashed var(--border)',
      }}
    >
      {message}
    </div>
  )
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: '6px 12px',
    fontSize: 13,
    borderRadius: 999,
    border: '1px solid var(--border)',
    background: active ? 'var(--color-primary)' : 'transparent',
    color: active ? '#fff' : 'var(--text-secondary)',
    cursor: 'pointer',
    fontWeight: active ? 600 : 400,
  }
}
