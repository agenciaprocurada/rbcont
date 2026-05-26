'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Barra de progresso topo. Aparece instantaneamente ao clicar em qualquer
 * link interno (preenche o gap entre o clique e o loading.tsx renderizar,
 * que pode demorar enquanto layouts/server-components aguardam dados).
 * Some quando o pathname ou query muda.
 */
export function NavProgress() {
  const pathname = usePathname()
  const search = useSearchParams()
  const [visible, setVisible] = useState(false)

  // Esconde sempre que o path/query muda (navegação concluída).
  useEffect(() => {
    setVisible(false)
  }, [pathname, search])

  // Detecta clique em links internos.
  useEffect(() => {
    function onClick(ev: MouseEvent) {
      // Ignora cliques com modificadores (abrir em nova aba, etc.).
      if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return
      const a = (ev.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null
      if (!a || !a.href) return
      if (a.target && a.target !== '' && a.target !== '_self') return
      if (a.hasAttribute('download')) return
      // Apenas mesma origem.
      try {
        const url = new URL(a.href)
        if (url.origin !== location.origin) return
        // Hash na mesma página = não dispara nav.
        if (url.pathname === location.pathname && url.search === location.search && url.hash) return
      } catch {
        return
      }
      setVisible(true)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: visible ? 'none' : 'opacity 0.2s ease-out 0.05s',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          background:
            'linear-gradient(90deg, transparent 0%, var(--color-accent, #b5793f) 50%, transparent 100%)',
          backgroundSize: '40% 100%',
          backgroundRepeat: 'no-repeat',
          animation: visible ? 'rb-navprog-slide 1.1s linear infinite' : 'none',
        }}
      />
      <style>{`
        @keyframes rb-navprog-slide {
          0%   { background-position: -40% 0; }
          100% { background-position: 140% 0; }
        }
      `}</style>
    </div>
  )
}
