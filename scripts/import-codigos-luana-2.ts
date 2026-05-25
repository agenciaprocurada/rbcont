/**
 * Import #2 da compilação "Códigos Luana".
 * Cria 4 novas categorias e 22 artigos publicados (mais 1 em categoria existente).
 *
 * Uso:
 *   npx tsx scripts/import-codigos-luana-2.ts
 *
 * Idempotente: usa upsert por slug.
 */
import { PrismaClient, ArticleType, ArticleStatus } from '@prisma/client'

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'admin@turbocloud.com.br'

// ─── Novas categorias (ordem 20+ para não colidir) ────────────────────────────
const CATEGORIES = [
  {
    name: 'Prompts de IA',
    slug: 'prompts-ia',
    description: 'Prompts prontos para auditoria de código, design review, segurança e geração de imagem.',
    icon: '🤖',
    order: 20,
  },
  {
    name: 'Ferramentas e Recursos',
    slug: 'ferramentas-recursos',
    description: 'Bibliotecas de componentes, marketplaces de IA, geradores de prompt e ferramentas externas.',
    icon: '🔗',
    order: 21,
  },
  {
    name: 'DevOps e Workflow',
    slug: 'devops-workflow',
    description: 'Keep-alive de Supabase, multi-projetos no Antigravity, migração de stack e workflow com agentes IA.',
    icon: '⚙️',
    order: 22,
  },
  {
    name: 'Segurança e Boas Práticas',
    slug: 'seguranca-boas-praticas',
    description: 'Templates de SECURITY.md, CLAUDE.md e diretrizes de execução segura para projetos com IA.',
    icon: '🛡️',
    order: 23,
  },
]

interface ArticleSeed {
  title: string
  slug: string
  type: ArticleType
  categorySlug: string
  excerpt: string
  content: string
  featured?: boolean
}

const ARTICLES: ArticleSeed[] = [
  // ───────────────────────── DEVOPS E WORKFLOW ───────────────────────────────
  {
    title: 'Keep-alive do Supabase com GitHub Actions (não pausar o projeto)',
    slug: 'supabase-keep-alive-github-actions',
    type: 'TEXT',
    categorySlug: 'devops-workflow',
    featured: true,
    excerpt: 'Workflow do GitHub Actions que faz um SELECT diário no Supabase para impedir que o projeto entre em pausa por inatividade.',
    content: `<h2>Por que isso é necessário</h2>
<p>Projetos Supabase no plano Free entram em pausa após 7 dias sem atividade. Quando isso acontece, conexões caem e você precisa reativar manualmente. Um cron diário simples resolve.</p>

<h2>1. Tabela keep_alive (SQL setup)</h2>
<p>Arquivo: <code>.github/workflows/keep_alive_setup.sql</code></p>
<pre><code>CREATE TABLE IF NOT EXISTS keep_alive (
  id BIGSERIAL PRIMARY KEY,
  pinged_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO keep_alive (pinged_at) VALUES (NOW()) ON CONFLICT DO NOTHING;

-- RLS com política de leitura pública (ninguém pode escrever)
ALTER TABLE keep_alive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON keep_alive
    FOR SELECT TO anon, authenticated USING (true);</code></pre>

<h2>2. Workflow do GitHub Actions</h2>
<p>Arquivo: <code>.github/workflows/supabase-keepalive.yml</code></p>
<pre><code>name: Supabase Keep-Alive

on:
  schedule:
    # Todo dia às 10h BRT (13h UTC)
    - cron: '0 13 * * *'
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase REST
        run: |
          curl -s -f \\
            -H "apikey: \${{ secrets.SUPABASE_ANON_KEY }}" \\
            -H "Authorization: Bearer \${{ secrets.SUPABASE_ANON_KEY }}" \\
            "\${{ secrets.SUPABASE_URL }}/rest/v1/keep_alive?select=id&limit=1"</code></pre>

<h2>3. Secrets do GitHub</h2>
<p>Em <strong>Settings &gt; Secrets and variables &gt; Actions</strong>, cadastre:</p>
<ul>
  <li><strong>SUPABASE_URL</strong>: ex. <code>https://abcdefgh.supabase.co</code></li>
  <li><strong>SUPABASE_ANON_KEY</strong>: a chave pública anon (não a service_role!)</li>
</ul>

<h2>Como funciona</h2>
<p>Todo dia às 10h o GitHub Actions faz um GET no REST do Supabase, lê 1 linha da tabela e devolve. Isso é suficiente para o Supabase considerar como atividade e não pausar o projeto.</p>

<h2>Por que usar a anon key (e não service_role)</h2>
<p>O cron precisa apenas de leitura. Usar service_role no GitHub Secret seria exagero de privilégio — se o secret vazar, você perde o banco inteiro. A anon key só vê o que a RLS permite (no caso, ler keep_alive).</p>`,
  },
  {
    title: 'Como migrar uma aplicação do Replit para Vercel + Supabase',
    slug: 'migrar-replit-vercel-supabase',
    type: 'TEXT',
    categorySlug: 'devops-workflow',
    excerpt: 'Passo a passo das 6 fases: extração do código, GitHub, schema, dados, ajuste de hash de senha e deploy na Vercel.',
    content: `<h2>Visão geral</h2>
<p>A migração tem 6 fases. A mais crítica é a Fase 5 (ajuste de criptografia de senhas) — pular pode quebrar o login de todos os usuários.</p>

<h2>📦 Fase 1 — Extrair o código do Replit</h2>
<ol>
  <li>Painel do projeto no Replit.</li>
  <li>Menu superior direito &gt; <strong>Library &gt; File Tree</strong>.</li>
  <li>Ícone de opções (três pontos) &gt; <strong>Download as Zip</strong>.</li>
  <li>Descompactar localmente.</li>
</ol>

<h2>🐙 Fase 2 — Versionamento no GitHub (via Antigravity)</h2>
<ol>
  <li>Abra o Antigravity &gt; <strong>New Window</strong> e selecione a pasta descompactada.</li>
  <li>Crie um novo repositório no GitHub.</li>
  <li>Inicialize o Git, faça commit e push.</li>
</ol>

<h2>🏗️ Fase 3 — Migrar a estrutura do banco (schema)</h2>
<ol>
  <li>Crie um novo projeto no Supabase.</li>
  <li>No Antigravity, localize o arquivo de schema do projeto Replit.</li>
  <li>Peça ao Antigravity para gerar o SQL compatível com PostgreSQL.</li>
  <li>No <strong>SQL Editor</strong> do Supabase, cole e clique <strong>Run</strong>.</li>
</ol>

<h2>📥 Fase 4 — Exportar e importar dados (records)</h2>
<ol>
  <li>No Replit, abra a aba <strong>Database</strong>.</li>
  <li><strong>⚠️ CRÍTICO:</strong> mude a visualização para <strong>Production Database</strong>.</li>
  <li>Vá em <strong>My Data</strong>, selecione cada tabela, três pontos &gt; <strong>Export all to CSV</strong>.</li>
  <li>No Supabase, vá em <strong>Table Editor</strong>, selecione a tabela correspondente e clique <strong>Import Data</strong> para subir o CSV.</li>
</ol>

<h2>🔐 Fase 5 — Ajuste de criptografia de senhas (não pule)</h2>
<p><strong>Problema:</strong> O Replit salva senhas com <code>bcrypt</code>. O sistema novo pode exigir <code>scrypt</code> (padrão do Supabase Auth).</p>
<p><strong>Solução:</strong> Peça ao Antigravity para gerar um script SQL (ou função no backend) que converta as credenciais da tabela <code>user</code> de bcrypt para scrypt. Sem isso, ninguém consegue logar depois da migração.</p>

<h2>🚀 Fase 6 — Deploy na Vercel</h2>
<ol>
  <li>Painel da Vercel &gt; <strong>Add New... &gt; Project</strong>.</li>
  <li>Importe o repositório do GitHub criado na Fase 2.</li>
  <li>Adicione as <strong>Environment Variables</strong> do Supabase (URL e chaves).</li>
  <li><strong>Deploy</strong>. Pronto — sua aplicação está rodando na nova stack.</li>
</ol>

<h2>Validação pós-migração</h2>
<ul>
  <li>Confira contagem de registros: <code>SELECT COUNT(*) FROM tabela</code> no Supabase deve bater com Replit.</li>
  <li>Teste login com pelo menos 3 usuários diferentes (1 admin, 2 comuns).</li>
  <li>Mantenha o projeto Replit ativo por 7-14 dias como fallback antes de cancelar.</li>
</ul>`,
  },
  {
    title: 'Rodar múltiplos projetos em paralelo no Antigravity (resolver conflito de portas)',
    slug: 'antigravity-multiplos-projetos-portas',
    type: 'TEXT',
    categorySlug: 'devops-workflow',
    excerpt: 'Quando você roda 2+ projetos no Antigravity, todos tentam usar a porta 3000. Veja como atribuir portas únicas e organizar o terminal.',
    content: `<h2>O problema</h2>
<p>Ao desenvolver vários projetos simultaneamente, o segundo <code>npm run dev</code> falha porque a porta 3000 já está em uso. Para rodar 3+ projetos em paralelo, especifique uma porta única por projeto.</p>

<h2>1. Comandos diretos no terminal</h2>
<p>Use <code>--</code> para passar argumentos do npm para o script subjacente:</p>
<ul>
  <li><strong>Next.js:</strong> <code>npm run dev -- -p 3001</code></li>
  <li><strong>Vite (React/Vue):</strong> <code>npm run dev -- --port 3002</code></li>
  <li><strong>CRA (React Windows/PowerShell):</strong> <code>$env:PORT=3003; npm run dev</code></li>
</ul>

<h2>2. Configuração fixa (recomendado)</h2>
<p>Edite o <code>package.json</code> de cada projeto na seção <code>"scripts"</code>:</p>
<pre><code>// Projeto 2
"dev": "next dev -p 3001"
// ou para Vite:
"dev": "vite --port 3001"

// Projeto 3
"dev": "next dev -p 3002"
// ou:
"dev": "vite --port 3002"</code></pre>

<h2>3. Workflow no Antigravity (terminal dividido)</h2>
<p>Como o Antigravity é baseado no VS Code:</p>
<ol>
  <li>Abra o terminal integrado.</li>
  <li>Use <strong>Split Terminal</strong> (Dividir Terminal) para criar 3 colunas lado a lado.</li>
  <li>Execute <code>npm run dev</code> em cada coluna.</li>
</ol>
<p>Você visualiza todos os logs de erro e requisições simultaneamente sem precisar trocar de aba.</p>

<h2>Dica de organização</h2>
<p>Se estiver fazendo apps em Flutter e Web ao mesmo tempo, lembre que o simulador Android e o servidor Web rodam em processos independentes — não conflitam de porta entre si.</p>

<h2>Pegadinha das portas comuns</h2>
<p>Evite usar portas já reservadas por outros serviços que você pode ter rodando:</p>
<ul>
  <li><strong>3000</strong>: padrão Next.js, CRA, Express</li>
  <li><strong>5173</strong>: padrão Vite</li>
  <li><strong>8080</strong>: jBoss, HTTP alternativo</li>
  <li><strong>5432</strong>: Postgres local</li>
  <li><strong>27017</strong>: MongoDB local</li>
</ul>
<p>Faixa segura para projetos paralelos: 3001-3099.</p>`,
  },
  {
    title: 'Elite Dev Workflow: automação de desenvolvimento com agentes de IA',
    slug: 'elite-dev-workflow-agentes-ia',
    type: 'TEXT',
    categorySlug: 'devops-workflow',
    featured: true,
    excerpt: 'Guia completo (12 seções) de como estruturar um workflow profissional com Claude Code: separação de agentes, threat models, verificação goal-backward, skills e hooks.',
    content: `<h2>Sobre este guia</h2>
<p>Documento sintetizado da análise de projetos de referência (vinext da Cloudflare, pretext do chenglou, ui-ux-pro-max-skill, get-shit-done do gsd-build). Cobre o workflow completo de desenvolvimento assistido por IA.</p>

<h2>1. Princípio central: separação de responsabilidades entre agentes</h2>
<p>O padrão mais importante é <strong>nunca deixar o mesmo agente planejar, executar e verificar</strong>. Quem escreve código não pode auditar o próprio trabalho de forma confiável.</p>
<pre><code>DISCUSSÃO → PLANEJAMENTO → PRÉ-VÔLO → EXECUÇÃO → VERIFICAÇÃO → AUDITORIA
   ↓             ↓             ↓          ↓           ↓             ↓
CONTEXT.md   PLAN.md       revisão   SUMMARY.md  VERIFY.md  SECURITY_AUDIT.md</code></pre>

<h3>Agentes especializados (modelo GSD)</h3>
<ul>
  <li><strong>planner</strong> — quebra a feature em tarefas com modelo de ameaças. Produz threat model com IDs antes de qualquer código.</li>
  <li><strong>plan-checker</strong> — revisa PLAN.md por lacunas. Gate obrigatório — execução bloqueada sem aprovação.</li>
  <li><strong>executor</strong> — implementa o plano. Registra "Threat Flags" no SUMMARY.md quando descobre nova superfície de ataque.</li>
  <li><strong>verifier</strong> — verifica o que deveria ser verdade, não o que foi feito. Não confia no SUMMARY.md — vai de trás para frente a partir do objetivo.</li>
  <li><strong>security-auditor</strong> — confirma que mitigações do PLAN.md existem no código. Read-only.</li>
</ul>

<h2>2. AGENTS.md / CLAUDE.md como manual operacional</h2>
<p>Todo repositório de referência usa um markdown como superfície primária de instrução. O AGENTS.md do vinext tem 32KB — cobre cada aspecto de como um agente deve trabalhar naquele codebase.</p>

<h2>3. Threat Model no planejamento (não na auditoria posterior)</h2>
<p>O GSD modela ameaças <strong>antes</strong> de escrever código, no PLAN.md. Template:</p>
<pre><code>| ID | Ameaça                          | Mitigação                                    |
|----|---------------------------------|----------------------------------------------|
| T1 | Forjar user_id no body          | Validar via supabase.auth.getUser()          |
| T2 | Chamar sem autenticação         | JWT obrigatório, retornar 401                |
| T3 | Race condition em pagamento     | SELECT FOR UPDATE dentro de transação        |
| T4 | Replay de webhook               | Verificar timestamp, janela ≤10 min          |
| T5 | CPF inválido enviado ao gateway | Validar formato + checksum mod 11            |</code></pre>

<h2>4. Verificação Goal-Backward</h2>
<p>O verifier pergunta: "<strong>O que deve ser VERDADE para o objetivo estar alcançado?</strong>" — não "executamos os passos?".</p>
<p>Checklist em 3 dimensões:</p>
<ul>
  <li><strong>O que deve EXISTIR</strong>: arquivos, JWT, IDOR check, validação, audit log.</li>
  <li><strong>O que deve ser VERDADE</strong>: não dá pra forjar user_id, não dá pra chamar sem token, não dá pra replay.</li>
  <li><strong>O que deve estar CONECTADO</strong>: rota no frontend, tipos exportados/importados, env vars documentadas.</li>
</ul>

<h2>5. Session State Persistence (solução para "context rot")</h2>
<p>À medida que o contexto cresce, a qualidade degrada. A solução é <strong>escrever estado em disco</strong>, não manter em contexto.</p>
<pre><code>.plans/
  CONTEXT.md          ← decisões da discussão
  PLAN.md             ← plano + threat model
  SUMMARY.md          ← o que foi feito + threat flags
  VERIFICATION.md     ← resultado da verificação
  SECURITY_AUDIT.md   ← status de cada mitigação</code></pre>
<p><strong>Regra:</strong> ao iniciar nova sessão, ler esses arquivos antes de qualquer coisa.</p>

<h2>6. Estrutura de skill (padrão Claude Code)</h2>
<pre><code>.claude/skills/[nome-da-skill]/
  skill.json          ← manifest: name, displayName, version
  CLAUDE.md           ← manual operacional da skill
  src/
    data/             ← bases de conhecimento
    scripts/          ← ferramentas executáveis</code></pre>

<h2>7. Targeted Testing (não rodar a suite inteira)</h2>
<p>Mapeamento explícito de "arquivo alterado → quais testes rodar". Mantém feedback loop curto.</p>
<pre><code>supabase/functions/create-order/   → npm test -- order
supabase/functions/asaas-webhook/  → npm test -- webhook
src/hooks/useCart*                  → npm test -- cart
src/components/checkout/            → npm test -- checkout</code></pre>

<h2>8. Hooks (Claude Code)</h2>
<p>Em <code>.claude/settings.json</code>:</p>
<pre><code>{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "bash .claude/hooks/workflow-guard.sh" }] }
    ],
    "PostToolUse": [
      { "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "bash .claude/hooks/security-lint.sh" }] }
    ]
  }
}</code></pre>

<h3>Hooks prioritários</h3>
<ul>
  <li><strong>security-lint</strong> — após Edit/Write em edge function, verifica JWT check, IDOR check, CORS import.</li>
  <li><strong>workflow-guard</strong> — antes de qualquer Bash, bloqueia comandos destrutivos.</li>
  <li><strong>validate-commit</strong> — antes de git commit, valida mensagem e impede .env staged.</li>
  <li><strong>context-monitor</strong> — alerta quando contexto &gt; 60%, sugere salvar estado.</li>
</ul>

<h2>9. Pre-delivery checklist</h2>
<p>Antes de fechar PR — segurança, qualidade, banco, frontend. Quando há código sensível (auth, pagamento, upload), nunca pular.</p>

<h2>10. Comandos sugeridos (fluxo completo)</h2>
<pre><code># 1. Mapear codebase (uma vez)
/map-codebase

# 2. Discutir feature
/discuss-feature [nome]      → .plans/CONTEXT.md

# 3. Planejar com threat model
/plan-feature [nome]         → .plans/PLAN.md

# 4. Executar
/execute-feature [nome]      → .plans/SUMMARY.md

# 5. Verificar (goal-backward)
/verify-feature [nome]       → .plans/VERIFICATION.md

# 6. Auditar segurança
/audit-security [nome]       → .plans/SECURITY_AUDIT.md</code></pre>

<h2>11. Ferramentas recomendadas</h2>
<ul>
  <li><strong>Testes:</strong> Vitest — rápido, ESM nativo.</li>
  <li><strong>Linting:</strong> oxlint — mais rápido que ESLint, type-aware.</li>
  <li><strong>Smoke tests:</strong> script bash que chama cada edge function após deploy e valida HTTP 200.</li>
  <li><strong>CI:</strong> GitHub Actions com checks sem secrets separados de deploys.</li>
</ul>

<h2>12. Instalação do GSD</h2>
<pre><code>npx get-shit-done-cc
# Selecionar: antigravity + vscode
# Instala hooks, comandos /gsd-*, agentes especializados</code></pre>

<h2>Próximos passos sugeridos</h2>
<ol>
  <li>Instalar GSD via <code>npx get-shit-done-cc</code>.</li>
  <li>Criar AGENTS.md com mapeamento arquivo→teste.</li>
  <li>Criar diretório <code>.plans/</code> para persistir estado.</li>
  <li>Implementar hook <code>validate-commit</code> que impede commit de .env.</li>
  <li>Criar skill <code>edge-function-scaffold</code> com padrões de segurança.</li>
  <li>Criar template de threat model como pré-requisito para features críticas.</li>
</ol>`,
  },

  // ───────────────────────── PROMPTS DE IA ───────────────────────────────────
  {
    title: 'Prompt de auditoria: Performance, Segurança e Arquitetura em 5 etapas (Lucas Montano)',
    slug: 'prompt-auditoria-performance-seguranca-lucas-montano',
    type: 'TEXT',
    categorySlug: 'prompts-ia',
    featured: true,
    excerpt: 'Prompt de Engenheiro Sênior para análise de código Next.js + React + Supabase — N+1, race conditions, memory leaks, supply chain e tradeoffs arquiteturais.',
    content: `<h2>De onde vem</h2>
<p>Prompt baseado nas dicas do Lucas Montano em <a href="https://www.youtube.com/watch?v=T9V7EyB_B9w" target="_blank" rel="noreferrer noopener">"Vibe Coding"</a>. Útil para qualquer projeto Next.js + React + Supabase.</p>

<h2>O prompt completo</h2>
<pre><code>Atue como um Engenheiro de Software Sênior especializado em Performance
e Confiabilidade (foco em Next.js, React e Supabase).

Analise o código do meu projeto seguindo os pilares de "Vibe Coding"
do Lucas Montano. Realize a análise em 5 ETAPAS consecutivas.

⚠️ REGRAS CRÍTICAS DE SEGURANÇA:

Você está proibido de deletar arquivos sem autorização explícita.

Se identificar que um arquivo deve ser removido, NÃO delete.
Apenas liste o arquivo e explique o motivo para decidirmos juntos depois.

Nunca gere comandos que limpem tabelas ou deletem dados do banco.

ETAPA 1: Detector de N+1 (Banco de Dados)
Verifique loops, mapeamentos ou funções assíncronas que realizam
múltiplas chamadas ao Supabase/DB dentro de iterações. Sugira como
converter essas chamadas em joins ou selects em lote (bulk).

ETAPA 2: Race Conditions &amp; Concorrência
Analise funções assíncronas críticas (especialmente fluxos de pagamento,
estoque ou contadores). Verifique se há risco de duas requisições
simultâneas causarem inconsistência. Sugira o uso de Transações ou RPCs
no banco de dados, se necessário.

ETAPA 3: Memory Leaks &amp; Resource Management
No frontend (React), procure por useEffect sem funções de limpeza,
intervalos não limpos ou manipulação excessiva de estados globais que
possam travar a aba do usuário. No backend, verifique processos que
possam segurar memória desnecessariamente.

ETAPA 4: Segurança &amp; "Supply Chain"
Identifique chaves de API expostas ou variáveis de ambiente no lado
do cliente.
Verifique se as dependências no package.json estão com versões fixas
(pinning) para evitar ataques de supply chain.

ETAPA 5: Tradeoffs Arquiteturais
Para as soluções propostas nas etapas anteriores, liste:
"O que ganhamos" vs. "O que deixamos na mesa"
(ex: complexidade vs. performance).</code></pre>

<h2>Como usar</h2>
<ol>
  <li>Cole o prompt acima no Claude Code, Cursor ou similar.</li>
  <li>O agente vai te entregar análise por etapa, não tudo de uma vez.</li>
  <li>Para cada sugestão, peça exemplo de código antes de aplicar.</li>
</ol>

<h2>Por que funciona bem</h2>
<p>Forçar etapas separadas evita o "tudo ao mesmo tempo" — o agente entrega análise profunda em cada dimensão antes de pular para a próxima. A regra de não deletar dá segurança para rodar em projeto real.</p>`,
  },
  {
    title: 'Prompt para upscale/recuperação de fotos em baixa resolução (Gemini/Grok)',
    slug: 'prompt-upscale-recuperacao-foto-gemini',
    type: 'TEXT',
    categorySlug: 'prompts-ia',
    excerpt: 'Prompt detalhado para preservar identidade, geometria facial e fundo original ao fazer upscale de retratos — testado e ajustado para Gemini e Grok.',
    content: `<h2>Observações importantes</h2>
<ul>
  <li>O resultado varia muito entre IAs (datasets diferentes).</li>
  <li><strong>Funciona bem em:</strong> Grok, Gemini.</li>
  <li><strong>Não recomendado em:</strong> GPT (resultado pior).</li>
  <li>Não faz milagre — sirva como ponto de partida, vá testando.</li>
</ul>

<h2>O prompt completo</h2>
<pre><code>Enhance and upscale the portrait while strictly preserving the
subject's exact identity, facial geometry, expression, and unique
features. Do not change face shape, expression, eye color, skin
tone, hairstyle, clothing, pose, accessories, or any detail that
defines who they are. Only allow extremely subtle feature cleanup
for realism.

Use the attached reference image as the absolute base: keep the
exact same background, environment, composition, framing, angle,
and layout with zero replacements, zero shifts, zero new objects,
and zero alterations. The environment and background must look
100% identical to the reference.

Recreate the entire image as if it was shot on a Sony A1 full-frame
camera with an 85mm f/1.4 GM lens at f/1.6, ISO 100, 1/200s shutter
speed. Mandatory Sony A1 + 85mm f/1.4 setup. Cinematic shallow
depth of field with perfect sharp facial focus and natural bokeh
that respects the original background elements. Editorial-neutral
color profile with Sony color science.

Lighting must match the exact direction, angle, and mood of the
reference photo, but upgraded to premium cinematic, subject-focused
quality: soft directional key light, warm highlights, cool natural
shadows, deeper contrast, expanded dynamic range, micro-contrast
boost, smooth gradations, and zero harsh shadows or hotspots.

Maintain neutral premium color tone, cinematic contrast curve,
natural saturation, hyper-realistic skin texture with visible pores
and micro-details (never plastic or waxy), real fabric and hair
strand texture, and subtle film grain. Premium clarity with no fake
glow, no oversmoothing, no runway lighting, no flat lighting.

Render in true 4K resolution (portrait crop), 10-bit color,
ultra-photorealistic cinematic editorial style with maximum detail
retention. Improve realism, depth, micro-texture, and
three-dimensionality of the subject while keeping identity and
background fully preserved and untouched.

*NEGATIVE PROMPT:*
No new background, no background changes, no layout shifts, no face
morphing, no expression changes, no altered pose or clothing, no
distorted proportions, no fake glow, no plastic skin, no
oversmoothing, no AI artifacts, no overly dramatic lighting, no
flat lighting, no extra objects, no style filters.</code></pre>

<h2>Versão JSON (para fotos nativas P&amp;B)</h2>
<p>Para preservar a consistência em fotos originalmente em preto e branco, derive este prompt em estrutura JSON antes de enviar. Mantém o mesmo nível de fidelidade sem o agente "colorir por engano".</p>

<h2>Dicas para melhores resultados</h2>
<ul>
  <li>Sempre anexe a imagem original como referência — o prompt fala explicitamente "use the attached reference image as the absolute base".</li>
  <li>Para edições mínimas, ajuste a frase "extremely subtle feature cleanup" para "no cleanup at all".</li>
  <li>Se o resultado mudou roupa/acessório, reforce: "DO NOT change clothing or jewelry under any circumstances."</li>
</ul>`,
  },
  {
    title: 'Prompt para reduzir consumo de tokens no Claude Code',
    slug: 'prompt-reduzir-tokens-claude',
    type: 'TEXT',
    categorySlug: 'prompts-ia',
    excerpt: 'Pede ao Claude Code para criar .claudeignore, compactar CLAUDE.md, limpar MEMORY.md e verificar worktrees abandonadas. Sempre confirma antes de aplicar.',
    content: `<h2>Para que serve</h2>
<p>Sessões longas no Claude Code consomem muitos tokens porque o agente lê CLAUDE.md, MEMORY.md, node_modules acidentalmente, etc. Este prompt limpa as 4 maiores fontes de desperdício.</p>

<h2>O prompt</h2>
<pre><code>Quero otimizar o uso de tokens neste projeto sem perder qualidade.

Faça o seguinte:

1. **Crie .claudeignore** na raiz excluindo:
   node_modules/, dist/, build/, .next/, *.lock, *.log, .cache/,
   public/icons/, backups/, .env*, *.key, *.pem, e qualquer
   diretório de build/binários irrelevante para o código.

2. **Compacte o CLAUDE.md** (se existir): converta prosa em bullets
   curtos, remova redundâncias óbvias, mantenha todas as regras e
   restrições. Meta: menos de 50 linhas sem perder nenhuma instrução.

3. **Enxugue o MEMORY.md** (se existir em ~/.claude/projects/...):
   remova Session Notes antigas, detalhes de features já implementadas
   que não mudam seu comportamento, e histórico de debugging
   resolvido. Mantenha apenas: configuração ativa, lições aprendidas,
   feedback de comportamento, e referências externas úteis.

4. **Verifique worktrees** (git worktree list): se houver worktrees
   dentro do projeto cujos branches já foram mergeados, remova-os
   com segurança.

Antes de aplicar qualquer mudança, mostre um resumo do que será
feito e aguarde confirmação.</code></pre>

<h2>O que cada item economiza</h2>
<ul>
  <li><strong>.claudeignore</strong>: o maior ganho. Sem ele, o agente pode acidentalmente abrir <code>package-lock.json</code> (30k+ linhas) ou enumerar <code>node_modules/</code>.</li>
  <li><strong>CLAUDE.md compacto</strong>: lido a cada turno. Cada linha economizada é multiplicada por toda a sessão.</li>
  <li><strong>MEMORY.md limpo</strong>: idem — também lido a cada turno em projetos persistentes.</li>
  <li><strong>Worktrees</strong>: cada worktree extra pode duplicar o tamanho efetivo do projeto.</li>
</ul>

<h2>Quando rodar</h2>
<ul>
  <li>Toda vez que terminar uma feature grande.</li>
  <li>Quando notar respostas mais lentas que o normal.</li>
  <li>Antes de iniciar uma nova fase do projeto.</li>
</ul>

<h2>Aviso</h2>
<p>Esse prompt ainda não foi exaustivamente testado em produção. Sempre revise o que o agente sugere antes de confirmar — especialmente o que ele propõe remover do MEMORY.md.</p>`,
  },
  {
    title: 'Prompt de Vibecoding Seguro: diretrizes anti-invasão (Zero Trust)',
    slug: 'prompt-vibecoding-seguro-anti-invasao',
    type: 'TEXT',
    categorySlug: 'prompts-ia',
    excerpt: 'System prompt para forçar o agente a gerar código com Zero Trust, defesa em profundidade, prevenção OWASP, IAM correto e proteção contra abuso.',
    content: `<h2>Para que serve</h2>
<p>Cola este prompt como instrução de sistema (em CLAUDE.md, instruções do Cursor, etc.). O agente passa a tratar segurança como requisito não-negociável, não como afterthought.</p>

<h2>O prompt</h2>
<pre><code># Diretrizes Absolutas de Segurança para Geração de Código

Você é uma Inteligência Artificial atuando como um Engenheiro de
Software Especialista em Segurança da Informação (AppSec). Todo e
qualquer código, arquitetura ou sistema gerado por você DEVE seguir
estritamente as diretrizes abaixo para mitigar todos os tipos de
invasão e vulnerabilidades.

Seu objetivo é gerar sistemas com *Zero Trust* e *Defesa em
Profundidade*.

## 1. Regras Fundamentais de Arquitetura e Prompting

- **Defesa em Profundidade:** Assuma que toda camada da aplicação
  pode ser comprometida. Implemente validações independentes no
  Frontend, no Backend e no Banco de Dados.
- **Test-Driven Development focado em Segurança:** Antes de
  implementar lógicas complexas, proponha e escreva testes de
  integração automatizados que cubram cenários de ataque (envio de
  payloads maliciosos, concorrência, acessos indevidos).
- **Red Team Interno:** Após gerar bloco de código crítico,
  analise-o assumindo a perspectiva de um atacante. Procure
  ativamente por falhas e corrija-as antes de finalizar a resposta.

## 2. Prevenção de Falhas Comuns (OWASP Top 10)

- **Gestão de Segredos (Crucial):** NENHUMA credencial, chave de
  API, token ou variável de ambiente deve ser inserida no
  código-fonte em hipótese alguma (.env apenas).
- **Condições de Corrida:** Todas as operações financeiras, de
  estado de usuário (likes, compras, saques) e validações críticas
  devem usar *operações atômicas, *locks no banco de dados
  (ex: FOR UPDATE) e transações seguras.
- **Validação e Sanitização de Input:** Todo input de usuário é
  malicioso até que se prove o contrário. Estabeleça limites
  rígidos de tamanho e tipagem em TODAS as rotas e colunas. Nunca
  confie apenas na validação do Frontend.
- **Upload de Arquivos:** Valide o MIME Type, cheque os Magic Bytes
  do arquivo de forma estrita no servidor e limite o tamanho
  máximo. Proíba a execução de scripts em diretórios de upload.
- **SSRF e URLs Externas:** Se o sistema aceitar URLs (ex: para
  imagens de perfil), bloqueie requisições para redes
  locais/internas, restrinja domínios permitidos e descarte
  parâmetros excessivamente grandes nas Queries.

## 3. Autenticação e Controle de Acesso (IAM)

- **Não reinvente a roda:** Priorize integrações com provedores
  robustos (Auth0, Supabase Auth, Firebase) em vez de construir
  login do zero, a menos que solicitado.
- Se for construir do zero: use Argon2 para hash de senhas.
- **Zero Enumeração:** Evite mensagens de erro que revelem a
  existência de um usuário. Substitua "E-mail não cadastrado" por
  "Se o e-mail existir, um link de recuperação foi enviado".
- **IDOR / Broken Access Control:** Todo endpoint que manipula
  recursos DEVE verificar explicitamente no Backend se o usuário
  autenticado é o dono legítimo ou possui as roles necessárias.
- **Tokens:** Exija regras de revogação de JWT (blacklists ou
  expiração curta com Refresh Tokens) e armazenamento seguro
  (Cookies HTTP-Only).

## 4. Lógica de Negócios e Rate Limiting

- **Anti-Abuso:** Implemente limites rigorosos por IP e por
  Usuário, com lockout temporário em endpoints sensíveis (login,
  recuperação de senha, pagamentos).
- **Honeypots:** Considere adicionar rotas falsas (ex:
  /admin-panel oculto) ou campos invisíveis que, se preenchidos,
  banem imediatamente o IP do atacante.
- **Consistência Financeira:** Crie amarras fortes contra lógicas
  circulares (ex: comprar + receber comissão de afiliado +
  reembolsar = lucro). Exija revisão humana ou delay temporal
  para saques e estornos.</code></pre>

<h2>Vídeo de referência</h2>
<p><a href="https://www.youtube.com/watch?v=4DzMbBYXa7M" target="_blank" rel="noreferrer noopener">YouTube — Proteção e segurança contra invasão</a></p>

<h2>Como usar no projeto</h2>
<ol>
  <li>Cole o prompt no <code>CLAUDE.md</code> da raiz do projeto.</li>
  <li>Em Cursor/Windsurf, cole nas "Custom Instructions".</li>
  <li>Para projetos críticos (pagamento, auth, saúde), combine com o "Prompt de Auditoria de Segurança para SaaS".</li>
</ol>`,
  },
  {
    title: 'Prompt de Design Review: 5 Leis de UX (Fitts, Hick, Miller, Doherty, Postel)',
    slug: 'prompt-design-review-5-leis-ux',
    type: 'TEXT',
    categorySlug: 'prompts-ia',
    excerpt: 'Prompt para fazer agentes IA revisarem a UX da sua tela em 5 dimensões: alvos clicáveis, quantidade de opções, agrupamento, velocidade percebida e tolerância de input.',
    content: `<h2>O que cada lei trata</h2>
<ul>
  <li><strong>Lei de Fitts</strong>: tempo de clique é proporcional à distância e inversamente ao tamanho do alvo. (Botões pequenos = lentos = frustrantes.)</li>
  <li><strong>Lei de Hick</strong>: tempo de decisão cresce com a quantidade de opções. (Menos é mais.)</li>
  <li><strong>Lei de Miller</strong>: memória de curto prazo suporta ~7 ± 2 itens. (Agrupamento e categorização ajudam.)</li>
  <li><strong>Limiar de Doherty</strong>: usuário desengaja após ~400ms sem feedback. (Skeletons, optimistic UI.)</li>
  <li><strong>Lei de Postel</strong>: "seja conservador no que envia, liberal no que aceita". (Sanitize inputs para o usuário, não obrigue ele.)</li>
</ul>

<h2>O prompt</h2>
<pre><code># Design Review — 5 Laws of UX

Analise a tela atual do meu app e me dê feedback baseado nestas
5 técnicas:

## 1. Alvos Clicáveis (Lei de Fitts)
- Os botões de ação principal têm pelo menos 44px de altura no mobile?
- A hit area dos ícones é generosa ou apertada?
- O CTA principal está em posição de fácil alcance (zona do polegar
  no mobile)?

## 2. Quantidade de Opções (Lei de Hick)
- Quantos itens estão visíveis no primeiro nível de navegação?
- Existem mais de 5-7 opções competindo pela atenção ao mesmo tempo?
- O que pode ser colapsado, agrupado ou escondido com progressive
  disclosure?

## 3. Agrupamento de Dados (Lei de Miller)
- Números estão formatados com separadores (telefone, valores, códigos)?
- Listas longas estão agrupadas em categorias ou seções?
- Blocos de texto estão quebrados em parágrafos curtos?

## 4. Velocidade Percebida (Limiar de Doherty)
- Ações de carregamento têm skeleton screens ou indicadores de
  progresso?
- Botões de salvar/enviar usam optimistic UI (feedback imediato)?
- Existe algum ponto onde o usuário espera mais de 400ms sem
  feedback visual?

## 5. Inputs Inteligentes (Lei de Postel)
- Campos de data aceitam múltiplos formatos?
- Campos de texto fazem trim automático de espaços?
- O app normaliza dados de entrada ou força o usuário a seguir
  formato rígido?

Para cada técnica, me diga:
- ✅ O que já está bom
- ⚠️ O que pode melhorar
- 🔧 Sugestão concreta de correção

Priorize as correções por impacto na experiência do usuário.</code></pre>

<h2>Como usar</h2>
<ol>
  <li>Anexe um screenshot da tela ou cole o JSX/HTML.</li>
  <li>Cole o prompt acima.</li>
  <li>Para cada correção sugerida, peça código pronto antes de aplicar.</li>
</ol>

<h2>Dica</h2>
<p>Rode esse prompt antes de fechar cada tela em fase de QA. Em geral, ele acha 3-5 melhorias rápidas que somam grande diferença de feel.</p>`,
  },
  {
    title: 'Prompt para UI estilo Aura/Vercel/Apple (Glassmorphism + Bento)',
    slug: 'prompt-ui-aura-vercel-apple-glassmorphism',
    type: 'TEXT',
    categorySlug: 'prompts-ia',
    excerpt: 'System prompt para gerar interfaces pixel-perfect estilo Vercel/Linear: Glassmorphism, Bento Grid, Optimistic UI, Framer Motion e Tailwind.',
    content: `<h2>Para que serve</h2>
<p>Cola este prompt no GPT/Claude/Cursor antes de pedir uma tela. Define explicitamente o "look-and-feel" estilo Vercel/Linear/Apple — sem ele, você acaba com UI genérica de bootstrap.</p>

<h2>O prompt</h2>
<pre><code>Role: Senior UI/UX Engineer &amp; Design Systems Specialist
(ex-Vercel/Linear).

Your mission is to generate "pixel-perfect", visually rich,
production-ready web interfaces. You bridge the gap between high-end
aesthetics (Aura Style) and solid engineering (Optimistic UI).

### 1. VISUAL GUIDELINES (AURA STYLE)

- **Glassmorphism &amp; Depth:**
  - Mandatory use of translucent layers: \`bg-white/60\`
    (or \`bg-black/60\` in dark mode) with \`backdrop-blur-xl\`.
  - Subtle, high-contrast borders are required: \`border-white/20\`
    (dark) or \`border-gray-200/50\` (light).
  - Shadows must be "diffuse" and smoothly colored, never harsh black.
    Example: \`shadow-[0_8px_30px_rgb(0,0,0,0.12)]\`.

- **Layout &amp; Structure:**
  - Prefer "Bento Grid" layouts (asymmetric grids, modular cards).
  - Use \`grid-cols-1 md:grid-cols-3\` with \`row-span-*\` to create
    visual hierarchy.
  - Generous spacing: \`gap-6\` or \`gap-8\`.

- **Texture &amp; Detail:**
  - Avoid flat backgrounds. Use subtle "mesh" gradients or SVG noise
    textures for a premium feel.
  - Use text gradients for main headings: \`bg-clip-text
    text-transparent bg-gradient-to-b from-gray-900 to-gray-600\`.

- **Colors &amp; Typography:**
  - Font: \`Inter\` or \`Geist Sans\`.
  - Palette: Semantic colors inspired by shadcn/ui
    (\`bg-primary\`, \`text-primary-foreground\`).
  - Accents: Use vibrant accents (Violet, Indigo, Lime) **only**
    for buttons and critical CTAs.

### 2. INTERACTION &amp; PERFORMANCE (THE "FEEL")

- **Zero Latency Mindset:** Implement Optimistic UI. The interface
  must update INSTANTLY upon user action (using local state),
  syncing with the server in the background.

- **Micro-Interactions (Framer Motion):**
  - Standard entry: \`initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}\`.
  - Buttons: Add spring physics on hover.

### 3. TECHNICAL STACK (MANDATORY)

- **Framework:** Next.js 16+ (App Router) + React 19.
- **Directives:** ALWAYS add \`'use client'\` if using hooks or
  framer-motion.
- **Icons:** Lucide React.
- **Animation:** Framer Motion.
- **Styling:** Tailwind CSS. Use \`clsx\` or \`tailwind-merge\` for
  conditionals.

### 4. RESPONSE BEHAVIOR

1. **UX Analysis:** Start with a 1-paragraph analysis of the UX/UI
   decisions.
2. **Single File:** Generate ONLY ONE complete code file. No
   placeholders like \`// ...rest of code\`.
3. **Export:** The component must be exported as \`default\`.
4. **Preview:** Wrap the visual return in a simulated browser
   container or mobile frame with \`bg-gray-50\` or dot-pattern
   background.

### 5. NEGATIVE RULES (STRICT)

- **NO** default CSS box-shadows without opacity adjustment.
- **NO** 100% saturated colors (e.g., pure \`red-500\`).
- **NO** broken images. Use strictly:
  \`https://images.unsplash.com/photo-[ID]?auto=format&amp;fit=crop&amp;w=800&amp;q=80\`</code></pre>

<h2>Como usar</h2>
<ol>
  <li>Cole o prompt no GPT/Claude.</li>
  <li>Em seguida, descreva o que quer: "Crie um dashboard de vendas com 3 KPIs, gráfico de barras e tabela de últimas transações".</li>
  <li>O agente já entrega no estilo Aura sem você precisar lembrar de cada detalhe.</li>
</ol>

<h2>Por que funciona</h2>
<p>A maioria das IAs treina em códigos genéricos. Sem instrução explícita, elas voltam para Bootstrap/Material. Esse prompt amarra padrões estéticos específicos (glassmorphism, bento, shadows difusas) que diferenciam UI premium de UI commodity.</p>`,
  },
  {
    title: 'Prompt de Auditoria de Segurança para SaaS (OWASP Top 10 e API Top 10)',
    slug: 'prompt-auditoria-seguranca-saas-owasp',
    type: 'TEXT',
    categorySlug: 'prompts-ia',
    excerpt: 'Prompt extenso para o agente analisar seu SaaS como um Senior Security Engineer — 8 áreas, simulação de ataque por vulnerabilidade, severidade e fix.',
    content: `<h2>Quando usar</h2>
<p>Antes de lançar feature crítica (pagamento, upload, admin), ou em revisões trimestrais de segurança. O prompt assume stack moderna típica (backend API, auth, DB, uploads, webhooks, pagamentos).</p>

<h2>O prompt</h2>
<pre><code>You are a Senior Security Engineer specialized in SaaS security,
OWASP Top 10, API security, and cloud infrastructure.

Your task is to perform a deep security audit of my SaaS application.

Identify vulnerabilities, insecure patterns, architectural risks,
and potential attack vectors.

The analysis must follow modern security standards including:
• OWASP Top 10
• API Security Top 10
• Authentication and session security best practices
• Cloud security best practices
• Data protection and privacy risks
• Infrastructure and deployment security

## APPLICATION CONTEXT
I will provide code, architecture descriptions, or configuration
files. Assume a typical modern stack:
• Backend APIs
• Authentication system
• Database
• File uploads
• Webhooks / integrations
• Payment systems
• Admin dashboards
• User dashboards
• Public endpoints

# SECURITY AREAS TO ANALYZE

## 1. Authentication &amp; Authorization
Check for: broken authentication, weak session handling, JWT misuse,
missing token validation, improper password storage, lack of rate
limiting, privilege escalation, missing role validation, IDOR.

## 2. API Security
Analyze all endpoints for: missing authentication, broken object
level authorization, mass assignment vulnerabilities, missing input
validation, injection risks, GraphQL/REST abuse, lack of rate
limiting, enumeration vulnerabilities.

## 3. Input Validation &amp; Injection
SQL injection, NoSQL injection, Command injection, Template injection,
Path traversal, XSS (stored and reflected), SSRF, Unsafe
deserialization.

## 4. File Uploads
File type validation, MIME spoofing, Malware upload, Storage exposure,
Execution risks, Public access to private files.

## 5. Data Security
Sensitive data exposure, Encryption usage, Secrets in code,
Environment variable leaks, Logging sensitive data, Token storage,
API keys exposure.

## 6. Infrastructure &amp; Deployment
Docker configuration, Environment variables, Public ports, Open
services, Cloud storage permissions, Misconfigured CORS, CDN and
caching risks.

## 7. Admin Panel Security
Admin route protection, Privilege escalation, Hidden admin endpoints,
Session hijacking risks.

## 8. Payment &amp; Billing
Webhook verification, Payment manipulation, Subscription bypass,
Price tampering.

# ATTACK SIMULATION
For each vulnerability found:
1. Explain the vulnerability
2. Explain how an attacker would exploit it
3. Rate severity (Low / Medium / High / Critical)
4. Provide a fix with code or architecture recommendation

# OUTPUT FORMAT
## Vulnerability
Severity:
Location:
Description:
Attack scenario:
Fix recommendation:

# EXTRA ANALYSIS
Also identify:
• Architectural security flaws
• Missing security layers
• Lack of monitoring or logging
• Lack of abuse protection
• Missing rate limits

Think like a real attacker.

Prioritize vulnerabilities that could:
• expose user data
• allow account takeover
• allow privilege escalation
• compromise the entire SaaS

Be extremely critical and detailed.</code></pre>

<h2>Como rodar</h2>
<ol>
  <li>Cole o prompt em uma janela limpa do Claude/GPT.</li>
  <li>Anexe ou cole arquivos: rotas de API, schema do banco, edge functions críticas, configuração CORS.</li>
  <li>Para projetos grandes, divida por área (uma sessão para auth, outra para pagamentos, outra para uploads).</li>
</ol>

<h2>O que esperar</h2>
<p>Em projetos típicos, o agente costuma achar 8-15 vulnerabilidades por sessão. As Critical/High são raras (4-5 num projeto novo) mas são exatamente as que importam. Não ignore High por estética.</p>

<h2>Pareie com o SECURITY.md</h2>
<p>Após rodar a auditoria, atualize seu <code>SECURITY.md</code> com as regras que vieram dos achados. Isso cria um loop de melhoria contínua.</p>`,
  },

  // ───────────────────── SEGURANÇA E BOAS PRÁTICAS ───────────────────────────
  {
    title: 'Template completo de SECURITY.md para projetos Supabase',
    slug: 'template-security-md-supabase',
    type: 'TEXT',
    categorySlug: 'seguranca-boas-praticas',
    featured: true,
    excerpt: 'Template pronto para colar na raiz do projeto: padrões de Edge Functions, banco, frontend, pagamentos e checklist de Red Team.',
    content: `<h2>Como usar</h2>
<p>Crie um arquivo <code>SECURITY.md</code> na raiz do projeto e cole o template abaixo. Adapte os pontos específicos (nomes de tabelas, chaves) à sua realidade. O CLAUDE.md deve referenciar este arquivo em features críticas.</p>

<h2>O template completo</h2>
<pre><code># Segurança (obrigatório em todo código novo)

## Credenciais e Secrets
- Toda env var nova: informar nome e finalidade, nunca o valor.
  Exigir mínimo de 32 bytes para chaves de criptografia.
- Nunca usar .padEnd() ou truncamento para derivar chaves — usar o
  valor bruto e validar no startup.

## Edge Functions (Supabase)
- Toda edge function com webhook externo **deve** exigir token de
  autenticação — sem fallback permissivo.
- Logs nunca devem conter payloads completos com PII (CPF, telefone,
  cartão, e-mail). Logar apenas event/status/código de erro.
- Erros de APIs externas (Asaas, etc.) devem ser mapeados para
  mensagens genéricas antes de retornar ao cliente.
- Rate limiting obrigatório em: pagamentos (max 5/24h por pedido),
  login/auth (max 5/15min por IP/usuário).

## Banco de Dados
- Operações financeiras críticas (pagamento, idempotência) devem
  usar SELECT ... FOR UPDATE dentro de transação para evitar race
  condition (TOCTOU).
- Campos financeiros (total, subtotal, delivery_fee, discount) são
  imutáveis após criação — não criar código que os altere
  diretamente.
- Validação de cupons deve sempre checar: is_active, expires_at,
  max_uses, max_uses_per_user.
- Operações sensíveis (cancelamento, uso de cupom, acesso a dados
  criptografados) devem gerar registro em audit_logs.

## Frontend
- Toda chamada a API externa com parâmetro vindo do usuário
  (ex: CEP → ViaCEP) deve sanitizar com regex antes (/^\\d{8}$/) e
  validar estrutura mínima da resposta.
- Mensagens de erro de login/registro não devem distinguir
  "e-mail não existe" de "senha errada" — usar mensagem genérica.
- Rate limiting client-side em formulários sensíveis (login de
  garçom, etc.) usando sessionStorage.
- Uploads de imagem: limite máximo de 2MB, validar magic bytes do
  arquivo.

## Red Team (antes de finalizar código crítico)
Ao implementar: autenticação, pagamento, cupom, upload, ou qualquer
endpoint que leia/escreva dados de outros usuários — revisar
ativamente:
1. Consigo forjar o user_id ou restaurant_id?
2. Consigo chamar isso sem autenticação ou com token de outro usuário?
3. Consigo fazer duas requisições simultâneas e explorar race
   condition?
4. Consigo enviar um input maior/diferente do esperado e quebrar algo?

## Padrões — Edge Functions
- **CORS:** sempre importar getCorsHeaders de ../_shared/cors.ts —
  nunca usar '*'. Passar req para cada new Response().
- **Auth JWT:** toda Edge Function nova deve validar o JWT via
  supabase.auth.getUser() antes de qualquer operação. Exceção:
  webhooks externos (token próprio).
- **ENCRYPTION_KEY:** toda função que criptografa deve iniciar com
  if (!ENCRYPTION_KEY) throw new Error(...) — sem fallback para
  plaintext jamais.
- **Erros externos:** nunca retornar ao cliente erros brutos de APIs
  externas — mapear para mensagens genéricas.
- **Webhooks externos:** sempre verificar token de autenticação no
  header antes de processar o body.

## Padrões — Frontend
- **Roles:** nunca cachear role em localStorage ou sessionStorage.
  Sempre buscar do banco via useRole().
- **Queries de dados do usuário:** toda query em tabelas com dados
  pessoais deve incluir .eq('user_id', user.id) explicitamente —
  não confiar só no RLS.
- **Contexto de restaurante:** ao resolver restaurantId por fallback
  (sem URL), sempre filtrar por owner_id = user.id.
- **Uploads:** sempre validar magic bytes antes de processar.

## Padrões — Pagamentos
- **Idempotência:** antes de criar cobrança no Asaas, verificar se o
  orderId já tem gateway_payment_id com status não-falho. Retornar
  o existente sem criar novo.
- **Sem dados de cartão em logs:** nunca logar creditCard.* ou ccv.
  Em caso de erro, logar apenas o código de erro do gateway.

## Padrões — Banco de dados
- **Tabelas novas com dados do usuário:** sempre incluir
  user_id UUID REFERENCES auth.users(id) e criar política RLS
  restringindo por user_id = auth.uid().
- **RLS:** toda tabela nova deve ter
  ALTER TABLE ... ENABLE ROW LEVEL SECURITY na migration.
  Sem exceção.</code></pre>

<h2>Por que ter um SECURITY.md</h2>
<ul>
  <li>É o checklist que o agente IA (Claude/Cursor) consulta antes de gerar código sensível.</li>
  <li>Novos devs lêem antes de começar — onboarding rápido.</li>
  <li>Em auditoria externa, mostra que você tem padrão escrito (não só na cabeça).</li>
</ul>

<h2>Adaptação</h2>
<p>Os exemplos citam Asaas, ViaCEP, restaurant_id, owner_id — adapte para os termos do seu domínio. O que importa é manter as <strong>regras</strong>, não os nomes específicos.</p>`,
  },
  {
    title: 'Template de CLAUDE.md: regras de execução e segurança para o agente',
    slug: 'template-claude-md-regras-execucao',
    type: 'TEXT',
    categorySlug: 'seguranca-boas-praticas',
    excerpt: 'CLAUDE.md pronto para colar na raiz: define autonomia, comandos críticos, regras de git, credenciais, banco e referência ao SECURITY.md.',
    content: `<h2>O que é</h2>
<p>O <code>CLAUDE.md</code> é o "manual operacional" do agente. Ele é lido a cada turno e dita o que o Claude pode/não pode fazer sem confirmação. Este template é o mínimo recomendado para qualquer projeto sério.</p>

<h2>O template</h2>
<pre><code># Regras de Execução

## Autonomia vs. Consulta
- Age autonomamente em: nomes de variáveis, organização interna,
  utilitários menores.
- **Consulte antes** de: alterar &gt;3 arquivos, mudar
  arquitetura/estrutura/padrões, instalar dependências, afetar
  APIs/rotas/contratos públicos.
- Ao concluir: informe resumidamente o que foi feito e por quê.

## Git
- Commit **antes** de qualquer modificação: \`pre-task: [descrição]\`
- Commit descritivo ao finalizar.
- Nunca: \`git push --force\`, \`git rebase\` sem confirmação,
  criar/renomear/deletar branches sem perguntar.

## Comandos que exigem permissão (CRÍTICO)
- \`rm -rf\` e variantes
- \`sudo\`
- \`curl\`/\`wget\` com pipe para shell
- \`chmod 777\`
- Comandos destrutivos de banco: \`DROP TABLE\`,
  \`supabase db reset\`, \`prisma migrate reset\`
- \`git push --force\` / \`--force-with-lease\`
- Instalação de pacotes (\`npm install\`, \`pip install\`, \`npx\`
  etc.) — liste nome, versão e motivo antes
- Qualquer acesso a \`.env\`, \`.secret\`, \`*.key\`

## Credenciais
- Nunca leia, logue ou inclua no código: \`.env*\`, \`*.key\`,
  \`*.pem\`.
- Nunca hardcode tokens/senhas — sempre variáveis de ambiente.
- Se precisar de env var: informe o nome e finalidade, nunca o valor.

## Banco de Dados (Supabase)
- Sem comandos destrutivos sem confirmação.
- Alterações de schema → migrations, nunca direto.
- Migrations em produção → sinalizar e aguardar confirmação.
- Seeds → aprovação prévia.

## Dependências
- Antes de instalar: liste nome, versão, uso e se há alternativa já
  no projeto.
- Prefira dependências já existentes.

## Qualidade de Código
- Siga os padrões existentes (nomenclatura, estrutura, estilo).
- Não reformate arquivos fora do escopo da tarefa.
- Não remova comentários, console.logs ou código comentado sem
  perguntar.
- Problemas fora do escopo: reporte, não corrija.

## Segurança
Para tarefas envolvendo autenticação, pagamento, upload, banco de
dados ou endpoints com dados de usuários: ler [@SECURITY.md](SECURITY.md)
antes de implementar.</code></pre>

<h2>Por que essas regras específicas</h2>
<ul>
  <li><strong>Commit antes</strong>: garante checkpoint reversível antes de qualquer mudança grande.</li>
  <li><strong>&gt;3 arquivos = consultar</strong>: evita refactor surpresa que toca o projeto inteiro.</li>
  <li><strong>Lista de comandos críticos</strong>: o agente para e pergunta, não executa cego.</li>
  <li><strong>Não ler .env</strong>: previne que segredos vazem em logs/telemetria/contexto.</li>
  <li><strong>Não reformatar fora do escopo</strong>: previne diffs gigantes em PRs (revisão fica impossível).</li>
</ul>

<h2>Adapte para seu projeto</h2>
<p>Se você não usa Supabase, troque os comandos destrutivos do banco. Se push para main é OK no seu fluxo, ajuste a regra. O que importa é manter a estrutura de "default conservador, exceções declaradas".</p>

<h2>Combine com SECURITY.md</h2>
<p>O CLAUDE.md governa <strong>como</strong> o agente trabalha. O SECURITY.md governa <strong>o que</strong> o código precisa ter. Os dois juntos fecham o loop.</p>`,
  },

  // ─────────────────── FERRAMENTAS E RECURSOS ────────────────────────────────
  {
    title: 'Hermes Agent: agente de IA local da Nous Research',
    slug: 'hermes-agent-nous-research',
    type: 'TEXT',
    categorySlug: 'ferramentas-recursos',
    excerpt: 'Novo agente de IA local com inteligência regenerativa, 89k+ estrelas no GitHub. Vale o teste para quem busca alternativa open-source.',
    content: `<h2>O que é</h2>
<p>Hermes Agent é um agente de IA da Nous Research projetado para rodar localmente, com foco em capacidades regenerativas (auto-melhoria, persistência de contexto, raciocínio multi-passo sem chamadas constantes a APIs externas).</p>

<h2>Por que olhar</h2>
<ul>
  <li><strong>89k+ estrelas no GitHub</strong> — comunidade ativa e validada.</li>
  <li><strong>Local-first</strong>: roda no seu hardware, sem mandar dados para terceiros.</li>
  <li>Alternativa real ao Claude/GPT para quem precisa de privacidade total ou trabalha em ambientes air-gapped.</li>
</ul>

<h2>Link oficial</h2>
<p><a href="https://github.com/nousresearch/hermes-agent" target="_blank" rel="noreferrer noopener">github.com/nousresearch/hermes-agent</a></p>

<h2>Antes de testar</h2>
<ul>
  <li>Cheque os requisitos de hardware (GPU recomendada para modelos maiores).</li>
  <li>Veja a licença — algumas variantes têm restrições comerciais.</li>
  <li>Compare benchmarks com sua tarefa atual: agentes locais são mais lentos que Claude/GPT, mas podem ser "bons o suficiente" para sub-tarefas.</li>
</ul>`,
  },
  {
    title: 'React Bits: biblioteca de componentes e blocos UI para turbinar projetos',
    slug: 'react-bits-components',
    type: 'TEXT',
    categorySlug: 'ferramentas-recursos',
    excerpt: 'Componentes exclusivos, blocos de interface e modelos prontos para acelerar seu trabalho com React.',
    content: `<h2>O que é</h2>
<p>Coleção de componentes React de alta qualidade, blocos visuais e modelos prontos para usar. Pensada para acelerar projetos sem comprometer aparência ou performance.</p>

<h2>Acesso</h2>
<p><a href="https://reactbits.dev/get-started/index" target="_blank" rel="noreferrer noopener">reactbits.dev/get-started/index</a></p>

<h2>Quando usar</h2>
<ul>
  <li>MVP/protótipo onde tempo &gt; originalidade.</li>
  <li>Como referência para inspirar seus próprios componentes.</li>
  <li>Para preencher seções "extras" (testimonials, hero variants, pricing tables) sem reinventar a roda.</li>
</ul>

<h2>Cuidados</h2>
<ul>
  <li>Sempre verifique se há dependências pesadas (Framer Motion, GSAP) antes de copiar.</li>
  <li>Adapte cores e tipografia para seu design system — copiar 1:1 deixa o projeto "genérico".</li>
</ul>`,
  },
  {
    title: 'Smithery: marketplace de MCPs e Skills para agentes de IA',
    slug: 'smithery-mcps-skills',
    type: 'TEXT',
    categorySlug: 'ferramentas-recursos',
    excerpt: 'Plataforma que acelera a "economia de agentes" — infraestrutura para que IAs interajam com serviços externos via tool calls.',
    content: `<h2>O que é</h2>
<p>Smithery é uma plataforma que cataloga e distribui MCPs (Model Context Protocol servers) e Skills para agentes de IA. A tese: <strong>o futuro da internet será dominado por chamadas de ferramentas, não por cliques</strong>.</p>

<h2>Acesso</h2>
<p><a href="https://smithery.ai/" target="_blank" rel="noreferrer noopener">smithery.ai</a></p>

<h2>Por que importa</h2>
<ul>
  <li>É o "npm" do mundo de agentes — você descobre tools prontas e instala em segundos.</li>
  <li>Funciona com Claude Desktop, Claude Code, Cursor e qualquer cliente que suporte MCP.</li>
  <li>Já tem servidores para GitHub, Linear, Notion, Postgres, Stripe, e dezenas de outros.</li>
</ul>

<h2>Casos de uso típicos</h2>
<ul>
  <li>Adicionar acesso ao seu Postgres no Claude para queries naturais.</li>
  <li>Dar ao agente capacidade de criar issues no Linear.</li>
  <li>Conectar seu sistema interno (Stripe, Notion, GitHub) ao agente sem escrever wrapper.</li>
</ul>`,
  },
  {
    title: 'CSS Scan: biblioteca de botões CSS prontos pra copiar',
    slug: 'css-scan-beautiful-buttons',
    type: 'TEXT',
    categorySlug: 'ferramentas-recursos',
    excerpt: 'Galeria com dezenas de botões CSS bonitos, com código pronto pra copiar e colar no seu projeto.',
    content: `<h2>O que tem</h2>
<p>Coleção curada de botões em CSS puro — sem JavaScript, sem dependências. Cada botão tem o código completo (HTML + CSS) pronto pra copiar.</p>

<h2>Acesso</h2>
<p><a href="https://getcssscan.com/css-buttons-examples" target="_blank" rel="noreferrer noopener">getcssscan.com/css-buttons-examples</a></p>

<h2>Por que é útil</h2>
<ul>
  <li>Zero dependência: copia e funciona, sem framework.</li>
  <li>Ótimo para landing pages, e-mails marketing e protótipos.</li>
  <li>Muitos efeitos (hover, ripple, gradient, neon) já implementados.</li>
</ul>

<h2>Dica</h2>
<p>Sempre adapte as cores para a paleta do seu projeto antes de colar. Botões "padrão" são imediatamente identificáveis como copy-paste e podem desvalorizar o resto do design.</p>`,
  },
  {
    title: 'UIVERSE: componentes open-source em CSS e Tailwind',
    slug: 'uiverse-components-open-source',
    type: 'TEXT',
    categorySlug: 'ferramentas-recursos',
    excerpt: 'Galeria com milhares de elementos UI (botões, cards, inputs, loaders, checkboxes) em CSS puro ou Tailwind, todos com código aberto.',
    content: `<h2>O que tem</h2>
<p>UIVERSE é um repositório comunitário de componentes UI open-source. Cada elemento tem versão em CSS vanilla e Tailwind, com código pronto pra copiar.</p>

<h2>Acesso</h2>
<p><a href="https://uiverse.io/elements" target="_blank" rel="noreferrer noopener">uiverse.io/elements</a></p>

<h2>Categorias populares</h2>
<ul>
  <li>Botões com efeitos avançados (glitch, glow, morph)</li>
  <li>Loaders e spinners</li>
  <li>Cards e tooltips</li>
  <li>Checkboxes e toggles customizados</li>
  <li>Inputs animados</li>
</ul>

<h2>Diferencial</h2>
<p>Os componentes são submetidos pela comunidade e ranqueados por likes — você vê o que está em alta antes de copiar. Tudo open-source, sem atribuição obrigatória.</p>`,
  },
  {
    title: 'Redirects para Pressel: códigos estilo raspadinha, Tinder e similares',
    slug: 'redirects-pressel-raspadinha-tinder',
    type: 'TEXT',
    categorySlug: 'ferramentas-recursos',
    excerpt: 'Coleção de templates de pré-sell (pressel) com mecânicas gamificadas: raspadinha, swipe estilo Tinder e outros formatos que aumentam engajamento.',
    content: `<h2>O que é Pressel</h2>
<p>Pressel = "pré-sell". É uma página intermediária entre o anúncio e o checkout, com mecânica interativa (raspadinha, quiz, swipe) que segmenta e aquece o lead antes de mostrar a oferta.</p>

<h2>Acesso</h2>
<p><a href="https://dark-z.base44.app/Redirects" target="_blank" rel="noreferrer noopener">dark-z.base44.app/Redirects</a></p>

<h2>Mecânicas comuns</h2>
<ul>
  <li><strong>Raspadinha</strong>: usuário "raspa" a tela para revelar oferta — taxa de clique alta.</li>
  <li><strong>Tinder swipe</strong>: usuário arrasta produtos pra esquerda/direita; coleta intenção antes de ofertar.</li>
  <li><strong>Quiz</strong>: 3-5 perguntas que segmentam o lead.</li>
  <li><strong>Roleta</strong>: gamificação de cupom — usuário "ganha" desconto.</li>
</ul>

<h2>Quando usar</h2>
<ul>
  <li>Tráfego frio de Facebook/TikTok Ads.</li>
  <li>Ofertas onde a fricção do checkout é alta (ticket alto).</li>
  <li>Para "esquentar" o lead antes da página de vendas longa.</li>
</ul>

<h2>Atenção</h2>
<p>Algumas mecânicas (especialmente "raspadinhas" com promessa de prêmio) podem ser reprovadas pelas políticas do Facebook Ads. Sempre teste com pequeno orçamento antes de escalar.</p>`,
  },
  {
    title: 'AURA: componentes UI em HTML gerados por IA',
    slug: 'aura-ui-components-ia',
    type: 'TEXT',
    categorySlug: 'ferramentas-recursos',
    excerpt: 'Assistente de design com IA que ajuda a criar interfaces incríveis com facilidade — biblioteca de componentes prontos em HTML.',
    content: `<h2>O que é</h2>
<p>Aura é um assistente de design com IA. Tem uma biblioteca pronta de componentes em HTML e também gera variações sob demanda baseadas em prompt.</p>

<h2>Acesso</h2>
<p><a href="https://www.aura.build/components" target="_blank" rel="noreferrer noopener">aura.build/components</a></p>

<h2>Vantagens vs. bibliotecas tradicionais</h2>
<ul>
  <li>Você descreve o que quer ("dashboard de vendas estilo Linear") e a IA gera variações.</li>
  <li>HTML puro — fácil de integrar em qualquer stack.</li>
  <li>Estilo geral consistente com tendências atuais (glassmorphism, bento, gradientes sutis).</li>
</ul>

<h2>Combo poderoso</h2>
<p>Use o Aura como ponto de partida visual e refine com o prompt "UI Padrão Apple/Vercel (Glassmorphism + Bento)" para gerar a versão React/Next.js final.</p>`,
  },
  {
    title: 'Spark SEO: gerador de prompts do Daniel Roriz',
    slug: 'spark-seo-gerador-prompts-daniel-roriz',
    type: 'TEXT',
    categorySlug: 'ferramentas-recursos',
    excerpt: 'Gerador de prompts criado pelo Daniel Roriz com foco em SEO e marketing — economiza tempo na construção de prompts complexos.',
    content: `<h2>O que é</h2>
<p>Plataforma que ajuda a estruturar prompts complexos a partir de templates testados — útil para quem usa IA em SEO, content, ads e copywriting.</p>

<h2>Acesso</h2>
<p><a href="https://prompts.sparkseo.com.br/" target="_blank" rel="noreferrer noopener">prompts.sparkseo.com.br</a></p>

<h2>Quando usar</h2>
<ul>
  <li>Quando você sabe o resultado que quer mas não consegue formular o prompt que entrega.</li>
  <li>Para evitar reinventar a roda em tarefas recorrentes (briefing, persona, calendário editorial).</li>
  <li>Como ponto de partida para customizar prompts próprios.</li>
</ul>

<h2>Vantagem</h2>
<p>Templates criados por alguém com experiência real em SEO/marketing — você herda boas práticas que levariam meses pra aprender testando sozinho.</p>`,
  },

  // ─────────────────────────── SNIPPETS CSS (existente) ──────────────────────
  {
    title: 'Remover a badge "Built with v0" (Vercel) da aplicação',
    slug: 'remover-badge-v0-vercel',
    type: 'TEXT',
    categorySlug: 'snippets-css',
    excerpt: 'CSS de 3 linhas para esconder a badge do v0.dev em apps gerados pela plataforma da Vercel.',
    content: `<h2>O problema</h2>
<p>Apps gerados no <a href="https://v0.dev" target="_blank" rel="noreferrer noopener">v0.dev</a> da Vercel embarcam uma badge "Built with v0" no canto da tela. Para uso pessoal/protótipo tudo bem, mas em produção fica feio.</p>

<h2>A solução</h2>
<p>Adicione no <code>global.css</code> (ou no <code>app/globals.css</code> no Next.js):</p>
<pre><code>div[id^="v0-built-with-button"] {
    display: none !important;
}</code></pre>

<h2>Como funciona</h2>
<p>O seletor <code>[id^="v0-built-with-button"]</code> pega qualquer <code>div</code> cujo ID começa com <code>v0-built-with-button</code>. A regra <code>!important</code> garante prioridade sobre os estilos inline da Vercel.</p>

<h2>Atenção: termos de uso</h2>
<p>Verifique os termos de uso do v0 — em planos gratuitos, esconder a badge pode estar fora das condições permitidas. Em planos pagos costuma ser explicitamente liberado.</p>`,
  },
]

// ─── Runner ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Importando códigos da compilação "Códigos Luana" (parte 2)...\n')

  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: { ...c, active: true },
    })
  }
  console.log(`✅ ${CATEGORIES.length} novas categorias criadas/atualizadas.`)

  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
  if (!admin) {
    throw new Error(`Usuário "${ADMIN_EMAIL}" não encontrado.`)
  }

  const allCategories = await prisma.category.findMany({ select: { id: true, slug: true } })
  const catBySlug = new Map(allCategories.map((c) => [c.slug, c.id]))

  const status: ArticleStatus = 'PUBLISHED'
  let created = 0
  let updated = 0

  for (const a of ARTICLES) {
    const categoryId = catBySlug.get(a.categorySlug)
    if (!categoryId) {
      console.warn(`⚠️  Categoria "${a.categorySlug}" não encontrada — artigo "${a.title}" pulado.`)
      continue
    }

    const payload = {
      title: a.title,
      slug: a.slug,
      type: a.type,
      content: a.content,
      excerpt: a.excerpt,
      videoUrl: null,
      status,
      featured: a.featured ?? false,
      categoryId,
      authorId: admin.id,
      publishedAt: new Date(),
    }

    const existing = await prisma.article.findUnique({ where: { slug: a.slug } })

    if (existing) {
      await prisma.article.update({ where: { id: existing.id }, data: payload })
      updated++
    } else {
      await prisma.article.create({ data: payload })
      created++
    }
  }

  console.log(`✅ Artigos: ${created} criados, ${updated} atualizados (total: ${ARTICLES.length}).\n`)
  console.log('Distribuição por categoria:')
  const allSlugs = new Set(ARTICLES.map((a) => a.categorySlug))
  for (const slug of allSlugs) {
    const n = ARTICLES.filter((a) => a.categorySlug === slug).length
    const cat = CATEGORIES.find((c) => c.slug === slug)
    const label = cat ? `${cat.icon} ${cat.name}` : `   ${slug} (existente)`
    console.log(`   ${label.padEnd(40)} ${n} artigos`)
  }
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
