// Standalone Content page — pure copy-and-paste canned response viewer.
// Stripped of: edit button, variables editor, channel sidebar, details sidebar,
// tone selector, WhatsApp/Email buttons.

const cpStyles = {
  shell: { minHeight: '100vh', background: 'var(--bg)' },
  topbar: {
    height: 56, background: 'var(--purple-900)', color: '#fff',
    display: 'flex', alignItems: 'center', padding: '0 24px',
    gap: 20, borderBottom: '1px solid #000',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em' },
  brandLime: { color: 'var(--lime)' },
  brandSlash: { color: 'var(--ink-4)', fontWeight: 400, margin: '0 4px' },
  brandSub: { color: '#d8c9e3', fontWeight: 500 },
  topRight: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, fontSize: 12.5, color: '#d8c9e3' },
  userChip: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px 5px 5px',
    background: 'rgba(255,255,255,0.06)', borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.08)',
  },
  avatar: {
    width: 24, height: 24, borderRadius: '50%',
    background: 'var(--lime)', color: 'var(--purple-900)',
    display: 'grid', placeItems: 'center',
    fontSize: 10.5, fontWeight: 800,
  },

  back: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 12, color: 'var(--ink-3)', fontWeight: 600,
    cursor: 'pointer', padding: '6px 10px 6px 6px',
    borderRadius: 6, border: '1px solid transparent',
    fontFamily: 'JetBrains Mono, monospace',
    textTransform: 'uppercase', letterSpacing: '0.08em',
  },

  wrap: { padding: '24px 28px 60px', maxWidth: 1080, margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'flex-start' },
  main: {
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '28px 32px',
  },
  head: { marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid var(--border)' },
  metaRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  catLink: {
    fontSize: 11, fontWeight: 700, color: 'var(--purple-700)',
    textTransform: 'uppercase', letterSpacing: '0.1em',
    fontFamily: 'JetBrains Mono, monospace',
  },
  tagChip: (s) => ({
    display: 'inline-flex', fontSize: 10, fontWeight: 700,
    padding: '4px 8px', borderRadius: 5,
    background: s.bg, color: s.fg,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    fontFamily: 'JetBrains Mono, monospace',
  }),
  idChip: { fontSize: 10.5, color: 'var(--ink-4)', fontWeight: 600, marginLeft: 6, fontFamily: 'JetBrains Mono, monospace' },
  title: { fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0, marginBottom: 10, lineHeight: 1.2 },
  desc: { fontSize: 13.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.55 },

  pinBtn: (active) => ({
    marginLeft: 'auto',
    padding: '7px 12px', borderRadius: 7,
    border: '1px solid ' + (active ? '#cee68a' : 'var(--border)'),
    background: active ? 'var(--lime-bg)' : '#fff',
    color: active ? 'var(--lime-dark)' : 'var(--ink-2)',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  }),

  blockSection: { marginTop: 22 },
  blockHeadRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
  blockNum: {
    width: 22, height: 22, borderRadius: 5,
    background: 'var(--purple-700)', color: 'var(--lime)',
    display: 'grid', placeItems: 'center',
    fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700,
  },
  blockTitle: { fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', flex: 1 },
  blockBadge: {
    fontSize: 10, fontWeight: 700, color: 'var(--ink-3)',
    fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  blockBody: {
    position: 'relative',
    border: '1px solid var(--border)',
    borderRadius: 9,
    background: 'var(--surface-2)',
    padding: '14px 16px',
    fontSize: 14, lineHeight: 1.65,
    color: 'var(--ink)',
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit',
  },
  copyBtn: (copied) => ({
    position: 'absolute', top: 10, right: 10,
    padding: '5px 10px', borderRadius: 6,
    border: '1px solid ' + (copied ? '#cee68a' : 'var(--border)'),
    background: copied ? 'var(--lime-bg)' : '#fff',
    color: copied ? 'var(--lime-dark)' : 'var(--ink-2)',
    fontSize: 11, fontWeight: 700, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontFamily: 'JetBrains Mono, monospace',
    letterSpacing: '0.04em', textTransform: 'uppercase',
  }),
  varSpan: {
    display: 'inline-block',
    background: 'rgba(201,242,94,0.25)',
    color: 'var(--ink)',
    fontWeight: 700,
    padding: '0 4px',
    borderRadius: 3,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 13,
    border: '1px solid rgba(110,138,26,0.2)',
  },
  finalRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    marginTop: 22, padding: '14px 16px',
    background: 'var(--purple-50)',
    border: '1px solid var(--purple-100)',
    borderLeft: '3px solid var(--purple-600)',
    borderRadius: 9,
  },
  primaryBtn: {
    padding: '9px 16px', borderRadius: 7,
    background: 'var(--purple-700)', color: '#fff',
    border: 'none', cursor: 'pointer',
    fontSize: 12.5, fontWeight: 700,
    display: 'inline-flex', alignItems: 'center', gap: 6,
  },

  side: { display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80 },
  sideCard: { background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 16 },
  sideLabel: { fontSize: 10, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 10 },
  relatedItem: {
    padding: '10px 0', borderBottom: '1px solid var(--border)',
    cursor: 'pointer', fontSize: 12.5, color: 'var(--ink-2)',
    lineHeight: 1.4, fontWeight: 500,
  },
  feedbackBtn: {
    flex: 1, padding: '7px 10px', borderRadius: 7,
    border: '1px solid var(--border)', background: '#fff',
    fontSize: 12, fontWeight: 600, color: 'var(--ink-2)',
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center',
  },
};

const RESPONSE_BLOCKS = [
  {
    title: 'Saudação e reconhecimento',
    badge: 'Abertura',
    text: `Olá {{nome_cliente}},\n\nObrigado por entrar em contato com o suporte da TurboCloud. Identifiquei aqui que seu site {{site_url}} está apresentando erro 500 após a instalação recente de um plugin no WordPress. Vamos resolver isso agora.`,
  },
  {
    title: 'Procedimento — passo a passo',
    badge: 'Diagnóstico',
    text: `Para identificar o plugin que está causando o problema, vou pedir que você:\n\n1. Acesse o painel TurboCloud em painel.turbocloud.com.br\n2. Vá em Sites → {{site_url}} → WordPress → Plugins\n3. Desative o último plugin instalado (no seu caso: {{plugin}})\n4. Atualize a página do site e verifique se voltou ao normal\n\nSe não voltar, repita o procedimento desativando os demais plugins um por um.`,
  },
  {
    title: 'Encerramento e próximos passos',
    badge: 'Conclusão',
    text: `Caso o erro persista após desativar todos os plugins, me avise por aqui que vou escalar para nosso time técnico fazer uma análise mais profunda no log do servidor.\n\nFico no aguardo do seu retorno.\n\nAbraço,\n{{atendente}}\nSuporte TurboCloud`,
  },
];

const renderText = (text) => {
  const parts = text.split(/(\{\{[a-z_]+\}\})/g);
  return parts.map((p, i) =>
    /^\{\{[a-z_]+\}\}$/.test(p)
      ? <span key={i} style={cpStyles.varSpan}>{p}</span>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
};

function ContentPageStandalone() {
  // Pick the featured article (a01) as the demo content
  const a = ARTICLES.find((x) => x.id === 'a01') || ARTICLES[0];
  const cat = CATEGORIES.find((c) => c.id === a.cat);
  const tag = TAG_STYLES[a.tag];
  const [pinned, setPinned] = React.useState(true);
  const [copiedIdx, setCopiedIdx] = React.useState(-1);
  const [copiedAll, setCopiedAll] = React.useState(false);
  const related = ARTICLES.filter((x) => x.cat === a.cat && x.id !== a.id).slice(0, 5);

  // Sidebar navigates to home/category by linking back to the main app
  const navigate = (target) => {
    if (target.view === 'home') {
      window.location.href = 'TurboCloud Helpdesk.html';
    } else if (target.view === 'category') {
      window.location.href = 'TurboCloud Helpdesk.html#category-' + target.cat;
    } else if (target.view === 'article') {
      window.location.href = 'TurboCloud Helpdesk.html#article-' + target.article;
    }
  };
  const pinnedSet = new Set([a.id]);

  const copyBlock = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(-1), 1500);
  };
  const copyAll = () => {
    const all = RESPONSE_BLOCKS.map((b) => b.text).join('\n\n');
    navigator.clipboard?.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1800);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        view="article"
        selected={{ view: 'article', article: a.id, cat: a.cat }}
        onNavigate={navigate}
        pinned={pinnedSet}
        articles={ARTICLES}
      />
      <main style={{ flex: 1, minWidth: 0, position: 'relative' }}>
      <div style={cpStyles.topbar}>
        <div style={cpStyles.brand}>
          <span>Turbo<span style={cpStyles.brandLime}>Cloud</span></span>
          <span style={cpStyles.brandSlash}>/</span>
          <span style={cpStyles.brandSub}>Ajuda · Conteúdos</span>
        </div>
        <div style={cpStyles.topRight}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>v2.4.1</span>
          <div style={cpStyles.userChip}>
            <div style={cpStyles.avatar}>RM</div>
            <span style={{ color: '#fff', fontWeight: 600 }}>Renata Medeiros</span>
          </div>
        </div>
      </div>

      <div style={cpStyles.wrap}>
        <a style={cpStyles.back} href="TurboCloud Helpdesk.html">
          <Icon name="arrow-left" size={12} strokeWidth={2.4} />
          Voltar à base
        </a>

        <div style={{ height: 14 }}></div>

        <div style={cpStyles.grid}>
          <div style={cpStyles.main}>
            <div style={cpStyles.head}>
              <div style={cpStyles.metaRow}>
                <span style={cpStyles.catLink}>{cat.name}</span>
                <span style={{ color: 'var(--ink-4)' }}>·</span>
                <span style={cpStyles.tagChip(tag)}>{tag.label}</span>
                <span style={cpStyles.idChip}>#{a.id.toUpperCase()}</span>
                <button style={cpStyles.pinBtn(pinned)} onClick={() => setPinned((p) => !p)}>
                  <Icon name={pinned ? 'pin-fill' : 'pin'} size={13} />
                  {pinned ? 'Fixado' : 'Fixar'}
                </button>
              </div>
              <h1 style={cpStyles.title}>{a.title}</h1>
              <p style={cpStyles.desc}>
                Resposta-padrão pronta para copiar e colar no atendimento. Cada bloco pode ser copiado individualmente ou tudo de uma vez.
              </p>
            </div>

            {RESPONSE_BLOCKS.map((b, i) => {
              const isCopied = copiedIdx === i;
              return (
                <div key={i} style={cpStyles.blockSection}>
                  <div style={cpStyles.blockHeadRow}>
                    <div style={cpStyles.blockNum}>{i + 1}</div>
                    <div style={cpStyles.blockTitle}>{b.title}</div>
                    <span style={cpStyles.blockBadge}>{b.badge}</span>
                  </div>
                  <div style={cpStyles.blockBody}>
                    <button style={cpStyles.copyBtn(isCopied)} onClick={() => copyBlock(b.text, i)}>
                      <Icon name={isCopied ? 'check-circle' : 'copy'} size={11} strokeWidth={2.4} />
                      {isCopied ? 'Copiado' : 'Copiar'}
                    </button>
                    <div style={{ paddingRight: 80 }}>{renderText(b.text)}</div>
                  </div>
                </div>
              );
            })}

            <div style={cpStyles.finalRow}>
              <Icon name="sparkles" size={18} style={{ color: 'var(--purple-700)' }} />
              <div style={{ flex: 1, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--ink)' }}>Copiar resposta completa</strong>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Junta os 3 blocos, pronto para colar no atendimento.</div>
              </div>
              <button style={cpStyles.primaryBtn} onClick={copyAll}>
                <Icon name={copiedAll ? 'check-circle' : 'copy'} size={14} strokeWidth={2.4} />
                {copiedAll ? 'Copiado' : 'Copiar tudo'}
              </button>
            </div>
          </div>

          <aside style={cpStyles.side}>
            <div style={cpStyles.sideCard}>
              <div style={cpStyles.sideLabel}>Respostas relacionadas</div>
              <div>
                {related.map((r, i) => (
                  <div
                    key={r.id}
                    style={{ ...cpStyles.relatedItem, borderBottom: i === related.length - 1 ? 'none' : '1px solid var(--border)' }}
                  >
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', fontWeight: 600 }}>{r.id.toUpperCase()}</span>
                    <div style={{ marginTop: 2 }}>{r.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...cpStyles.sideCard, background: 'var(--purple-50)', borderColor: 'var(--purple-100)' }}>
              <div style={cpStyles.sideLabel}>Esse modelo resolveu?</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={cpStyles.feedbackBtn}><Icon name="thumbs-up" size={13} /> Sim</button>
                <button style={cpStyles.feedbackBtn}><Icon name="thumbs-down" size={13} /> Não</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      </main>
    </div>
  );
}

window.ContentPageStandalone = ContentPageStandalone;
