import { PrismaClient, ArticleType, ArticleStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// ⚠️  SENHA TEMPORÁRIA — troque imediatamente após o primeiro login
const SEED_ADMIN_EMAIL = 'admin@rbcont.com.br'
const SEED_ADMIN_PASSWORD = 'TurboAdmin@2026'

async function main() {
  // ─── Categorias ────────────────────────────────────────────────────────────

  const categories = [
    {
      name: 'Primeiros Passos',
      slug: 'primeiros-passos',
      description: 'Tudo que você precisa saber para começar com a RBCont.',
      icon: '🚀',
      order: 1,
      active: true,
    },
    {
      name: 'WordPress',
      slug: 'wordpress',
      description: 'Instalação, configuração e otimização do WordPress.',
      icon: '📝',
      order: 2,
      active: true,
    },
    {
      name: 'Domínios e DNS',
      slug: 'dominios-dns',
      description: 'Registro, transferência e configuração de domínios e DNS.',
      icon: '🌐',
      order: 3,
      active: true,
    },
    {
      name: 'E-mail',
      slug: 'email',
      description: 'Criação e configuração de contas de e-mail profissional.',
      icon: '✉️',
      order: 4,
      active: true,
    },
    {
      name: 'VPS e Projetos',
      slug: 'vps',
      description: 'Gerenciamento de servidores VPS e projetos de hospedagem.',
      icon: '🖥️',
      order: 5,
      active: true,
    },
    {
      name: 'Segurança e Backup',
      slug: 'seguranca-backup',
      description: 'Proteção do seu site e recuperação de dados.',
      icon: '🔒',
      order: 6,
      active: true,
    },
    {
      name: 'Faturamento',
      slug: 'faturamento',
      description: 'Planos, pagamentos, notas fiscais e cancelamentos.',
      icon: '💳',
      order: 7,
      active: true,
    },
    {
      name: 'Afiliados',
      slug: 'afiliados',
      description: 'Como funciona o programa de afiliados da RBCont.',
      icon: '🤝',
      order: 8,
      active: true,
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
  }

  console.log('✅ 8 categorias criadas/atualizadas.')

  // ─── Usuário SUPER_ADMIN inicial ───────────────────────────────────────────

  // Senha hasheada com bcrypt, 12 rounds — valor temporário para primeiro acesso
  const hashedPassword = await hash(SEED_ADMIN_PASSWORD, 12)

  await prisma.user.upsert({
    where: { email: SEED_ADMIN_EMAIL },
    update: {},                          // Não sobrescreve se já existir
    create: {
      email: SEED_ADMIN_EMAIL,
      password: hashedPassword,
      name: 'Administrador',
      role: 'SUPER_ADMIN',
      active: true,
    },
  })

  console.log('✅ Usuário SUPER_ADMIN criado.')
  console.log('')
  console.log('┌─────────────────────────────────────────────────────┐')
  console.log('│  CREDENCIAIS INICIAIS DO PAINEL ADMIN               │')
  console.log('│                                                       │')
  console.log(`│  E-mail : ${SEED_ADMIN_EMAIL.padEnd(42)}│`)
  console.log(`│  Senha  : ${SEED_ADMIN_PASSWORD.padEnd(42)}│`)
  console.log('│                                                       │')
  console.log('│  ⚠️  TROQUE A SENHA IMEDIATAMENTE APÓS O PRIMEIRO    │')
  console.log('│     LOGIN EM /admin/usuarios                         │')
  console.log('└─────────────────────────────────────────────────────┘')

  // ─── Conteúdos de exemplo (artigos) ────────────────────────────────────────
  await seedArticles()
}

interface ArticleSeed {
  title: string
  slug: string
  type: ArticleType
  categorySlug: string
  excerpt: string
  content: string
  videoUrl?: string
  featured?: boolean
  status?: ArticleStatus
}

const TEXT_ARTICLES: ArticleSeed[] = [
  {
    title: 'Como criar sua primeira conta na RBCont',
    slug: 'como-criar-sua-primeira-conta-rbcont',
    type: 'TEXT',
    categorySlug: 'primeiros-passos',
    excerpt: 'Passo a passo para criar sua conta, confirmar e-mail e fazer o primeiro login no painel.',
    featured: true,
    content: `<h2>Antes de começar</h2><p>Tenha em mãos um e-mail válido e um celular para confirmação em duas etapas. Você poderá completar todo o processo em menos de 3 minutos.</p><h2>1. Acesse a página de cadastro</h2><p>Vá até <a href="https://rbcont.com.br">rbcont.com.br</a> e clique em <strong>Criar conta</strong> no canto superior direito.</p><h2>2. Preencha seus dados</h2><ul><li>Nome completo (igual ao documento)</li><li>E-mail principal — será seu login</li><li>Senha forte (mínimo 12 caracteres, com número e símbolo)</li></ul><h2>3. Confirme o e-mail</h2><p>Você receberá um link de ativação. Clique nele em até 24 horas para validar o cadastro.</p><h2>4. Primeiro login</h2><p>Use o e-mail e senha cadastrados. Na primeira entrada, configure a autenticação em duas etapas — isso é fortemente recomendado.</p>`,
  },
  {
    title: 'Guia completo de instalação do WordPress',
    slug: 'guia-instalacao-wordpress',
    type: 'TEXT',
    categorySlug: 'wordpress',
    excerpt: 'Instale o WordPress em sua hospedagem RBCont com instalador automático ou método manual.',
    content: `<h2>Método 1 — Instalador automático (recomendado)</h2><p>No painel, acesse <strong>Sites &gt; Novo Site &gt; WordPress</strong>. Em menos de 60 segundos seu site estará no ar.</p><ol><li>Escolha o domínio</li><li>Defina usuário e senha do admin</li><li>Selecione o idioma (pt-BR)</li><li>Clique em <strong>Instalar</strong></li></ol><h2>Método 2 — Instalação manual</h2><p>Útil quando você precisa de uma versão específica do core ou um perfil de configuração avançado.</p><ul><li>Baixe o WordPress em <a href="https://br.wordpress.org">br.wordpress.org</a></li><li>Envie por FTP/SFTP para a pasta <code>public_html</code></li><li>Crie um banco MySQL no painel</li><li>Acesse seu domínio e siga o wizard</li></ul><h2>Próximos passos</h2><p>Após a instalação, ative HTTPS, configure cache de página e instale um plugin de backup.</p>`,
  },
  {
    title: 'Configurando DNS no Cloudflare apontando para a RBCont',
    slug: 'dns-cloudflare-rbcont',
    type: 'TEXT',
    categorySlug: 'dominios-dns',
    excerpt: 'Use o Cloudflare como provedor de DNS apontando para os IPs da RBCont sem perder o CDN.',
    content: `<h2>O que você vai precisar</h2><ul><li>Conta gratuita no Cloudflare</li><li>Endereço IP do servidor RBCont (encontrado em <em>Sites &gt; Detalhes</em>)</li><li>Acesso ao painel onde o domínio está registrado</li></ul><h2>Passo 1 — Adicione o site no Cloudflare</h2><p>Insira o domínio raiz (sem <code>www.</code>) e selecione o plano gratuito.</p><h2>Passo 2 — Crie os registros A e CNAME</h2><ul><li><strong>A</strong>  @  →  IP do servidor RBCont</li><li><strong>CNAME</strong>  www  →  seu-dominio.com</li></ul><h2>Passo 3 — Troque os nameservers</h2><p>No registrador do domínio, substitua os NS atuais pelos dois informados pelo Cloudflare. A propagação leva de 1 a 24 horas.</p>`,
  },
  {
    title: 'Configurar e-mail profissional no Outlook',
    slug: 'configurar-email-outlook',
    type: 'TEXT',
    categorySlug: 'email',
    excerpt: 'Adicione sua conta de e-mail RBCont no Outlook (desktop) com IMAP e portas seguras.',
    content: `<h2>Dados de configuração</h2><ul><li><strong>IMAP</strong>: mail.seudominio.com.br — porta 993 (SSL)</li><li><strong>SMTP</strong>: mail.seudominio.com.br — porta 465 (SSL)</li><li><strong>Usuário</strong>: e-mail completo (ex.: contato@seudominio.com.br)</li><li><strong>Senha</strong>: a mesma criada no painel</li></ul><h2>Adicionando no Outlook</h2><ol><li>Abra <strong>Arquivo &gt; Adicionar Conta</strong></li><li>Escolha <em>Configuração manual</em></li><li>Selecione IMAP</li><li>Preencha os dados acima</li></ol><p>Teste enviando e recebendo uma mensagem de validação.</p>`,
  },
  {
    title: 'Conectando-se via SSH ao seu VPS',
    slug: 'conexao-ssh-vps',
    type: 'TEXT',
    categorySlug: 'vps',
    excerpt: 'Use SSH com chave pública para acessar o VPS de forma segura, sem senha.',
    content: `<h2>1. Gere uma chave SSH</h2><pre><code>ssh-keygen -t ed25519 -C "seu-email@dominio.com"</code></pre><p>Aceite o caminho padrão e defina uma passphrase forte.</p><h2>2. Cadastre a chave pública no painel</h2><p>Copie o conteúdo de <code>~/.ssh/id_ed25519.pub</code> e cole em <strong>VPS &gt; Chaves SSH &gt; Nova chave</strong>.</p><h2>3. Conecte</h2><pre><code>ssh root@SEU_IP_DO_VPS</code></pre><p>Pronto — você está dentro. Para mais segurança, desative login por senha em <code>/etc/ssh/sshd_config</code>.</p>`,
  },
  {
    title: 'Ativando backups automáticos diários',
    slug: 'backups-automaticos-diarios',
    type: 'TEXT',
    categorySlug: 'seguranca-backup',
    excerpt: 'Configure backups automáticos com retenção e teste de restauração mensal.',
    content: `<h2>Onde ativar</h2><p>Acesse <strong>Sites &gt; [seu site] &gt; Backups</strong> e marque <em>Backup diário automático</em>.</p><h2>Política recomendada</h2><ul><li>Retenção: 14 dias para sites em produção</li><li>Snapshot mensal mantido por 90 dias</li><li>Restauração de teste a cada 30 dias</li></ul><h2>Backup off-site</h2><p>Para sites críticos, configure também envio para um bucket externo (S3, Backblaze ou Google Cloud Storage). Assim você sobrevive até a um incidente catastrófico do provedor.</p>`,
  },
  {
    title: 'Emitir nota fiscal e segunda via de boleto',
    slug: 'nota-fiscal-segunda-via-boleto',
    type: 'TEXT',
    categorySlug: 'faturamento',
    excerpt: 'Baixe NF-e, gere segunda via de boleto e altere a forma de pagamento direto no painel.',
    content: `<h2>Notas fiscais</h2><p>Em <strong>Financeiro &gt; Notas Fiscais</strong>, todas as NF-e dos últimos 24 meses ficam disponíveis em PDF e XML. Para empresas, atualize o CNPJ e IE no perfil antes do próximo ciclo.</p><h2>Segunda via de boleto</h2><p>Em <strong>Financeiro &gt; Faturas</strong>, clique em uma fatura em aberto e selecione <em>Reimprimir boleto</em>. Boletos vencidos podem ser atualizados pelo botão <em>Atualizar vencimento</em>.</p><h2>Trocar forma de pagamento</h2><p>Você pode migrar para cartão de crédito ou Pix recorrente em <strong>Financeiro &gt; Forma de pagamento</strong>. A mudança vale a partir do próximo ciclo.</p>`,
  },
  {
    title: 'Programa de afiliados RBCont: como começar',
    slug: 'programa-afiliados-como-comecar',
    type: 'TEXT',
    categorySlug: 'afiliados',
    excerpt: 'Ative seu link de afiliado, divulgue e acompanhe comissões em tempo real.',
    content: `<h2>1. Ative seu perfil de afiliado</h2><p>No painel, vá em <strong>Afiliados &gt; Ativar conta</strong>. Aceite os termos e informe seus dados bancários.</p><h2>2. Seu link único</h2><p>Você receberá um link no formato <code>rbcont.com.br/?ref=SEUCODIGO</code>. Toda venda originada dele é creditada para você.</p><h2>3. Comissões</h2><ul><li>30% recorrente nos primeiros 12 meses de cada cliente</li><li>Pagamento mensal a partir de R$ 50 acumulados</li><li>Saque via Pix, TED ou conta RBCont</li></ul>`,
  },
  {
    title: 'Migrando seu WordPress para a RBCont',
    slug: 'migrando-wordpress-para-rbcont',
    type: 'TEXT',
    categorySlug: 'wordpress',
    excerpt: 'Migração gratuita assistida ou DIY com plugin All-in-One WP Migration.',
    content: `<h2>Opção A — Migração gratuita assistida</h2><p>Abra um chamado em <strong>Suporte &gt; Solicitar migração</strong>. Nosso time faz o trabalho em até 24h úteis sem downtime perceptível.</p><h2>Opção B — DIY com All-in-One WP Migration</h2><ol><li>No site origem, instale o plugin e clique em <em>Exportar &gt; Arquivo</em></li><li>Crie um WordPress vazio na RBCont</li><li>Instale o mesmo plugin no destino e use <em>Importar</em></li><li>Atualize permalinks em <em>Configurações &gt; Links permanentes</em></li></ol><h2>Após a migração</h2><p>Faça a troca de DNS quando estiver tudo testado. Mantenha o site antigo no ar por 72h para garantir cache propagado.</p>`,
  },
  {
    title: 'Glossário de termos de hospedagem',
    slug: 'glossario-termos-hospedagem',
    type: 'TEXT',
    categorySlug: 'primeiros-passos',
    excerpt: 'Os termos mais comuns do mundo de hospedagem explicados em uma frase cada.',
    content: `<h2>Conceitos básicos</h2><ul><li><strong>DNS</strong>: a lista telefônica da internet — traduz o nome do site no endereço IP do servidor.</li><li><strong>SSL/TLS</strong>: o cadeado verde. Criptografa a comunicação entre navegador e servidor.</li><li><strong>CDN</strong>: rede global que serve seu site a partir do nó mais próximo do visitante.</li></ul><h2>E-mail</h2><ul><li><strong>IMAP</strong>: protocolo que mantém suas mensagens no servidor (recomendado).</li><li><strong>SMTP</strong>: protocolo de envio de e-mail.</li><li><strong>SPF, DKIM, DMARC</strong>: registros DNS que provam que seu e-mail é legítimo.</li></ul><h2>Infraestrutura</h2><ul><li><strong>VPS</strong>: servidor virtual com recursos dedicados.</li><li><strong>Hospedagem compartilhada</strong>: vários sites no mesmo servidor.</li><li><strong>RAM/CPU</strong>: o "cérebro" do servidor — quanto mais, mais visitas simultâneas você atende.</li></ul>`,
  },
]

const VIDEO_ARTICLES: ArticleSeed[] = [
  {
    title: 'Tour pelo painel RBCont em 5 minutos',
    slug: 'video-tour-painel-rbcont',
    type: 'VIDEO',
    categorySlug: 'primeiros-passos',
    excerpt: 'Conheça as áreas principais do painel: sites, e-mails, financeiro e suporte.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    featured: true,
    content: '<p>Neste vídeo, fazemos uma volta completa pelo painel: dashboard, criação de sites, contas de e-mail, faturas, suporte e configurações de conta. É o ponto de partida ideal antes de começar a usar a plataforma.</p>',
  },
  {
    title: 'Instalação do WordPress em vídeo (passo a passo)',
    slug: 'video-instalacao-wordpress',
    type: 'VIDEO',
    categorySlug: 'wordpress',
    excerpt: 'Veja o instalador automático em ação criando um WordPress do zero.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    content: '<p>Acompanhe na tela cada clique. Demonstramos a escolha de domínio, definição do usuário admin, instalação de tema básico e os primeiros ajustes recomendados (HTTPS, permalinks e cache).</p>',
  },
  {
    title: 'Configurando seu primeiro VPS — vídeo prático',
    slug: 'video-configurando-primeiro-vps',
    type: 'VIDEO',
    categorySlug: 'vps',
    excerpt: 'Provisionamento, acesso SSH inicial e instalação de stack LEMP em 12 minutos.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    content: '<p>Mostramos o fluxo completo: escolha de plano, sistema operacional (Ubuntu 24.04), criação do par de chaves SSH, primeiro acesso, hardening básico (porta, fail2ban) e instalação da stack LEMP.</p>',
  },
  {
    title: 'Vídeo: configurando SPF, DKIM e DMARC',
    slug: 'video-spf-dkim-dmarc',
    type: 'VIDEO',
    categorySlug: 'email',
    excerpt: 'Os três registros que fazem seus e-mails caírem (ou não) em spam.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    content: '<p>Em 8 minutos, configuramos os 3 registros essenciais de autenticação de e-mail e mostramos como validar com o MXToolbox. Inclui também a leitura básica do relatório de DMARC.</p>',
  },
  {
    title: 'Webinar: estratégias de afiliação que convertem',
    slug: 'video-webinar-afiliacao-converte',
    type: 'VIDEO',
    categorySlug: 'afiliados',
    excerpt: 'Webinar gravado com top afiliados RBCont compartilhando táticas reais.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    content: '<p>Webinar de 45 minutos com 3 dos maiores afiliados RBCont em 2025. Eles compartilham canais que funcionam, abordagens de copy e o que aprenderam errando ao longo dos primeiros anos.</p>',
  },
]

async function seedArticles() {
  const admin = await prisma.user.findUnique({ where: { email: SEED_ADMIN_EMAIL } })
  if (!admin) throw new Error('Usuário admin não encontrado — não foi possível criar artigos.')

  const allCategories = await prisma.category.findMany({ select: { id: true, slug: true } })
  const catBySlug = new Map(allCategories.map((c) => [c.slug, c.id]))

  const allArticles: ArticleSeed[] = [...TEXT_ARTICLES, ...VIDEO_ARTICLES]
  let created = 0
  let updated = 0

  for (const a of allArticles) {
    const categoryId = catBySlug.get(a.categorySlug)
    if (!categoryId) {
      console.warn(`⚠️  Categoria "${a.categorySlug}" não encontrada — artigo "${a.title}" pulado.`)
      continue
    }

    const status: ArticleStatus = a.status ?? 'PUBLISHED'
    const payload = {
      title: a.title,
      slug: a.slug,
      type: a.type,
      content: a.content,
      excerpt: a.excerpt,
      videoUrl: a.type === 'VIDEO' ? (a.videoUrl ?? null) : null,
      status,
      featured: a.featured ?? false,
      categoryId,
      authorId: admin.id,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
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

  console.log(`✅ Artigos: ${created} criados, ${updated} atualizados (10 TEXT + 5 VIDEO).`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
