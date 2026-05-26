// Skeleton genérico para qualquer rota dentro de /admin.
// Renderiza automaticamente enquanto o page.tsx aguarda dados no servidor
// (RSC + React Suspense).

export default function AdminLoading() {
  return (
    <div className="rb-skel">
      {/* Header: título + subtítulo */}
      <div style={{ marginBottom: 32 }}>
        <div className="rb-skel__bar" style={{ width: 220, height: 28, marginBottom: 10 }} />
        <div className="rb-skel__bar" style={{ width: 320, height: 14 }} />
      </div>

      {/* Linha de cards (4) — cobre dashboard e listagens com filtros */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rb-skel__card">
            <div className="rb-skel__bar" style={{ width: '60%', height: 12, marginBottom: 14 }} />
            <div className="rb-skel__bar" style={{ width: 48, height: 28, marginBottom: 10 }} />
            <div className="rb-skel__bar" style={{ width: '80%', height: 11 }} />
          </div>
        ))}
      </div>

      {/* Bloco grande (lista/tabela) */}
      <div className="rb-skel__card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <div className="rb-skel__bar" style={{ width: 160, height: 14 }} />
        </div>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 100px 80px',
              gap: 16,
              padding: '14px 20px',
              borderBottom: i < 5 ? '1px solid var(--color-border)' : 'none',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="rb-skel__bar" style={{ width: '70%', height: 13, marginBottom: 6 }} />
              <div className="rb-skel__bar" style={{ width: '40%', height: 11 }} />
            </div>
            <div className="rb-skel__bar" style={{ width: 80, height: 11 }} />
            <div className="rb-skel__bar" style={{ width: 70, height: 18, borderRadius: 999 }} />
            <div className="rb-skel__bar" style={{ width: 60, height: 11 }} />
          </div>
        ))}
      </div>

      <style>{`
        .rb-skel {
          animation: rb-skel-fade 0.18s ease-out;
        }
        .rb-skel__card {
          background: var(--bg-card);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }
        .rb-skel__bar {
          background: linear-gradient(
            90deg,
            var(--border) 0%,
            var(--surface-2) 45%,
            var(--border) 55%,
            var(--border) 100%
          );
          background-size: 220% 100%;
          border-radius: 4px;
          animation: rb-skel-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes rb-skel-shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes rb-skel-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
