// Skeleton para listagem de categoria: header da categoria + tabela de artigos.

export default function CategoryLoading() {
  return (
    <div className="tc-page rb-cSkel">
      {/* Back link */}
      <div className="rb-cSkel__back rb-cSkel__bar" />

      {/* Category header card */}
      <div className="rb-cSkel__catHeader">
        <div className="rb-cSkel__bar" style={{ width: 56, height: 56, borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="rb-cSkel__bar" style={{ width: '40%', height: 22, marginBottom: 8 }} />
          <div className="rb-cSkel__bar" style={{ width: '70%', height: 12, marginBottom: 4 }} />
          <div className="rb-cSkel__bar" style={{ width: '55%', height: 12, marginBottom: 10 }} />
          <div style={{ display: 'flex', gap: 14 }}>
            <div className="rb-cSkel__bar" style={{ width: 70, height: 10 }} />
            <div className="rb-cSkel__bar" style={{ width: 90, height: 10 }} />
          </div>
        </div>
      </div>

      {/* Article list */}
      <div className="rb-cSkel__list">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px 90px 80px',
            gap: 16,
            padding: '10px 20px',
            background: 'var(--surface-2)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="rb-cSkel__bar" style={{ width: 60, height: 9, opacity: 0.6 }} />
          <div className="rb-cSkel__bar" style={{ width: 70, height: 9, opacity: 0.6 }} />
          <div className="rb-cSkel__bar" style={{ width: 50, height: 9, opacity: 0.6 }} />
          <div className="rb-cSkel__bar" style={{ width: 50, height: 9, opacity: 0.6 }} />
        </div>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 90px 80px',
              gap: 16,
              padding: '14px 20px',
              alignItems: 'center',
              borderBottom: i < 6 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div>
              <div className="rb-cSkel__bar" style={{ width: '70%', height: 13, marginBottom: 6 }} />
              <div className="rb-cSkel__bar" style={{ width: '50%', height: 11 }} />
            </div>
            <div className="rb-cSkel__bar" style={{ width: 90, height: 10 }} />
            <div className="rb-cSkel__bar" style={{ width: 50, height: 10 }} />
            <div className="rb-cSkel__bar" style={{ width: 60, height: 10 }} />
          </div>
        ))}
      </div>

      <style>{`
        .rb-cSkel {
          animation: rb-cSkel-fade 0.18s ease-out;
        }
        .rb-cSkel__back {
          width: 130px;
          height: 12px;
          margin-bottom: 14px;
          opacity: 0.6;
        }
        .rb-cSkel__catHeader {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          margin-bottom: 18px;
        }
        .rb-cSkel__list {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .rb-cSkel__bar {
          background: linear-gradient(
            90deg,
            var(--border) 0%,
            var(--surface-2) 45%,
            var(--border) 55%,
            var(--border) 100%
          );
          background-size: 220% 100%;
          border-radius: 4px;
          animation: rb-cSkel-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes rb-cSkel-shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes rb-cSkel-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
