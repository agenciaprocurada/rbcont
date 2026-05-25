// Category page — list of articles with filters

const catStyles = {
  root: { padding: '24px 28px 60px', maxWidth: 1280, margin: '0 auto' },
  header: {
    display: 'flex', alignItems: 'flex-start', gap: 16,
    padding: '20px 24px',
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 12,
    marginBottom: 18,
  },
  iconBig: {
    width: 56, height: 56, borderRadius: 12,
    background: 'linear-gradient(135deg, var(--purple-700) 0%, var(--purple-500) 100%)',
    color: 'var(--lime)',
    display: 'grid', placeItems: 'center', flexShrink: 0,
  },
  title: { fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0, marginBottom: 4 },
  desc: { fontSize: 13, color: 'var(--ink-2)', margin: 0, marginBottom: 10, lineHeight: 1.5 },
  metaRow: { display: 'flex', gap: 14, fontSize: 11.5, color: 'var(--ink-3)' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 4 },

  toolbar: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 14,
  },
  chip: (active) => ({
    padding: '6px 12px',
    borderRadius: 7,
    border: '1px solid ' + (active ? 'var(--purple-600)' : 'var(--border)'),
    background: active ? 'var(--purple-700)' : '#fff',
    color: active ? '#fff' : 'var(--ink-2)',
    fontSize: 12, fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  }),
  sortBtn: {
    marginLeft: 'auto',
    padding: '6px 12px', borderRadius: 7,
    border: '1px solid var(--border)', background: '#fff',
    fontSize: 12, fontWeight: 600, color: 'var(--ink-2)',
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  },

  subnav: {
    display: 'flex', gap: 4,
    padding: 6, background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 10, marginBottom: 16,
    overflowX: 'auto',
  },
  subTab: (active) => ({
    padding: '7px 12px', borderRadius: 6,
    background: active ? 'var(--purple-50)' : 'transparent',
    color: active ? 'var(--purple-800)' : 'var(--ink-2)',
    fontSize: 12.5, fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    whiteSpace: 'nowrap',
  }),
  subTabCount: (active) => ({
    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
    color: active ? 'var(--purple-600)' : 'var(--ink-4)',
    fontWeight: 600,
  }),

  list: {
    background: '#fff', border: '1px solid var(--border)',
    borderRadius: 12, overflow: 'hidden',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr 120px 80px 80px 30px',
    alignItems: 'center', gap: 16,
    padding: '14px 20px',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    fontSize: 13,
  },
  rowHead: {
    fontSize: 10, color: 'var(--ink-3)',
    textTransform: 'uppercase', letterSpacing: '0.1em',
    fontWeight: 700,
    padding: '10px 20px',
    background: 'var(--surface-2)',
    borderBottom: '1px solid var(--border)',
    display: 'grid',
    gridTemplateColumns: '90px 1fr 120px 80px 80px 30px',
    gap: 16,
    fontFamily: 'JetBrains Mono, monospace',
  },
  artTitle: { fontWeight: 600, color: 'var(--ink)', marginBottom: 3, fontSize: 13.5 },
  artExcerpt: { fontSize: 11.5, color: 'var(--ink-3)', lineHeight: 1.45 },
  cell: { fontSize: 11.5, color: 'var(--ink-3)', fontFamily: 'JetBrains Mono, monospace' },
  tagChip: (style) => ({
    display: 'inline-flex',
    fontSize: 9.5, fontWeight: 700,
    padding: '3px 7px', borderRadius: 4,
    background: style.bg, color: style.fg,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    fontFamily: 'JetBrains Mono, monospace',
  }),
};

function CategoryPage({ selected, onNavigate, pinned, togglePin }) {
  const cat = CATEGORIES.find((c) => c.id === selected.cat);
  const [tagFilter, setTagFilter] = React.useState('all');
  const [sort, setSort] = React.useState('views');
  if (!cat) return null;

  let articles = ARTICLES.filter((a) => a.cat === cat.id);
  if (selected.sub) articles = articles.filter((a) => a.sub === selected.sub);
  if (tagFilter !== 'all') articles = articles.filter((a) => a.tag === tagFilter);
  if (sort === 'views') articles = articles.slice().sort((a, b) => b.views - a.views);
  else if (sort === 'updated') articles = articles.slice().sort((a, b) => b.updated.localeCompare(a.updated));

  const tagOpts = ['all', ...new Set(ARTICLES.filter((a) => a.cat === cat.id).map((a) => a.tag))];
  const activeSub = selected.sub;

  return (
    <div style={catStyles.root}>
      <div style={catStyles.header}>
        <div style={catStyles.iconBig}>
          <Icon name={cat.icon} size={26} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={catStyles.title}>{cat.name}</h1>
          <p style={catStyles.desc}>{cat.desc}</p>
          <div style={catStyles.metaRow}>
            <span style={catStyles.metaItem}><Icon name="file-text" size={12} /> {cat.count} artigos</span>
            <span style={catStyles.metaItem}><Icon name="layout-dashboard" size={12} /> {cat.sub.length} subtópicos</span>
            <span style={catStyles.metaItem} className="mono">slug: /{cat.id}</span>
          </div>
        </div>
        <button style={{ ...catStyles.sortBtn, marginLeft: 0 }}>
          <Icon name="plus" size={13} /> Novo
        </button>
      </div>

      {/* SUB-CATEGORY TABS */}
      <div style={catStyles.subnav}>
        <div
          style={catStyles.subTab(!activeSub)}
          onClick={() => onNavigate({ view: 'category', cat: cat.id })}
        >
          Todos
          <span style={catStyles.subTabCount(!activeSub)}>{cat.count}</span>
        </div>
        {cat.sub.map((s) => (
          <div
            key={s.id}
            style={catStyles.subTab(activeSub === s.id)}
            onClick={() => onNavigate({ view: 'category', cat: cat.id, sub: s.id })}
          >
            {s.name}
            <span style={catStyles.subTabCount(activeSub === s.id)}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* FILTER TOOLBAR */}
      <div style={catStyles.toolbar}>
        <Icon name="tag" size={13} style={{ color: 'var(--ink-3)' }} />
        {tagOpts.map((t) => (
          <div
            key={t}
            style={catStyles.chip(tagFilter === t)}
            onClick={() => setTagFilter(t)}
          >
            {t === 'all' ? 'Todas as tags' : TAG_STYLES[t].label}
          </div>
        ))}
        <button
          style={catStyles.sortBtn}
          onClick={() => setSort(sort === 'views' ? 'updated' : 'views')}
        >
          <Icon name="filter" size={12} />
          Ordenar: {sort === 'views' ? 'Mais vistos' : 'Atualizados'}
          <Icon name="chevron-down" size={12} />
        </button>
      </div>

      {/* ARTICLES LIST */}
      <div style={catStyles.list}>
        <div style={catStyles.rowHead}>
          <span>ID · Tag</span>
          <span>Artigo</span>
          <span>Atualizado</span>
          <span>Views</span>
          <span>Tempo</span>
          <span></span>
        </div>
        {articles.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
            Nenhum artigo neste subtópico ainda. <span style={{ color: 'var(--purple-600)', fontWeight: 600, cursor: 'pointer' }}>+ Criar artigo</span>
          </div>
        )}
        {articles.map((a, i) => {
          const tag = TAG_STYLES[a.tag];
          return (
            <div
              key={a.id}
              style={{ ...catStyles.row, borderBottom: i === articles.length - 1 ? 'none' : '1px solid var(--border)' }}
              onClick={() => onNavigate({ view: 'article', article: a.id })}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 600 }}>{a.id.toUpperCase()}</span>
                <span style={catStyles.tagChip(tag)}>{tag.label}</span>
              </div>
              <div>
                <div style={catStyles.artTitle}>{a.title}</div>
                <div style={catStyles.artExcerpt}>{a.excerpt}</div>
              </div>
              <span style={catStyles.cell}>{a.updated}</span>
              <span style={catStyles.cell}><Icon name="eye" size={11} style={{ verticalAlign: -1, marginRight: 3 }}/>{a.views.toLocaleString('pt-BR')}</span>
              <span style={catStyles.cell}>{a.estimate}</span>
              <button
                onClick={(e) => { e.stopPropagation(); togglePin(a.id); }}
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: pinned.has(a.id) ? 'var(--lime-bg)' : 'transparent',
                  border: '1px solid ' + (pinned.has(a.id) ? '#cee68a' : 'var(--border)'),
                  color: pinned.has(a.id) ? 'var(--lime-dark)' : 'var(--ink-3)',
                  cursor: 'pointer', display: 'grid', placeItems: 'center',
                }}
              >
                <Icon name={pinned.has(a.id) ? 'pin-fill' : 'pin'} size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.CategoryPage = CategoryPage;
