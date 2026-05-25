'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { logFailedSearch } from '@/app/actions/search-activity'
import { normalizeSearchQuery } from '@/lib/searchNormalize'

type Suggestion = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  categorySlug: string
  categoryName: string
}

interface Props {
  initialQuery?: string
}

const DEBOUNCE_MS = 250
const SESSION_KEY = 'tc:loggedFailedSearches'

function alreadyLoggedThisSession(normalizedQ: string): boolean {
  if (typeof window === 'undefined') return true
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    const list: string[] = raw ? JSON.parse(raw) : []
    return list.includes(normalizedQ)
  } catch {
    return false
  }
}

function markLoggedThisSession(normalizedQ: string) {
  if (typeof window === 'undefined') return
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    const list: string[] = raw ? JSON.parse(raw) : []
    if (!list.includes(normalizedQ)) {
      list.push(normalizedQ)
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(list))
    }
  } catch {
    /* noop */
  }
}

export function SearchAutocomplete({ initialQuery = '' }: Props) {
  const router = useRouter()
  const [q, setQ] = useState(initialQuery)
  const [results, setResults] = useState<Suggestion[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Snapshot do que tentamos por último (query + resultsCount no momento do fetch)
  // Usado para logar buscas sem resultado quando o usuário "termina a tentativa"
  const pendingFailedRef = useRef<string | null>(null)

  function maybeLogPending() {
    const pending = pendingFailedRef.current
    if (!pending) return
    const norm = normalizeSearchQuery(pending)
    if (!norm) return
    if (alreadyLoggedThisSession(norm)) return
    markLoggedThisSession(norm)
    // fire-and-forget
    logFailedSearch(pending).catch(() => {
      /* ignora erro de log para não atrapalhar UX */
    })
    pendingFailedRef.current = null
  }

  const fetchSuggestions = useCallback(async (term: string) => {
    const trimmed = term.trim()
    if (trimmed.length < 2) {
      setResults(null)
      setLoading(false)
      pendingFailedRef.current = null
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search-suggest?q=${encodeURIComponent(trimmed)}`, {
        cache: 'no-store',
      })
      if (!res.ok) {
        setResults([])
        return
      }
      const data = (await res.json()) as { results: Suggestion[] }
      setResults(data.results)
      // Atualiza snapshot da "tentativa atual": se voltou vazio, marca como pendente de log
      pendingFailedRef.current = data.results.length === 0 ? trimmed : null
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.trim().length < 2) {
      setResults(null)
      setLoading(false)
      pendingFailedRef.current = null
      return
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(q), DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [q, fetchSuggestions])

  // Clique fora fecha o dropdown — e isso é "fim da tentativa"
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        if (open) {
          maybeLogPending()
          setOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newQ = e.target.value
    // Se o usuário apagou tudo (ou esvaziou drasticamente) e havia uma tentativa
    // sem resultado pendente, considera "fim da tentativa anterior" e loga
    if (newQ.trim().length === 0 && pendingFailedRef.current) {
      maybeLogPending()
    }
    setQ(newQ)
    setActiveIdx(-1)
    setOpen(true)
  }

  function navigateToResults(term: string) {
    const trimmed = term.trim()
    if (trimmed.length < 2) return
    // Se a tentativa atual era sem resultado, loga antes de navegar
    if (
      pendingFailedRef.current &&
      pendingFailedRef.current.trim() === trimmed
    ) {
      maybeLogPending()
    }
    setOpen(false)
    router.push(`/ajuda/busca?q=${encodeURIComponent(trimmed)}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min((results?.length ?? 0) - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(-1, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results && activeIdx >= 0 && activeIdx < results.length) {
        const r = results[activeIdx]
        setOpen(false)
        router.push(`/ajuda/${r.categorySlug}/${r.slug}`)
        return
      }
      navigateToResults(q)
    } else if (e.key === 'Escape') {
      maybeLogPending()
      setOpen(false)
    }
  }

  function handleClickResult() {
    // Clicou num resultado existente — não loga (foi sucesso)
    pendingFailedRef.current = null
    setOpen(false)
  }

  function handleFocus() {
    if (q.trim().length >= 2) setOpen(true)
  }

  const showDropdown = open && q.trim().length >= 2
  const hasResults = !!results && results.length > 0
  const showEmpty = open && !loading && results !== null && results.length === 0

  return (
    <div ref={containerRef} className="tc-search-ac" style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div className="tc-topbar__search" style={{ width: '100%' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          ref={inputRef}
          className="tc-topbar__searchInput"
          placeholder="Buscar artigo, categoria, tag..."
          value={q}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="tc-search-ac-list"
        />
        {loading && (
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>buscando…</span>
        )}
      </div>

      {showDropdown && (
        <div
          id="tc-search-ac-list"
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: 'var(--surface, #fff)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: 10,
            boxShadow: '0 12px 32px rgba(0,0,0,0.10)',
            zIndex: 100,
            overflow: 'hidden',
            maxHeight: 460,
            overflowY: 'auto',
          }}
        >
          {hasResults && (
            <>
              {results!.map((r, i) => {
                const active = i === activeIdx
                return (
                  <Link
                    key={r.id}
                    href={`/ajuda/${r.categorySlug}/${r.slug}`}
                    onClick={handleClickResult}
                    onMouseEnter={() => setActiveIdx(i)}
                    style={{
                      display: 'block',
                      padding: '12px 14px',
                      textDecoration: 'none',
                      color: 'var(--ink, #111)',
                      background: active ? 'var(--surface-2, #f5f5f7)' : 'transparent',
                      borderBottom:
                        i < results!.length - 1
                          ? '1px solid var(--border, #f0f0f0)'
                          : 'none',
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{r.title}</div>
                    {r.excerpt && (
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--ink-3, #6b7280)',
                          marginTop: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {r.excerpt}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--ink-4, #9ca3af)',
                        marginTop: 4,
                        fontWeight: 600,
                      }}
                    >
                      {r.categoryName}
                    </div>
                  </Link>
                )
              })}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  navigateToResults(q)
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 14px',
                  background: 'var(--surface-2, #fafafa)',
                  border: 'none',
                  borderTop: '1px solid var(--border, #e5e7eb)',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: 'var(--ink-2, #4b5563)',
                  fontWeight: 600,
                }}
              >
                Ver todos os resultados para &ldquo;{q.trim()}&rdquo; →
              </button>
            </>
          )}

          {showEmpty && (
            <div style={{ padding: '20px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--ink-2, #4b5563)', fontWeight: 600 }}>
                Nenhum artigo encontrado para &ldquo;{q.trim()}&rdquo;
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3, #6b7280)', marginTop: 4 }}>
                Tente outros termos ou aperte Enter para ver a busca completa.
              </div>
            </div>
          )}

          {loading && !results && (
            <div style={{ padding: '14px', fontSize: 13, color: 'var(--ink-3, #6b7280)' }}>
              Buscando…
            </div>
          )}
        </div>
      )}
    </div>
  )
}
