// Skeleton para página de artigo: header (categoria + título + excerpt)
// + corpo (parágrafos placeholder) + sidebar (3 cards de metadata/relacionados).

export default function ArticleLoading() {
  return (
    <div className="tc-artPage rb-aSkel">
      {/* Back link */}
      <div className="rb-aSkel__back rb-aSkel__bar" />

      <div className="tc-artPage__grid">
        {/* Main */}
        <div className="tc-artPage__main">
          <div className="tc-artPage__head">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Category tag */}
                <div className="rb-aSkel__bar" style={{ width: 110, height: 11, marginBottom: 12, opacity: 0.7 }} />
                {/* Title */}
                <div className="rb-aSkel__bar" style={{ width: '85%', height: 24, marginBottom: 10 }} />
                <div className="rb-aSkel__bar" style={{ width: '55%', height: 24, marginBottom: 16 }} />
                {/* Excerpt */}
                <div className="rb-aSkel__bar" style={{ width: '95%', height: 13, marginBottom: 6 }} />
                <div className="rb-aSkel__bar" style={{ width: '70%', height: 13 }} />
              </div>
              {/* Favorite button */}
              <div className="rb-aSkel__bar" style={{ width: 100, height: 30, borderRadius: 8, flexShrink: 0 }} />
            </div>
          </div>

          {/* Body — paragraphs */}
          <div style={{ marginTop: 12 }}>
            {[
              '95%', '88%', '92%', '70%',
              '90%', '82%', '60%',
              '94%', '78%', '40%',
            ].map((w, i) => (
              <div
                key={i}
                className="rb-aSkel__bar"
                style={{
                  width: w,
                  height: 13,
                  marginBottom: i === 3 || i === 6 ? 22 : 9,
                  borderRadius: 3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="tc-artPage__side">
          {/* Detalhes */}
          <div className="rb-aSkel__sideCard">
            <div className="rb-aSkel__bar" style={{ width: 70, height: 10, marginBottom: 14, opacity: 0.7 }} />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div className="rb-aSkel__bar" style={{ width: 60, height: 10 }} />
                <div className="rb-aSkel__bar" style={{ width: 50, height: 10 }} />
              </div>
            ))}
          </div>

          {/* Relacionados */}
          <div className="rb-aSkel__sideCard">
            <div className="rb-aSkel__bar" style={{ width: 130, height: 10, marginBottom: 14, opacity: 0.7 }} />
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}
              >
                <div className="rb-aSkel__bar" style={{ width: '90%', height: 11, marginBottom: 5 }} />
                <div className="rb-aSkel__bar" style={{ width: '60%', height: 11 }} />
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div className="rb-aSkel__sideCard">
            <div className="rb-aSkel__bar" style={{ width: 140, height: 10, marginBottom: 12, opacity: 0.7 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="rb-aSkel__bar" style={{ flex: 1, height: 28, borderRadius: 7 }} />
              <div className="rb-aSkel__bar" style={{ flex: 1, height: 28, borderRadius: 7 }} />
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .rb-aSkel {
          animation: rb-aSkel-fade 0.18s ease-out;
        }
        .rb-aSkel__back {
          width: 130px;
          height: 12px;
          margin-bottom: 14px;
          opacity: 0.6;
        }
        .rb-aSkel__sideCard {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
        }
        .rb-aSkel__bar {
          background: linear-gradient(
            90deg,
            var(--border) 0%,
            var(--surface-2) 45%,
            var(--border) 55%,
            var(--border) 100%
          );
          background-size: 220% 100%;
          border-radius: 4px;
          animation: rb-aSkel-shimmer 1.4s ease-in-out infinite;
        }
        .tc-artPage__main {
          /* Same card chrome the real page uses */
        }
        @keyframes rb-aSkel-shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes rb-aSkel-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
