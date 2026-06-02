'use client'

import { useEffect, useRef } from 'react'

interface Props {
  articleId: string
}

/**
 * Componente invisível que registra uma visualização ao montar.
 * Não bloqueia o SSR — é inserido dentro do Server Component pai.
 *
 * O ref evita o disparo duplicado do POST quando o efeito roda 2x na mesma
 * montagem (React Strict Mode em dev / re-render para o mesmo artigo).
 */
export default function ViewsTracker({ articleId }: Props) {
  const sentFor = useRef<string | null>(null)

  useEffect(() => {
    if (sentFor.current === articleId) return
    sentFor.current = articleId

    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId }),
    }).catch(() => {
      // Falha silenciosa — contagem de views não é crítica
    })
  }, [articleId])

  return null
}
