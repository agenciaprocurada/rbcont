// Skeleton para rotas dentro de /(public) — área de leitura da base.
// Renderiza dentro de `tc-shell__main` enquanto o page.tsx busca dados.
// O sidebar público (carregado pelo layout) permanece visível.

export default function PublicLoading() {
  return (
    <div className="tc-page rb-pskel">
      {/* Hero */}
      <div className="rb-pskel__hero">
        <div>
          <div className="rb-pskel__bar" style={{ width: 110, height: 11, marginBottom: 14, opacity: 0.6 }} />
          <div className="rb-pskel__bar" style={{ width: '70%', height: 26, marginBottom: 10 }} />
          <div className="rb-pskel__bar" style={{ width: '90%', height: 12, marginBottom: 4 }} />
          <div className="rb-pskel__bar" style={{ width: '60%', height: 12 }} />
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <div className="rb-pskel__bar" style={{ width: 40, height: 22, marginBottom: 6 }} />
              <div className="rb-pskel__bar" style={{ width: 70, height: 10 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Section title */}
      <div className="rb-pskel__sectionH">
        <div className="rb-pskel__bar" style={{ width: 130, height: 12 }} />
        <div className="rb-pskel__bar" style={{ width: 60, height: 10 }} />
      </div>

      {/* Hot list (rows) */}
      <div className="rb-pskel__list">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '24px 1fr 60px 60px',
              alignItems: 'center',
              gap: 14,
              padding: '14px 18px',
              borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div className="rb-pskel__bar" style={{ width: 16, height: 12 }} />
            <div>
              <div className="rb-pskel__bar" style={{ width: '70%', height: 12, marginBottom: 6 }} />
              <div className="rb-pskel__bar" style={{ width: '40%', height: 10 }} />
            </div>
            <div className="rb-pskel__bar" style={{ width: 48, height: 16, borderRadius: 5 }} />
            <div className="rb-pskel__bar" style={{ width: 40, height: 10 }} />
          </div>
        ))}
      </div>

      {/* Section title #2 */}
      <div className="rb-pskel__sectionH">
        <div className="rb-pskel__bar" style={{ width: 100, height: 12 }} />
      </div>

      {/* Category grid (6 cards) */}
      <div className="rb-pskel__catGrid">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rb-pskel__catCard">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div className="rb-pskel__bar" style={{ width: 36, height: 36, borderRadius: 9 }} />
              <div style={{ flex: 1 }}>
                <div className="rb-pskel__bar" style={{ width: '70%', height: 12, marginBottom: 6 }} />
                <div className="rb-pskel__bar" style={{ width: 36, height: 10 }} />
              </div>
            </div>
            <div className="rb-pskel__bar" style={{ width: '95%', height: 10, marginBottom: 4 }} />
            <div className="rb-pskel__bar" style={{ width: '60%', height: 10 }} />
          </div>
        ))}
      </div>

      <style>{`
        .rb-pskel {
          animation: rb-pskel-fade 0.18s ease-out;
        }
        .rb-pskel__hero {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 24px 28px;
          margin-bottom: 22px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 40px;
          align-items: center;
        }
        .rb-pskel__sectionH {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 28px 0 12px;
        }
        .rb-pskel__list {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .rb-pskel__catGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 1100px) { .rb-pskel__catGrid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 700px)  { .rb-pskel__catGrid { grid-template-columns: 1fr; } }
        .rb-pskel__catCard {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
        }
        .rb-pskel__bar {
          background: linear-gradient(
            90deg,
            var(--border) 0%,
            var(--surface-2) 45%,
            var(--border) 55%,
            var(--border) 100%
          );
          background-size: 220% 100%;
          border-radius: 4px;
          animation: rb-pskel-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes rb-pskel-shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes rb-pskel-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
