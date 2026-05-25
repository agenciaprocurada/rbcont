// Content page — canned responses to copy & paste

const artStyles = {
  root: { padding: '24px 28px 60px', maxWidth: 1280, margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'flex-start' },
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
    fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
  },
  tagChip: (s) => ({
    display: 'inline-flex', fontSize: 10, fontWeight: 700,
    padding: '4px 8px', borderRadius: 5,
    background: s.bg, color: s.fg,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    fontFamily: 'JetBrains Mono, monospace',
  }),
  title: { fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0, marginBottom: 10, lineHeight: 1.2 },
  desc: { fontSize: 13.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.55 },

  toneRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, marginBottom: 0 },
  toneLbl: { fontSize: 10.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' },
  toneChip: (active) => ({
    padding: '5px 10px', borderRadius: 6,
    border: '1px solid ' + (active ? 'var(--purple-600)' : 'var(--border)'),
    background: active ? 'var(--purple-700)' : '#fff',
    color: active ? '#fff' : 'var(--ink-2)',
    fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 5,
  }),

  varsBox: {
    marginTop: 16,
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 9,
    padding: 14,
  },
  varsLbl: { fontSize: 10.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 },
  varsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 },
  varField: { display: 'flex', flexDirection: 'column', gap: 4 },
  varKey: { fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'var(--purple-700)', fontWeight: 600 },
  varInput: {
    padding: '6px 9px',
    border: '1px solid var(--border)',
    borderRadius: 6,
    background: '#fff',
    fontFamily: 'inherit', fontSize: 12.5,
    color: 'var(--ink)', outline: 'none',
  },

  blockSection: { marginTop: 22 },
  blockHeadRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 8,
  },
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
    padding: '14px 16px 14px',
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
    display: 'flex', alignItems: 'center', gap: 10,
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
  channelRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 10px', borderRadius: 6,
    fontSize: 12.5, color: 'var(--ink-2)', cursor: 'pointer',
    border: '1px solid var(--border)',
    marginBottom: 6, fontWeight: 600,
  },
  metaList: {
    display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 12px',
    fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
  },
  metaKey: { fontSize: 10.5, fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  metaVal: { fontSize: 12, color: 'var(--ink-2)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 },
  relatedItem: {
    padding: '8px 0', borderBottom: '1px solid var(--border)',
    cursor: 'pointer', fontSize: 12.5, color: 'var(--ink-2)',
    lineHeight: 1.4, fontWeight: 500,
  },
  btn: {
    padding: '7px 12px', borderRadius: 7,
    border: '1px solid var(--border)', background: '#fff',
    fontSize: 12, fontWeight: 600, color: 'var(--ink-2)',
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    justifyContent: 'center',
  },
};

// Templates per article — formal/informal tone variants
const RESPONSE_TEMPLATES = {
  default: [
    {
      title: 'Saudação e reconhecimento',
      badge: 'Abertura',
      tpl: (v) => `Olá ${v.nome_cliente || '{{nome_cliente}}'},\n\nObrigado por entrar em contato com o suporte da TurboCloud. Identifiquei aqui que seu site ${v.site_url || '{{site_url}}'} está apresentando erro 500 após a instalação recente de um plugin no WordPress. Vamos resolver isso agora.`,
    },
    {
      title: 'Procedimento — passo a passo',
      badge: 'Diagnóstico',
      tpl: (v) => `Para identificar o plugin que está causando o problema, vou pedir que você:\n\n1. Acesse o painel TurboCloud em painel.turbocloud.com.br\n2. Vá em Sites → ${v.site_url || '{{site_url}}'} → WordPress → Plugins\n3. Desative o último plugin instalado (no seu caso: ${v.plugin || '{{plugin}}'})\n4. Atualize a página do site e verifique se voltou ao normal\n\nSe não voltar, repita o procedimento desativando os demais plugins um por um.`,
    },
    {
      title: 'Encerramento e próximos passos',
      badge: 'Conclusão',
      tpl: (v) => `Caso o erro persista após desativar todos os plugins, me avise por aqui que vou escalar para nosso time técnico fazer uma análise mais profunda no log do servidor.\n\nFico no aguardo do seu retorno.\n\nAbraço,\n${v.atendente || '{{atendente}}'}\nSuporte TurboCloud`,
    },
  ],
};

function ArticlePage({ selected, onNavigate, pinned, togglePin }) {
  const a = ARTICLES.find((x) => x.id === selected.article);
  if (!a) return null;
  const cat = CATEGORIES.find((c) => c.id === a.cat);
  const tag = TAG_STYLES[a.tag];
  const [tone, setTone] = React.useState('formal');
  const [vars, setVars] = React.useState({
    nome_cliente: 'João Silva',
    site_url: 'meusite.com.br',
    plugin: 'WooCommerce Subscriptions',
    atendente: 'Renata',
  });
  const [copiedIdx, setCopiedIdx] = React.useState(-1);
  const [copiedAll, setCopiedAll] = React.useState(false);
  const isPinned = pinned.has(a.id);
  const blocks = RESPONSE_TEMPLATES.default;
  const related = ARTICLES.filter((x) => x.cat === a.cat && x.id !== a.id).slice(0, 4);

  const setVar = (k, v) => setVars((p) => ({ ...p, [k]: v }));

  const copyBlock = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(-1), 1500);
  };
  const copyAll = () => {
    const all = blocks.map((b) => b.tpl(vars)).join('\n\n');
    navigator.clipboard?.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1800);
  };

  // Render text with {{var}} tokens highlighted
  const renderText = (text) => {
    const parts = text.split(/(\{\{[a-z_]+\}\})/g);
    return parts.map((p, i) =>
      /^\{\{[a-z_]+\}\}$/.test(p)
        ? <span key={i} style={artStyles.varSpan}>{p}</span>
        : <React.Fragment key={i}>{p}</React.Fragment>
    );
  };

  return (
    <div style={artStyles.root}>
      <div style={artStyles.grid}>
        <div style={artStyles.main}>
          <div style={artStyles.head}>
            <div style={artStyles.metaRow}>
              <span style={artStyles.catLink} onClick={() => onNavigate({ view: 'category', cat: cat.id })}>{cat.name}</span>
              <span style={{ color: 'var(--ink-4)' }}>·</span>
              <span style={artStyles.tagChip(tag)}>{tag.label}</span>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)', fontWeight: 600, marginLeft: 6 }}>#{a.id.toUpperCase()}</span>
              <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <button
                  style={{ ...artStyles.btn, background: isPinned ? 'var(--lime-bg)' : '#fff', borderColor: isPinned ? '#cee68a' : 'var(--border)', color: isPinned ? 'var(--lime-dark)' : 'var(--ink-2)' }}
                  onClick={() => togglePin(a.id)}
                >
                  <Icon name={isPinned ? 'pin-fill' : 'pin'} size={13} />
                  {isPinned ? 'Fixado' : 'Fixar'}
                </button>
                <button style={artStyles.btn}>
                  <Icon name="edit" size={13} /> Editar
                </button>
              </span>
            </div>
            <h1 style={artStyles.title}>{a.title}</h1>
            <p style={artStyles.desc}>
              Resposta-padrão pronta para copiar e colar no atendimento. Personalize as variáveis abaixo e copie cada bloco — ou tudo de uma vez.
            </p>

            <div style={artStyles.toneRow}>
              <span style={artStyles.toneLbl}>Tom</span>
              {['formal', 'informal', 'curto'].map((t) => (
                <span key={t} style={artStyles.toneChip(tone === t)} onClick={() => setTone(t)}>
                  {t === 'formal' ? 'Formal' : t === 'informal' ? 'Informal' : 'Curto'}
                </span>
              ))}
              <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <button style={artStyles.btn}>
                  <Icon name="message-circle" size={13} /> WhatsApp
                </button>
                <button style={artStyles.btn}>
                  <Icon name="mail" size={13} /> E-mail
                </button>
              </span>
            </div>

            <div style={artStyles.varsBox}>
              <div style={artStyles.varsLbl}>
                <Icon name="tag" size={11} /> Variáveis · preencha para personalizar
              </div>
              <div style={artStyles.varsGrid}>
                {Object.keys(vars).map((k) => (
                  <div key={k} style={artStyles.varField}>
                    <span style={artStyles.varKey}>{`{{${k}}}`}</span>
                    <input
                      style={artStyles.varInput}
                      value={vars[k]}
                      onChange={(e) => setVar(k, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RESPONSE BLOCKS */}
          {blocks.map((b, i) => {
            const rendered = b.tpl(vars);
            const isCopied = copiedIdx === i;
            return (
              <div key={i} style={artStyles.blockSection}>
                <div style={artStyles.blockHeadRow}>
                  <div style={artStyles.blockNum}>{i + 1}</div>
                  <div style={artStyles.blockTitle}>{b.title}</div>
                  <span style={artStyles.blockBadge}>{b.badge}</span>
                </div>
                <div style={artStyles.blockBody}>
                  <button style={artStyles.copyBtn(isCopied)} onClick={() => copyBlock(rendered, i)}>
                    <Icon name={isCopied ? 'check-circle' : 'copy'} size={11} strokeWidth={2.4} />
                    {isCopied ? 'Copiado' : 'Copiar'}
                  </button>
                  <div style={{ paddingRight: 80 }}>{renderText(rendered)}</div>
                </div>
              </div>
            );
          })}

          <div style={artStyles.finalRow}>
            <Icon name="sparkles" size={18} style={{ color: 'var(--purple-700)' }} />
            <div style={{ flex: 1, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45 }}>
              <strong style={{ color: 'var(--ink)' }}>Copiar resposta completa</strong>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Junta os 3 blocos com as variáveis preenchidas, pronto para colar.</div>
            </div>
            <button style={artStyles.primaryBtn} onClick={copyAll}>
              <Icon name={copiedAll ? 'check-circle' : 'copy'} size={14} strokeWidth={2.4} />
              {copiedAll ? 'Copiado para a área de transferência' : 'Copiar tudo'}
            </button>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={artStyles.side}>
          <div style={artStyles.sideCard}>
            <div style={artStyles.sideLabel}>Canal recomendado</div>
            <div style={artStyles.channelRow}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="message-circle" size={14} style={{ color: '#0d9488' }} /> WhatsApp Business</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>preferido</span>
            </div>
            <div style={artStyles.channelRow}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="mail" size={14} style={{ color: 'var(--purple-600)' }} /> E-mail</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>formal</span>
            </div>
          </div>

          <div style={artStyles.sideCard}>
            <div style={artStyles.sideLabel}>Detalhes</div>
            <div style={artStyles.metaList}>
              <span style={artStyles.metaKey}>Tempo</span>
              <span style={artStyles.metaVal}><Icon name="clock" size={12} /> {a.estimate}</span>
              <span style={artStyles.metaKey}>Usos</span>
              <span style={artStyles.metaVal}><Icon name="copy" size={12} /> {a.views.toLocaleString('pt-BR')}</span>
              <span style={artStyles.metaKey}>Atualizado</span>
              <span style={artStyles.metaVal}>{a.updated}</span>
              <span style={artStyles.metaKey}>Autor</span>
              <span style={artStyles.metaVal}>rmedeiros</span>
            </div>
          </div>

          <div style={artStyles.sideCard}>
            <div style={artStyles.sideLabel}>Respostas relacionadas</div>
            <div>
              {related.map((r, i) => (
                <div
                  key={r.id}
                  style={{ ...artStyles.relatedItem, borderBottom: i === related.length - 1 ? 'none' : '1px solid var(--border)' }}
                  onClick={() => onNavigate({ view: 'article', article: r.id })}
                >
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', fontWeight: 600 }}>{r.id.toUpperCase()}</span>
                  <div style={{ marginTop: 2 }}>{r.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...artStyles.sideCard, background: 'var(--purple-50)', borderColor: 'var(--purple-100)' }}>
            <div style={artStyles.sideLabel}>Esse modelo resolveu?</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ ...artStyles.btn, flex: 1 }}><Icon name="thumbs-up" size={13} /> Sim</button>
              <button style={{ ...artStyles.btn, flex: 1 }}><Icon name="thumbs-down" size={13} /> Não</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ArticlePage = ArticlePage;
