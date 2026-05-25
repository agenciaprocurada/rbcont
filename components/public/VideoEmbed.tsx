interface Props {
  url: string
}

function extractEmbed(url: string): { src: string; provider: 'youtube' | 'vimeo' | 'unknown' } | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    // YouTube
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1)
      if (id) return { src: `https://www.youtube.com/embed/${id}`, provider: 'youtube' }
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname === '/watch') {
        const id = u.searchParams.get('v')
        if (id) return { src: `https://www.youtube.com/embed/${id}`, provider: 'youtube' }
      }
      if (u.pathname.startsWith('/embed/')) {
        return { src: url, provider: 'youtube' }
      }
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/')[2]
        if (id) return { src: `https://www.youtube.com/embed/${id}`, provider: 'youtube' }
      }
    }

    // Vimeo
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (id && /^\d+$/.test(id)) {
        return { src: `https://player.vimeo.com/video/${id}`, provider: 'vimeo' }
      }
    }
    if (host === 'player.vimeo.com') {
      return { src: url, provider: 'vimeo' }
    }

    return { src: url, provider: 'unknown' }
  } catch {
    return null
  }
}

export function VideoEmbed({ url }: Props) {
  const embed = extractEmbed(url)
  if (!embed) {
    return (
      <div style={{ padding: 16, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 9, fontSize: 13, color: 'var(--ink-3)' }}>
        URL de vídeo inválida: <span className="mono">{url}</span>
      </div>
    )
  }

  return (
    <div style={{
      position: 'relative',
      paddingBottom: '56.25%', // 16:9
      height: 0,
      overflow: 'hidden',
      borderRadius: 12,
      background: '#000',
    }}>
      <iframe
        src={embed.src}
        title="Vídeo"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          border: 0,
        }}
      />
    </div>
  )
}
