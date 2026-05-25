import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: 24,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{
          fontSize: 88,
          fontWeight: 800,
          color: 'var(--purple-700)',
          lineHeight: 1,
          marginBottom: 12,
          fontFamily: 'var(--font-mono)',
        }}>
          404
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
          Página não encontrada
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', margin: '0 0 22px', lineHeight: 1.55 }}>
          A página que você procura não existe ou foi movida.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '10px 18px',
            borderRadius: 9,
            background: 'var(--purple-700)',
            color: '#fff',
            fontSize: 13.5,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Voltar à base
        </Link>
      </div>
    </div>
  )
}
