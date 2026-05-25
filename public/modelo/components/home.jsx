// Home page — dense layout: highlights compact list + categories grid + recent articles

const homeStyles = {
  root: { padding: '24px 28px 60px', maxWidth: 1280, margin: '0 auto' },
  hero: {
    background: 'linear-gradient(135deg, var(--purple-800) 0%, var(--purple-700) 100%)',
    color: '#fff',
    borderRadius: 14,
    padding: '24px 28px',
    marginBottom: 22,
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 40,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBlob: {
    position: 'absolute', right: -60, top: -60,
    width: 240, height: 240, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,242,94,0.18) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroEyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 11, fontWeight: 600,
    color: 'var(--lime)',
    textTransform: 'uppercase', letterSpacing: '0.14em',
    fontFamily: 'JetBrains Mono, monospace',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 28, fontWeight: 800, lineHeight: 1.15,
    letterSpacing: '-0.02em',
    margin: 0, marginBottom: 10,
  },
  heroDesc: { color: '#cdb6dc', fontSize: 13.5, lineHeight: 1.55, margin: 0, maxWidth: 460 },
  statsRow: { display: 'flex', flexDirection: 'row', gap: 28, position: 'relative', zIndex: 1 },
  stat: { borderLeft: '2px solid rgba(201,242,94,0.4)', paddingLeft: 14 },
  statVal: { fontSize: 28, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#fff', lineHeight: 1 },
  statLbl: { fontSize: 10.5, color: '#b69dc4', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginTop: 6 },

  announce: {
    background: 'rgba(0,0,0,0.18)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 14,
    position: 'relative', zIndex: 1,
  },
  announceTitle: {
    fontSize: 10.5, fontWeight: 700, color: 'var(--lime)',
    textTransform: 'uppercase', letterSpacing: '0.14em',
    marginBottom: 10, fontFamily: 'JetBrains Mono, monospace',
    display: 'flex', alignItems: 'center', gap: 6,
  },
  announceItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 0',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer',
  },
  announceBadge: (type) => ({
    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
    fontFamily: 'JetBrains Mono, monospace',
    padding: '2px 6px', borderRadius: 4,
    color: type === 'incident' ? '#fda4af' : type === 'release' ? 'var(--lime)' : '#fbbf24',
    background: type === 'incident' ? 'rgba(225,29,72,0.15)' : type === 'release' ? 'rgba(201,242,94,0.12)' : 'rgba(245,158,11,0.12)',
    letterSpacing: '0.08em', minWidth: 60, textAlign: 'center',
  }),

  sectionH: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12, marginTop: 28,
  },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 },
  sectionAction: { fontSize: 12, color: 'var(--purple-600)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },

  hotList: {
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  hotRow: {
    display: 'grid',
    gridTemplateColumns: '36px 1fr auto auto auto',
    alignItems: 'center', gap: 14,
    padding: '12px 18px',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'background 0.12s',
  },
  hotRank: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 13, fontWeight: 700,
    color: 'var(--ink-4)',
    width: 22, textAlign: 'center',
  },
  hotRankTop: { color: 'var(--purple-700)' },
  hotTitle: { fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 },
  hotMeta: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: 'var(--ink-3)' },
  pop: (level) => ({
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 10.5, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
    padding: '3px 7px', borderRadius: 5,
    color: level === 'hot' ? '#9f1239' : level === 'rising' ? '#92400e' : 'var(--ink-3)',
    background: level === 'hot' ? '#ffe4e6' : level === 'rising' ? '#fef3c7' : 'var(--bg)',
    border: level === 'hot' ? '1px solid #fecdd3' : level === 'rising' ? '1px solid #fde68a' : '1px solid var(--border)',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  }),

  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  catCard: {
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 16,
    cursor: 'pointer',
    transition: 'all 0.15s',
    position: 'relative',
  },
  catHead: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
  catIconBox: {
    width: 36, height: 36, borderRadius: 9,
    background: 'var(--purple-50)',
    color: 'var(--purple-700)',
    display: 'grid', placeItems: 'center', flexShrink: 0,
  },
  catName: { fontSize: 14, fontWeight: 700, color: 'var(--ink)' },
  catCount: { fontSize: 11, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-3)' },
  catDesc: { fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.45, marginBottom: 10, minHeight: 34 },
  catSubs: { display: 'flex', flexWrap: 'wrap', gap: 4 },
  catSubChip: {
    fontSize: 10.5, color: 'var(--ink-2)',
    padding: '3px 7px',
    border: '1px solid var(--border)',
    borderRadius: 5,
    background: 'var(--surface-2)',
  },

  twoCol: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginTop: 12 },
  recentList: {
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  recentRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '11px 16px',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
  },
  tagChip: (style) => ({
    display: 'inline-flex',
    fontSize: 9.5, fontWeight: 700,
    padding: '3px 7px', borderRadius: 4,
    background: style.bg, color: style.fg,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    fontFamily: 'JetBrains Mono, monospace',
    whiteSpace: 'nowrap',
  }),

  side: { background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 16 },
  shortcutRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '1px solid var(--border)',
    fontSize: 12.5, color: 'var(--ink-2)',
  },
  kbd: {
    fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, fontWeight: 600,
    color: 'var(--ink-2)', padding: '2px 6px',
    background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5,
  },
};

function Home({ onNavigate, pinned, togglePin }) {
  const hot = ARTICLES.filter((a) => a.hot).slice(0, 4);
  const trending = ARTICLES.slice().sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div style={homeStyles.root}>
      {/* HERO */}
      <div style={homeStyles.hero}>
        <div style={homeStyles.heroBlob}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={homeStyles.heroEyebrow}>
            <Icon name="zap" size={12} strokeWidth={2.5} />
            Base interna · v3.2
          </div>
          <h1 style={homeStyles.heroTitle}>Como podemos<br/>ajudar o cliente hoje?</h1>
          <p style={homeStyles.heroDesc}>
            Base de conhecimento do time de suporte L1/L2 da TurboCloud. Use <span className="mono" style={{ background: 'rgba(201,242,94,0.12)', color: 'var(--lime)', padding: '1px 5px', borderRadius: 3 }}>⌘K</span> para busca rápida ou navegue pelas categorias.
          </p>
        </div>
        <div style={homeStyles.statsRow}>
          <div style={homeStyles.stat}>
            <div style={homeStyles.statVal}>154</div>
            <div style={homeStyles.statLbl}>Artigos publicados</div>
          </div>
          <div style={homeStyles.stat}>
            <div style={homeStyles.statVal}>8</div>
            <div style={homeStyles.statLbl}>Categorias ativas</div>
          </div>
          <div style={homeStyles.stat}>
            <div style={homeStyles.statVal}>12</div>
            <div style={homeStyles.statLbl}>Atualizados esta semana</div>
          </div>
        </div>
      </div>

      {/* HOT LIST — Mais pesquisados */}
      <div style={homeStyles.sectionH}>
        <div style={homeStyles.sectionTitle}>
          <Icon name="flame" size={14} style={{ color: '#e11d48' }} />
          Mais pesquisados
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', fontWeight: 500, marginLeft: 4 }}>· últimas 24h</span>
        </div>
        <div style={homeStyles.sectionAction}>
          Ver ranking completo <Icon name="arrow-right" size={12} />
        </div>
      </div>

      <div style={homeStyles.hotList}>
        {trending.map((a, i) => {
          const tag = TAG_STYLES[a.tag];
          const level = i === 0 ? 'hot' : i < 3 ? 'rising' : 'normal';
          return (
            <div
              key={a.id}
              style={{ ...homeStyles.hotRow, borderBottom: i === trending.length - 1 ? 'none' : '1px solid var(--border)' }}
              onClick={() => onNavigate({ view: 'article', article: a.id })}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <span style={{ ...homeStyles.hotRank, ...(i < 3 ? homeStyles.hotRankTop : {}) }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div style={homeStyles.hotTitle}>{a.title}</div>
                <div style={homeStyles.hotMeta}>
                  <span style={homeStyles.tagChip(tag)}>{tag.label}</span>
                  <span><Icon name="eye" size={11} style={{ verticalAlign: -1, marginRight: 3 }} />{a.views.toLocaleString('pt-BR')}</span>
                  <span><Icon name="clock" size={11} style={{ verticalAlign: -1, marginRight: 3 }} />{a.estimate}</span>
                  <span className="mono" style={{ color: 'var(--ink-4)' }}>upd {a.updated}</span>
                </div>
              </div>
              <span style={homeStyles.pop(level)}>
                {level === 'hot' && <><Icon name="flame" size={9} strokeWidth={2.5} />Hot</>}
                {level === 'rising' && <><Icon name="trending-up" size={9} strokeWidth={2.5} />Em alta</>}
                {level === 'normal' && 'Estável'}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); togglePin(a.id); }}
                style={{
                  width: 30, height: 30, borderRadius: 6,
                  background: pinned.has(a.id) ? 'var(--lime-bg)' : 'transparent',
                  border: '1px solid ' + (pinned.has(a.id) ? '#cee68a' : 'var(--border)'),
                  color: pinned.has(a.id) ? 'var(--lime-dark)' : 'var(--ink-3)',
                  cursor: 'pointer', display: 'grid', placeItems: 'center',
                }}
                title={pinned.has(a.id) ? 'Desafixar' : 'Fixar'}
              >
                <Icon name={pinned.has(a.id) ? 'pin-fill' : 'pin'} size={13} />
              </button>
              <Icon name="chevron-right" size={14} style={{ color: 'var(--ink-4)' }} />
            </div>
          );
        })}
      </div>

      {/* CATEGORIES GRID */}
      <div style={homeStyles.sectionH}>
        <div style={homeStyles.sectionTitle}>
          <Icon name="layout-dashboard" size={14} style={{ color: 'var(--purple-600)' }} />
          Categorias
        </div>
        <div style={homeStyles.sectionAction}>
          <Icon name="filter" size={12} />
          Filtrar
        </div>
      </div>

      <div style={homeStyles.grid3}>
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            style={homeStyles.catCard}
            onClick={() => onNavigate({ view: 'category', cat: cat.id })}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--purple-200)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={homeStyles.catHead}>
              <div style={homeStyles.catIconBox}>
                <Icon name={cat.icon} size={18} strokeWidth={1.9} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={homeStyles.catName}>{cat.name}</div>
                <div style={homeStyles.catCount}>{cat.count} artigos · {cat.sub.length} subtópicos</div>
              </div>
            </div>
            <div style={homeStyles.catDesc}>{cat.desc}</div>
            <div style={homeStyles.catSubs}>
              {cat.sub.slice(0, 4).map((s) => (
                <span key={s.id} style={homeStyles.catSubChip}>{s.name}</span>
              ))}
              {cat.sub.length > 4 && <span style={{ ...homeStyles.catSubChip, color: 'var(--ink-3)' }}>+{cat.sub.length - 4}</span>}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

window.Home = Home;
