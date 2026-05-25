// Topbar with search, ⌘K, breadcrumb, actions

const topbarStyles = {
  root: {
    position: 'sticky', top: 0, zIndex: 10,
    background: 'rgba(247, 245, 249, 0.85)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--border)',
    padding: '12px 28px',
    display: 'flex', alignItems: 'center', gap: 16,
  },
  crumbs: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 12, color: 'var(--ink-3)',
    minWidth: 200,
  },
  crumbActive: { color: 'var(--ink)', fontWeight: 600 },
  search: {
    flex: 1,
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '8px 12px',
    cursor: 'text',
    boxShadow: 'var(--shadow-sm)',
  },
  searchInput: {
    flex: 1, border: 0, outline: 0, background: 'transparent',
    fontSize: 13, fontFamily: 'inherit', color: 'var(--ink)',
  },
  kbd: {
    display: 'inline-flex', alignItems: 'center', gap: 2,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10.5, fontWeight: 600,
    color: 'var(--ink-3)',
    padding: '2px 6px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 5,
  },
  actions: { display: 'flex', alignItems: 'center', gap: 6 },
  iconBtn: {
    width: 34, height: 34, borderRadius: 8,
    background: '#fff',
    border: '1px solid var(--border)',
    color: 'var(--ink-2)', cursor: 'pointer',
    display: 'grid', placeItems: 'center',
    position: 'relative',
  },
  primaryBtn: {
    padding: '8px 14px', borderRadius: 8,
    background: 'var(--purple-700)', color: '#fff',
    border: 'none', cursor: 'pointer',
    fontSize: 12.5, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 6,
  },
  dot: {
    position: 'absolute', top: 6, right: 6,
    width: 7, height: 7, borderRadius: 7,
    background: 'var(--lime-2)', border: '2px solid #fff',
  },
};

function Topbar({ view, selected, query, setQuery, onNavigate }) {
  const cat = selected?.cat ? CATEGORIES.find((c) => c.id === selected.cat) : null;
  const sub = cat && selected?.sub ? cat.sub.find((s) => s.id === selected.sub) : null;
  const article = view === 'article' && selected?.article ? ARTICLES.find((a) => a.id === selected.article) : null;
  const articleCat = article ? CATEGORIES.find((c) => c.id === article.cat) : null;

  return (
    <div style={topbarStyles.root}>
      <div style={topbarStyles.crumbs}>
        {view === 'category' && cat && (
          <>
            <span style={!sub ? topbarStyles.crumbActive : { cursor: 'pointer' }}
                  onClick={() => onNavigate({ view: 'category', cat: cat.id })}>{cat.name}</span>
            {sub && <><Icon name="chevron-right" size={12} /><span style={topbarStyles.crumbActive}>{sub.name}</span></>}
          </>
        )}
        {view === 'article' && articleCat && (
          <>
            <span style={{ cursor: 'pointer' }} onClick={() => onNavigate({ view: 'category', cat: articleCat.id })}>{articleCat.name}</span>
            <Icon name="chevron-right" size={12} />
            <span style={topbarStyles.crumbActive} className="mono">{article.id.toUpperCase()}</span>
          </>
        )}
      </div>

      <div style={topbarStyles.search} onClick={(e) => e.currentTarget.querySelector('input').focus()}>
        <Icon name="search" size={16} style={{ color: 'var(--ink-3)' }} />
        <input
          style={topbarStyles.searchInput}
          placeholder="Buscar artigo, código (a07), categoria, tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div style={topbarStyles.actions}>
      </div>
    </div>
  );
}

window.Topbar = Topbar;
