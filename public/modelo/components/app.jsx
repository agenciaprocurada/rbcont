// Root app — routing + pin/favorite state + keyboard shortcuts

function App() {
  const [state, setState] = React.useState({ view: 'home' });
  const [query, setQuery] = React.useState('');
  const [pinned, setPinned] = React.useState(() => new Set(ARTICLES.filter((a) => a.pinned).map((a) => a.id)));
  const [searchOpen, setSearchOpen] = React.useState(false);

  const navigate = (next) => {
    setState(next);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const togglePin = (id) => {
    setPinned((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  // ⌘K opens search focus
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.querySelector('input[placeholder^="Buscar"]');
        if (input) input.focus();
      }
      // 'g h' for home — simplified: just 'h' when not in input
      if (e.key === 'h' && document.activeElement.tagName !== 'INPUT') {
        navigate({ view: 'home' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Search results overlay if query
  const filteredArticles = query.trim()
    ? ARTICLES.filter((a) => {
        const q = query.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          (TAG_STYLES[a.tag].label.toLowerCase().includes(q))
        );
      }).slice(0, 8)
    : [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        view={state.view}
        selected={state}
        onNavigate={navigate}
        pinned={pinned}
        articles={ARTICLES}
      />

      <main style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <Topbar view={state.view} selected={state} query={query} setQuery={setQuery} onNavigate={navigate} />

        {query.trim() && (
          <div style={{
            position: 'absolute', top: 58, left: '50%', transform: 'translateX(-50%)',
            width: 580, maxWidth: 'calc(100% - 80px)',
            background: '#fff', borderRadius: 10,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 20,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 16px',
              background: 'var(--surface-2)',
              borderBottom: '1px solid var(--border)',
              fontSize: 11, color: 'var(--ink-3)',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>{filteredArticles.length} resultado{filteredArticles.length !== 1 ? 's' : ''}</span>
              <span style={{ color: 'var(--ink-4)' }}>esc para fechar</span>
            </div>
            {filteredArticles.length === 0 && (
              <div style={{ padding: 28, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
                Nada encontrado para <span className="mono" style={{ background: 'var(--bg)', padding: '1px 6px', borderRadius: 4 }}>{query}</span>
              </div>
            )}
            {filteredArticles.map((a) => {
              const tag = TAG_STYLES[a.tag];
              const cat = CATEGORIES.find((c) => c.id === a.cat);
              return (
                <div
                  key={a.id}
                  style={{
                    padding: '11px 16px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                  onClick={() => { navigate({ view: 'article', article: a.id }); setQuery(''); }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)', fontWeight: 600, width: 36 }}>{a.id.toUpperCase()}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{cat.name}</div>
                  </div>
                  <span style={{
                    fontSize: 9.5, fontWeight: 700,
                    padding: '3px 7px', borderRadius: 4,
                    background: tag.bg, color: tag.fg,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>{tag.label}</span>
                  <Icon name="arrow-right" size={13} style={{ color: 'var(--ink-4)' }} />
                </div>
              );
            })}
          </div>
        )}

        {state.view === 'home' && <Home onNavigate={navigate} pinned={pinned} togglePin={togglePin} />}
        {state.view === 'category' && <CategoryPage selected={state} onNavigate={navigate} pinned={pinned} togglePin={togglePin} />}
        {state.view === 'article' && <ArticlePage selected={state} onNavigate={navigate} pinned={pinned} togglePin={togglePin} />}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
