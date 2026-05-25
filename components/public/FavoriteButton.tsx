'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/public/Icon'

interface Props {
  articleId: string
  initialFavorited: boolean
}

export function FavoriteButton({ articleId, initialFavorited }: Props) {
  const router = useRouter()
  const [favorited, setFavorited] = useState(initialFavorited)
  const [busy, setBusy] = useState(false)

  async function handleClick() {
    if (busy) return
    setBusy(true)
    const next = !favorited
    setFavorited(next)
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId }),
      })
      if (!res.ok) throw new Error('falha ao favoritar')
      const data = (await res.json()) as { favorited: boolean }
      setFavorited(data.favorited)
      router.refresh()
    } catch {
      setFavorited(!next)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={`tc-favBtn ${favorited ? 'is-on' : ''}`}
      aria-pressed={favorited}
      title={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
    >
      <Icon name="bookmark" size={14} strokeWidth={favorited ? 2.2 : 1.8} />
      <span>{favorited ? 'Salvo' : 'Salvar'}</span>
    </button>
  )
}
