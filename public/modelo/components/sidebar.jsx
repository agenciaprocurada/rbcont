// Sidebar with categories, sub-items, counters, favorites/pinned

const sidebarStyles = {
  root: {
    width: 280,
    minWidth: 280,
    background: 'var(--purple-900)',
    color: '#e8def0',
    height: '100vh',
    position: 'sticky',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid var(--purple-800)',
  },
  brand: {
    padding: '18px 20px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  brandMark: {
    width: 30, height: 30, borderRadius: 8,
    background: 'var(--lime)',
    display: 'grid', placeItems: 'center',
    color: 'var(--purple-900)',
    fontWeight: 800, fontSize: 14,
    fontFamily: 'JetBrains Mono, monospace',
  },
  brandText: { fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: '-0.01em' },
  brandSub: { fontSize: 10, color: '#b69dc4', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 },
  scroll: { flex: 1, overflowY: 'auto', padding: '10px 8px 16px' },
  sectionLabel: {
    fontSize: 10, fontWeight: 700, color: '#9379a8',
    textTransform: 'uppercase', letterSpacing: '0.14em',
    padding: '12px 12px 6px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  navItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 12px', borderRadius: 8,
    cursor: 'pointer', userSelect: 'none',
    background: active ? 'rgba(201, 242, 94, 0.12)' : 'transparent',
    color: active ? '#fff' : '#d4c5dc',
    fontWeight: active ? 600 : 500,
    fontSize: 13,
    borderLeft: active ? '2px solid var(--lime)' : '2px solid transparent',
    marginLeft: active ? 0 : 2,
    paddingLeft: active ? 10 : 12,
    transition: 'background 0.12s',
  }),
  catRow: (active, open) => ({
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '7px 8px 7px 10px',
    borderRadius: 7,
    cursor: 'pointer', userSelect: 'none',
    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
    color: active ? '#fff' : '#d4c5dc',
    fontWeight: active ? 600 : 500,
    fontSize: 13,
  }),
  catIcon: (active) => ({
    width: 26, height: 26, borderRadius: 6,
    background: active ? 'var(--lime)' : 'rgba(255,255,255,0.05)',
    color: active ? 'var(--purple-900)' : '#c8b2d6',
    display: 'grid', placeItems: 'center',
    flexShrink: 0,
  }),
  count: (active) => ({
    marginLeft: 'auto',
    fontSize: 10,
    fontFamily: 'JetBrains Mono, monospace',
    color: active ? 'var(--lime)' : '#9379a8',
    fontWeight: 600,
    background: active ? 'rgba(201,242,94,0.08)' : 'rgba(255,255,255,0.04)',
    padding: '2px 6px', borderRadius: 4,
    minWidth: 22, textAlign: 'center',
  }),
  sub: { paddingLeft: 36, display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2, marginBottom: 4 },
  subItem: (active) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '5px 10px 5px 8px',
    borderRadius: 5,
    cursor: 'pointer', userSelect: 'none',
    color: active ? 'var(--lime)' : '#a98fbb',
    fontSize: 12,
    fontWeight: active ? 600 : 500,
    background: active ? 'rgba(201,242,94,0.06)' : 'transparent',
    borderLeft: active ? '2px solid var(--lime)' : '2px solid rgba(255,255,255,0.06)',
    paddingLeft: 10,
  }),
  subCount: { fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#7c6390' },
  pinRow: {
    display: 'flex', alignItems: 'flex-start', gap: 8,
    padding: '8px 10px',
    borderRadius: 6, cursor: 'pointer',
    fontSize: 12, color: '#d4c5dc',
  },
  pinDot: {
    width: 5, height: 5, borderRadius: 5,
    background: 'var(--lime)', marginTop: 6, flexShrink: 0,
  },
  footer: {
    padding: '12px 14px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 12,
  },
  avatar: {
    width: 30, height: 30, borderRadius: 8,
    background: 'linear-gradient(135deg, var(--lime) 0%, #87b832 100%)',
    color: 'var(--purple-900)', fontWeight: 700,
    display: 'grid', placeItems: 'center', fontSize: 12,
    flexShrink: 0,
  },
  iconBtn: {
    width: 28, height: 28, borderRadius: 6,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: '#c8b2d6', cursor: 'pointer',
    display: 'grid', placeItems: 'center',
  },
};

function Sidebar({ view, selected, onNavigate, pinned, articles }) {
  const [openCats, setOpenCats] = React.useState(() => new Set(['wordpress']));
  const isAllOpen = view === 'home';

  const toggle = (id) => {
    setOpenCats((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  // Auto-open the active category
  React.useEffect(() => {
    if (view === 'category' && selected?.cat) {
      setOpenCats((prev) => new Set(prev).add(selected.cat));
    }
  }, [view, selected?.cat]);

  const pinnedArticles = articles.filter((a) => pinned.has(a.id)).slice(0, 4);

  return (
    <aside style={sidebarStyles.root}>
      <div style={sidebarStyles.brand} onClick={() => onNavigate({ view: 'home' })}>
        <div style={sidebarStyles.brandMark}>T</div>
        <div>
          <div style={sidebarStyles.brandText}>TurboCloud</div>
          <div style={sidebarStyles.brandSub}>Help · Internal</div>
        </div>
      </div>

      <div style={sidebarStyles.scroll}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '4px 4px 0' }}>
          <div
            style={sidebarStyles.navItem(view === 'home')}
            onClick={() => onNavigate({ view: 'home' })}
          >
            <Icon name="layout-dashboard" size={16} />
            <span>Início</span>
          </div>
          <div style={sidebarStyles.navItem(false)}>
            <Icon name="trending-up" size={16} />
            <span>Mais acessados</span>
            <span style={sidebarStyles.count(false)}>24h</span>
          </div>
          <div style={sidebarStyles.navItem(false)}>
            <Icon name="clock" size={16} />
            <span>Recentes</span>
          </div>
          <div style={sidebarStyles.navItem(false)}>
            <Icon name="bookmark" size={16} />
            <span>Meus favoritos</span>
            <span style={sidebarStyles.count(false)}>{pinned.size}</span>
          </div>
        </div>

        <div style={sidebarStyles.sectionLabel}>
          <span>Categorias</span>
          <span className="mono" style={{ color: '#7c6390', letterSpacing: 0, fontSize: 10 }}>8</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 4px' }}>
          {CATEGORIES.map((cat) => {
            const isActive = view === 'category' && selected?.cat === cat.id;
            const isOpen = openCats.has(cat.id) || isActive;
            return (
              <div key={cat.id}>
                <div
                  style={sidebarStyles.catRow(isActive)}
                  onClick={() => {
                    toggle(cat.id);
                    onNavigate({ view: 'category', cat: cat.id });
                  }}
                >
                  <div style={sidebarStyles.catIcon(isActive)}>
                    <Icon name={cat.icon} size={14} strokeWidth={2} />
                  </div>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span>
                  <span style={sidebarStyles.count(isActive)}>{cat.count}</span>
                  <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} size={12} strokeWidth={2} />
                </div>
                {isOpen && (
                  <div style={sidebarStyles.sub}>
                    {cat.sub.map((s) => {
                      const subActive = isActive && selected?.sub === s.id;
                      return (
                        <div
                          key={s.id}
                          style={sidebarStyles.subItem(subActive)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate({ view: 'category', cat: cat.id, sub: s.id });
                          }}
                        >
                          <span>{s.name}</span>
                          <span style={sidebarStyles.subCount}>{s.count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>


      </div>

      <div style={sidebarStyles.footer}>
        <div style={sidebarStyles.avatar}>AT</div>
        <div style={{ flex: 1, lineHeight: 1.3, overflow: 'hidden' }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 12 }}>Admin de Teste</div>
          <div style={{ color: '#9379a8', fontSize: 10.5, fontFamily: 'JetBrains Mono, monospace' }}>SUPORTE · L2</div>
        </div>
        <button style={sidebarStyles.iconBtn} title="Sair">
          <Icon name="log-out" size={14} />
        </button>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
