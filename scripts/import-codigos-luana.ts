/**
 * Import dos códigos da compilação "Códigos Luana".
 * Cria 6 novas categorias e 22 artigos publicados, todos atribuídos ao admin padrão.
 *
 * Uso:
 *   npx tsx scripts/import-codigos-luana.ts
 *
 * Idempotente: usa upsert por slug — pode rodar várias vezes sem duplicar.
 */
import { PrismaClient, ArticleType, ArticleStatus } from '@prisma/client'

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'admin@turbocloud.com.br'

// ─── Categorias (ordem 10+ para não colidir com as 8 do seed.ts) ───────────────
const CATEGORIES = [
  {
    name: 'Performance e Cache',
    slug: 'performance-e-cache',
    description: 'Pré-carregamento, headers de cache, placeholders e otimização de assets para sites rápidos.',
    icon: '⚡',
    order: 10,
  },
  {
    name: 'Tracking e UTMs',
    slug: 'tracking-e-utms',
    description: 'Captura de UTMs, exclusões de pixels e parâmetros que não devem ser cacheados.',
    icon: '📊',
    order: 11,
  },
  {
    name: 'Snippets CSS',
    slug: 'snippets-css',
    description: 'Fragmentos de CSS para corrigir scrollbars, criar efeitos e ajustar layout.',
    icon: '🎨',
    order: 12,
  },
  {
    name: 'Snippets JavaScript',
    slug: 'snippets-javascript',
    description: 'Scripts utilitários para delays, scroll, manipulação de DOM e rel attributes.',
    icon: '🧩',
    order: 13,
  },
  {
    name: 'Checkout e Vendas',
    slug: 'checkout-e-vendas',
    description: 'Integrações de checkout pré-populado em Hotmart, Guru, Eduzz e Greenn.',
    icon: '💰',
    order: 14,
  },
  {
    name: 'Elementor e Acessibilidade',
    slug: 'elementor-e-acessibilidade',
    description: 'Correções de acessibilidade no Elementor e proteções anti-bot em formulários.',
    icon: '♿',
    order: 15,
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

// ─── Artigos ──────────────────────────────────────────────────────────────────
const ARTICLES: ArticleSeed[] = [
  // ───────────────────────── PERFORMANCE E CACHE ─────────────────────────────
  {
    title: 'Pré-carregar recursos com link rel="preload"',
    slug: 'pre-carregar-recursos-preload',
    type: 'TEXT',
    categorySlug: 'performance-e-cache',
    featured: true,
    excerpt: 'Tags <link rel="preload"> e preconnect para imagens responsivas, fontes, scripts, CSS, DNS externo e vídeo.',
    content: `<h2>O que é preload</h2>
<p>O atributo <code>rel="preload"</code> informa ao navegador para baixar um recurso o quanto antes, antes mesmo de o parser HTML chegar até ele. Use para recursos críticos do above-the-fold.</p>

<h2>Imagens responsivas</h2>
<p>Carregue a imagem certa conforme o breakpoint:</p>
<pre><code>&lt;!-- Mobile e Tablet (até 1023px) --&gt;
&lt;link href="#" rel="preload" as="image" media="(max-width: 1023px)"&gt;

&lt;!-- Apenas Mobile (até 767px) --&gt;
&lt;link href="#" rel="preload" as="image" media="(max-width: 767px)"&gt;

&lt;!-- Apenas Desktop (a partir de 1024px) --&gt;
&lt;link href="#" rel="preload" as="image" media="(min-width: 1024px)"&gt;

&lt;!-- Desktop e Tablet (a partir de 768px) --&gt;
&lt;link href="#" rel="preload" as="image" media="(min-width: 768px)"&gt;

&lt;!-- Geral, sem condição --&gt;
&lt;link href="#" rel="preload" as="image"&gt;</code></pre>

<h2>Fontes</h2>
<pre><code>&lt;link rel="preload" href="#" as="font" type="font/woff2" crossorigin&gt;</code></pre>
<p>Sempre use <code>crossorigin</code> em fontes — sem ele, o navegador faz a request duas vezes.</p>

<h2>Scripts</h2>
<pre><code>&lt;link rel="preload" href="#" as="script" type="text/javascript" crossorigin&gt;</code></pre>

<h2>CSS / Stylesheet</h2>
<pre><code>&lt;link rel="preload" href="#" as="style" type="text/css" crossorigin&gt;</code></pre>

<h2>Preconnect para DNS externo</h2>
<p>Quando você sabe que vai consumir um domínio externo (Google Fonts, CDN de vídeo, pixel), antecipe o handshake DNS/TLS:</p>
<pre><code>&lt;link rel="preconnect" href="#" crossorigin&gt;</code></pre>

<h2>Vídeo (mobile)</h2>
<pre><code>&lt;link href="#" rel="preload" as="video" media="(max-width: 767px)"&gt;</code></pre>

<h2>Dica</h2>
<p>Não abuse: pré-carregar demais derruba o LCP em vez de melhorar. Mantenha apenas 1-3 recursos realmente críticos acima da dobra.</p>`,
  },
  {
    title: 'Cache-Control Header para WebP Express',
    slug: 'webp-express-cache-control-header',
    type: 'TEXT',
    categorySlug: 'performance-e-cache',
    excerpt: 'Header otimizado para servir imagens WebP convertidas pelo WebP Express com cache longo e revalidação inteligente.',
    content: `<h2>O header recomendado</h2>
<p>No painel do plugin WebP Express, em <strong>Cache-Control Header</strong>, cole:</p>
<pre><code>public, max-age=86400, stale-while-revalidate=604800, stale-if-error=604800</code></pre>

<h2>O que cada diretiva faz</h2>
<ul>
  <li><strong>public</strong>: permite cache em qualquer proxy/CDN do caminho.</li>
  <li><strong>max-age=86400</strong>: válido por 24 horas no navegador.</li>
  <li><strong>stale-while-revalidate=604800</strong>: por 7 dias após expirar, ainda serve a versão antiga enquanto baixa a nova em background.</li>
  <li><strong>stale-if-error=604800</strong>: se o servidor falhar, mantém a versão antiga por mais 7 dias em vez de quebrar a página.</li>
</ul>

<h2>Por que esse combo</h2>
<p>Você ganha imagens carregando do cache em milissegundos sem sacrificar atualizações: usuários veem a versão atual eventualmente, mas nunca esperam pelo servidor.</p>`,
  },
  {
    title: 'Placeholder responsivo SVG para LiteSpeed Cache',
    slug: 'placeholder-responsivo-svg-litespeed',
    type: 'TEXT',
    categorySlug: 'performance-e-cache',
    excerpt: 'SVG inline parametrizado para o LiteSpeed Cache substituir imagens enquanto carregam, evitando Layout Shift (CLS).',
    content: `<h2>O placeholder</h2>
<p>No LiteSpeed Cache, em <strong>Page Optimization &gt; Media &gt; Responsive Placeholder</strong>, cole:</p>
<pre><code>&lt;svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}"&gt;&lt;rect width="100%" height="100%" style="fill:{color};fill-opacity: 0.1;"/&gt;&lt;/svg&gt;</code></pre>

<h2>O que faz</h2>
<p>O LiteSpeed substitui <code>{width}</code>, <code>{height}</code> e <code>{color}</code> pelas dimensões reais de cada imagem antes do lazy load. Resultado: o navegador reserva exatamente o espaço da imagem, evitando saltos de layout (CLS = 0).</p>

<h2>Vantagens sobre o placeholder padrão</h2>
<ul>
  <li>Não baixa nenhuma imagem extra — é inline.</li>
  <li>Pega a cor dominante da imagem original.</li>
  <li>Mantém as proporções perfeitas, eliminando reflow.</li>
</ul>`,
  },
  {
    title: 'Favicon em Base64: economize uma request HTTP',
    slug: 'favicon-base64',
    type: 'TEXT',
    categorySlug: 'performance-e-cache',
    excerpt: 'Converta seu favicon SVG para Base64 e cole no Custom Code do tema — uma request a menos no carregamento.',
    content: `<h2>Por que fazer isso</h2>
<p>Cada favicon é uma request HTTP que bloqueia parcialmente o render. Inlineando-o em Base64, você elimina essa request inteira.</p>

<h2>Passo a passo</h2>
<ol>
  <li>Acesse <a href="https://base64.guru/converter/encode/image/svg" target="_blank" rel="noreferrer noopener">base64.guru/converter/encode/image/svg</a></li>
  <li>Faça upload do seu favicon (SVG é o ideal — fica menor que PNG).</li>
  <li>Copie o resultado <code>data:image/svg+xml;base64,...</code>.</li>
  <li>Cole no <strong>Custom Code</strong> do seu tema (Elementor, Astra, etc.) dentro de uma tag <code>&lt;link rel="icon" href="..."&gt;</code>.</li>
  <li>Remova o favicon personalizado do painel do tema para evitar duplicidade.</li>
</ol>

<h2>Exemplo do código final</h2>
<pre><code>&lt;link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4..."&gt;</code></pre>

<h2>Atenção</h2>
<p>Favicons em PNG/ICO acima de 5 KB não compensam virar Base64 — o ganho da request economizada vira perda no HTML inflado. Use SVG sempre que possível.</p>`,
  },
  {
    title: 'Excluir o JS do Google Maps no LiteSpeed Cache',
    slug: 'excluir-js-google-maps-litespeed',
    type: 'TEXT',
    categorySlug: 'performance-e-cache',
    excerpt: 'Adicione estas duas strings às exclusões de JS do LiteSpeed para que o mapa do Google não quebre depois de otimizado.',
    content: `<h2>O problema</h2>
<p>Quando o LiteSpeed combina/otimiza scripts, o JS do Google Maps frequentemente quebra e o mapa não carrega ou fica em branco.</p>

<h2>A solução</h2>
<p>No LiteSpeed Cache, em <strong>Page Optimization &gt; JS Settings &gt; JS Excludes</strong>, adicione:</p>
<pre><code>maps.googleapis.com
map.js</code></pre>

<h2>Resultado</h2>
<p>O LiteSpeed deixa esses scripts intocados, mantendo a otimização do resto do site. O mapa volta a carregar normalmente sem você precisar desativar o cache de JS inteiro.</p>`,
  },

  // ───────────────────────── TRACKING E UTMs ─────────────────────────────────
  {
    title: 'UTMs e parâmetros que NÃO devem ser cacheados',
    slug: 'utms-parametros-nao-cachear',
    type: 'TEXT',
    categorySlug: 'tracking-e-utms',
    excerpt: 'Lista de query strings (UTMs, gclid, fbclid, sck, etc.) que devem entrar nas exclusões do cache para preservar atribuição.',
    content: `<h2>Por que isso importa</h2>
<p>Se o cache armazena uma página com <code>?utm_campaign=facebook</code>, todo mundo que cair nessa URL vai contar como vindo dessa campanha — quebrando atribuição e UTMs do tráfego real.</p>

<h2>Strings para excluir do cache</h2>
<p>No LiteSpeed Cache, WP Rocket ou similares, em <strong>Não cachear URLs com query string</strong>:</p>
<pre><code>utm_campaign
utm_source
utm_term
utm_medium
utm_content
x-cod
gclid
fbclid
first_utm_campaign
first_utm_source
first_utm_term
first_utm_medium
first_utm_content
handl_original_ref
handl_landing_page
handl_ip
handl_ref
handl_url
organic_source
gaclientid
src
sck
ref</code></pre>

<h2>O que cada uma é</h2>
<ul>
  <li><strong>utm_*</strong>: parâmetros padrão do Google Analytics.</li>
  <li><strong>first_utm_*</strong>: usados por scripts de "first touch attribution".</li>
  <li><strong>gclid</strong>: Google Ads click ID.</li>
  <li><strong>fbclid</strong>: Facebook Ads click ID.</li>
  <li><strong>handl_*</strong>: HandL UTM Grabber (plugin popular WP).</li>
  <li><strong>sck</strong>: source/medium/campaign concatenado da Eduzz e similares.</li>
</ul>`,
  },
  {
    title: 'Página de obrigado e redirect de WhatsApp: nunca cachear',
    slug: 'pagina-obrigado-whatsapp-sem-cache',
    type: 'TEXT',
    categorySlug: 'tracking-e-utms',
    excerpt: 'Páginas de conversão precisam ser dinâmicas para disparar pixels corretamente. Veja como excluí-las do cache.',
    content: `<h2>Por que excluir do cache</h2>
<p>Páginas de obrigado e redirect de WhatsApp são pontos de conversão. Se forem cacheadas:</p>
<ul>
  <li>O pixel pode disparar para visitas repetidas (inflando conversões).</li>
  <li>UTMs da venda original não chegam até o pixel.</li>
  <li>Eventos de compra/lead duplicam ou somem.</li>
</ul>

<h2>Como excluir</h2>
<p>No LiteSpeed Cache, em <strong>Cache &gt; Excludes &gt; Do Not Cache URIs</strong>, adicione padrões como:</p>
<pre><code>/obrigado
/obrigado/
/obrigada
/redirect-whats
/redirect-wpp
/wpp</code></pre>

<h2>Validação</h2>
<p>Abra a página em aba anônima e veja no DevTools (Network &gt; Response Headers) se aparece <code>x-litespeed-cache: miss</code>. Se sim, está fora do cache.</p>`,
  },
  {
    title: 'Exclusões de JS para reduzir Connect Rate (Pixel Facebook e Google)',
    slug: 'exclusoes-js-pixel-connect-rate',
    type: 'TEXT',
    categorySlug: 'tracking-e-utms',
    excerpt: 'Atrasar JS otimiza o site mas atrapalha o disparo de pixels. Veja as strings exatas para excluir conforme cada plugin.',
    content: `<h2>O problema</h2>
<p>Otimizadores de JS (como LiteSpeed e WP Rocket) atrasam a execução de scripts até o primeiro clique/scroll. Isso quebra o disparo do pixel — visitas curtas saem sem registrar e o Connect Rate (qualidade do pixel) despenca.</p>

<h2>Regra geral</h2>
<p>Adicione <strong>apenas o pixel</strong> nas exclusões de Delay JS / Defer JS — nunca o JS inteiro.</p>

<h2>PixelYourSite (plugin clássico)</h2>
<pre><code>/wp-content/plugins/pixelyoursite/dist/scripts/jquery.bind-first*
/wp-content/plugins/pixelyoursite/dist/scripts/js.cookie-*
/wp-content/plugins/pixelyoursite/dist/scripts/public.js
fbq
fbevents.js
pysOptions
pys
pys-js
/jquery-?[0-9.](.*)(.min|.slim|.slim.min)?.js</code></pre>

<h2>Pixel APP (plugin novo)</h2>
<pre><code>pxa-remote
pxa-(.*).js</code></pre>

<h2>Instalação manual (Pixel direto no Custom Code)</h2>
<pre><code>fbevents.js
fbq</code></pre>

<h2>Google (Analytics, Tag Manager, AdSense)</h2>
<pre><code>/gtag/js
gtag
/gtm.js
/gtm-
google-analytics.com/analytics.js
adsbygoogle.js</code></pre>

<h2>Resultado</h2>
<p>O pixel dispara imediatamente no carregamento, o restante do JS continua otimizado, e o Connect Rate volta para 8+ no Facebook Ads.</p>`,
  },
  {
    title: 'Puxar UTMs e injetar no CTA automaticamente',
    slug: 'puxar-utms-injetar-cta',
    type: 'TEXT',
    categorySlug: 'tracking-e-utms',
    excerpt: 'Script JS que lê o parâmetro ?ls= da URL e adiciona automaticamente em todos os botões CTA com IDs específicos.',
    content: `<h2>Caso de uso</h2>
<p>Você roda anúncios com URL contendo <code>?ls=pgv_facebook01</code>. Quando o visitante clica em qualquer CTA, esse parâmetro precisa ir junto para o checkout para preservar a atribuição.</p>

<h2>O script</h2>
<p>Cole no Custom Code (footer) da página:</p>
<pre><code>&lt;script&gt;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const param = urlParams.get('ls');

document.addEventListener('DOMContentLoaded', () =&gt; {
    const btnFund1 = document.querySelector("#btn-fundador1");
    const btnFund2 = document.querySelector("#btn-fundador2");
    const btnFund3 = document.querySelector("#btn-fundador3");

    if (param) {
        btnFund1.href += param;
        btnFund2.href += param;
        btnFund3.href += param;
    }
});
&lt;/script&gt;</code></pre>

<h2>Como adaptar</h2>
<ul>
  <li>Troque <code>'ls'</code> pelo nome do parâmetro que você usa (pode ser <code>utm_campaign</code>, <code>src</code>, etc.).</li>
  <li>Os IDs (<code>#btn-fundador1</code>, etc.) devem bater com o atributo ID dos seus botões no Elementor (campo "Avançado &gt; CSS ID").</li>
  <li>O href base do botão precisa terminar em <code>?ls=</code> — o script só concatena o valor.</li>
</ul>

<h2>Versão genérica</h2>
<p>Para pegar todos os CTAs sem precisar de IDs, troque os querySelectors por:</p>
<pre><code>document.querySelectorAll('.cta a').forEach(btn =&gt; {
    if (param) btn.href += param;
});</code></pre>`,
  },

  // ───────────────────────── SNIPPETS CSS ────────────────────────────────────
  {
    title: 'Remover barra de rolagem horizontal indesejada',
    slug: 'remover-scrollbar-horizontal',
    type: 'TEXT',
    categorySlug: 'snippets-css',
    excerpt: 'CSS de 4 linhas para eliminar scroll horizontal causado por elementos que estouram a viewport.',
    content: `<h2>Quando acontece</h2>
<p>Algum elemento (geralmente uma seção full-width, um vídeo ou uma animação) está ultrapassando a largura da viewport e causa scroll horizontal no mobile.</p>

<h2>A correção</h2>
<pre><code>html, body {
    width: 100%;
    overflow-x: hidden;
}</code></pre>

<h2>Onde colar</h2>
<p>No <strong>Customizar &gt; CSS Adicional</strong> do WordPress, ou no <strong>Site Settings &gt; Custom CSS</strong> do Elementor.</p>

<h2>Atenção</h2>
<p>Esse é um "band-aid". Sempre vale investigar qual elemento está estourando — geralmente é uma seção com margem negativa, padding errado ou uma imagem com <code>min-width</code> grande demais. Mas como hotfix imediato, resolve.</p>`,
  },
  {
    title: 'Remover barra de rolagem vertical duplicada no Elementor',
    slug: 'remover-scrollbar-vertical-duplicada-elementor',
    type: 'TEXT',
    categorySlug: 'snippets-css',
    excerpt: 'Quando o Elementor mostra duas scrollbars verticais (do body e da página), use este CSS conforme o tipo de página.',
    content: `<h2>O bug</h2>
<p>Em algumas combinações de tema + Elementor, aparece uma segunda barra de rolagem vertical do lado direito — uma do body e outra do container do Elementor.</p>

<h2>Para Elementor Canvas (página em branco)</h2>
<pre><code>[data-elementor-type="wp-page"] {
    overflow: hidden;
}</code></pre>

<h2>Para Elementor Largura Total / Post</h2>
<pre><code>[data-elementor-type="wp-post"] {
    overflow: hidden;
}</code></pre>

<h2>Como saber qual usar</h2>
<p>Inspecione a página (F12 &gt; Elements) e procure pelo atributo <code>data-elementor-type</code> no body ou no container principal. O valor que aparecer (<code>wp-page</code> ou <code>wp-post</code>) define qual seletor usar.</p>

<h2>Onde colar</h2>
<p>Em <strong>Elementor &gt; Site Settings &gt; Custom CSS</strong> (em temas baseados em Hello Theme) ou no CSS adicional do tema.</p>`,
  },
  {
    title: 'Efeito pulse "coração" no botão CTA',
    slug: 'efeito-pulse-coracao-cta',
    type: 'TEXT',
    categorySlug: 'snippets-css',
    excerpt: 'Animação CSS que faz o botão "respirar" suavemente, chamando atenção sem ser agressivo.',
    content: `<h2>Como ficou</h2>
<p>O botão fica oscilando entre 100% e 110% do tamanho a cada 0,7 segundos — como um coração batendo. Ideal para CTAs principais.</p>

<h2>O CSS</h2>
<pre><code>.pulse {
    animation: pulse 0.7s infinite;
    margin: 0 auto;
    display: table;
    margin-top: 0px;
    animation-direction: alternate;
    -webkit-animation-name: pulse;
    animation-name: pulse;
}

@-webkit-keyframes pulse {
    0%   { -webkit-transform: scale(1); }
    100% { -webkit-transform: scale(1.1); }
}

@keyframes pulse {
    0%   { transform: scale(1); }
    100% { transform: scale(1.1); }
}</code></pre>

<h2>Como aplicar no Elementor</h2>
<ol>
  <li>Cole o CSS em <strong>Site Settings &gt; Custom CSS</strong>.</li>
  <li>No botão, adicione a classe <code>pulse</code> em <strong>Avançado &gt; CSS Classes</strong>.</li>
</ol>

<h2>Quando NÃO usar</h2>
<p>Em formulários longos ou páginas com muitos botões — o efeito vira ruído visual. Mantenha apenas no CTA principal da seção.</p>`,
  },
  {
    title: 'Efeito pulse "radar" no botão CTA',
    slug: 'efeito-pulse-radar-cta',
    type: 'TEXT',
    categorySlug: 'snippets-css',
    excerpt: 'Animação de ondas concêntricas (estilo radar) saindo do botão. Mais discreta que o pulse de escala — não move o layout.',
    content: `<h2>Diferença para o pulse "coração"</h2>
<p>Em vez de redimensionar o botão (e mexer no layout dos vizinhos), este efeito usa <code>box-shadow</code> animado, que renderiza fora do fluxo. Resultado: ondas se expandindo sem causar reflow.</p>

<h2>O CSS</h2>
<pre><code>.cta-pulse .elementor-button {
    animation: pisca 1.2s infinite;
    box-shadow: 0px 0px 20px -5px var(--e-global-color-accent);
}

@keyframes pisca {
    70%  { box-shadow: 0 0 0 20px transparent; }
    100% { box-shadow: 0 0 0 0 transparent; }
}

.cta-pulse .elementor-button svg {
    height: 0.9em;
    fill: #028c49;
}</code></pre>

<h2>Como aplicar</h2>
<ol>
  <li>Cole em <strong>Site Settings &gt; Custom CSS</strong>.</li>
  <li>Na seção/coluna que contém o botão, adicione a classe <code>cta-pulse</code> em <strong>Avançado &gt; CSS Classes</strong>.</li>
  <li>A cor do pulse usa <code>--e-global-color-accent</code> — defina sua cor de destaque em <strong>Site Settings &gt; Global Colors</strong>.</li>
</ol>

<h2>Vantagem performance</h2>
<p><code>box-shadow</code> é GPU-accelerated nos navegadores modernos. Esse efeito não custa nada em FPS, mesmo no mobile.</p>`,
  },

  // ───────────────────────── SNIPPETS JAVASCRIPT ─────────────────────────────
  {
    title: 'Script de delay vinculado ao play do vídeo (SmartPlayer)',
    slug: 'script-delay-vinculado-ao-play',
    type: 'TEXT',
    categorySlug: 'snippets-javascript',
    excerpt: 'Esconde seções (CTA, oferta, depoimentos) e libera só depois de X segundos assistidos. Versão SmartPlayer com localStorage.',
    content: `<h2>O que faz</h2>
<p>Elementos com a classe <code>.esconder</code> ficam ocultos. Quando o vídeo do SmartPlayer atinge o tempo configurado (em segundos), eles aparecem. O localStorage memoriza para não esconder no segundo acesso.</p>

<h2>Atenção: bug conhecido</h2>
<p>Esse script pode bugar no 2º acesso pelo Chrome se o autoPlay estiver ativo. Para alternativa sem esse problema, veja o artigo <em>"Script de delay sem vínculo"</em>.</p>

<h2>O código</h2>
<pre><code>&lt;style&gt;.esconder { display: none }&lt;/style&gt;

&lt;script nowprocket type="text/javascript"&gt;
document.addEventListener("DOMContentLoaded", function() {
    /* ALTERE O VALOR PARA OS SEGUNDOS EM QUE AS SEÇÕES VÃO APARECER */
    var SECONDS_TO_DISPLAY = 220;
    var CLASS_TO_DISPLAY = ".esconder";

    var attempts = 0;
    var elsHiddenList = [];
    var elsDisplayed = false;
    var elsHidden = document.querySelectorAll(CLASS_TO_DISPLAY);
    var alreadyDisplayedKey = \`alreadyElsDisplayed\${SECONDS_TO_DISPLAY}\`;
    var alreadyElsDisplayed = localStorage.getItem(alreadyDisplayedKey);

    setTimeout(function () { elsHiddenList = Array.prototype.slice.call(elsHidden); }, 0);

    var showHiddenElements = function () {
        elsDisplayed = true;
        elsHiddenList.forEach((e) =&gt; e.style.display = "block");
        localStorage.setItem(alreadyDisplayedKey, true);
    };

    var startWatchVideoProgress = function () {
        if (typeof smartplayer === 'undefined' || !(smartplayer.instances && smartplayer.instances.length)) {
            if (attempts &gt;= 10) return;
            attempts += 1;
            return setTimeout(function () { startWatchVideoProgress() }, 1000);
        }

        smartplayer.instances[0].on('timeupdate', () =&gt; {
            if (elsDisplayed || smartplayer.instances[0].smartAutoPlay) return;
            if (smartplayer.instances[0].video.currentTime &lt; SECONDS_TO_DISPLAY) return;
            showHiddenElements();
        });
    };

    if (alreadyElsDisplayed === 'true') {
        setTimeout(function () { showHiddenElements(); }, 100);
    } else {
        startWatchVideoProgress();
    }
});
&lt;/script&gt;</code></pre>

<h2>Como usar</h2>
<ol>
  <li>Cole o código no Custom Code (footer).</li>
  <li>Em cada seção que deve aparecer só depois, adicione a classe CSS <code>esconder</code>.</li>
  <li>Ajuste <code>SECONDS_TO_DISPLAY</code> para o momento da pitch.</li>
</ol>`,
  },
  {
    title: 'Script de delay sem vínculo com vídeo (compatível com Chrome)',
    slug: 'script-delay-sem-vinculo',
    type: 'TEXT',
    categorySlug: 'snippets-javascript',
    excerpt: 'Versão que libera as seções após um tempo fixo independente do vídeo. Sem o bug do localStorage do Chrome.',
    content: `<h2>Quando usar</h2>
<p>Use quando você não tem SmartPlayer, quando o vídeo é YouTube/Vimeo embed, ou quando o script de delay vinculado deu problema no 2º acesso.</p>

<h2>O código</h2>
<pre><code>&lt;style&gt;
    .esconder {
        top: -100% !important;
        opacity: 0;
        position: absolute;
        height: 0;
        overflow: hidden;
        pointer-events: none;
    }
&lt;/style&gt;

&lt;script&gt;
var elementosEscondidos = document.querySelectorAll('.esconder');

setTimeout(function() {
    elementosEscondidos.forEach(function(elemento) {
        elemento.classList.remove("esconder");
    });
}, 1000 * 5);
/* altere o número de segundos:
   1000 * 5     = 5 segundos
   1000 * 60    = 1 minuto
   1000 * 5 * 60 = 5 minutos */
&lt;/script&gt;</code></pre>

<h2>Por que esse CSS de esconder é melhor</h2>
<p>Em vez de <code>display: none</code>, ele tira o elemento do fluxo com <code>position: absolute; top: -100%</code>. Vantagens:</p>
<ul>
  <li>Não mexe no layout quando aparece — o espaço já está reservado.</li>
  <li>Funciona em iframes/vídeos sem causar reload.</li>
  <li><code>pointer-events: none</code> impede cliques fantasmas em CTAs invisíveis.</li>
</ul>`,
  },
  {
    title: 'Declarar Header, Main, Article e Footer com scroll offset',
    slug: 'declarar-header-main-article-footer-scroll',
    type: 'TEXT',
    categorySlug: 'snippets-javascript',
    excerpt: 'Sobrescreve o smooth scroll do Elementor para respeitar offset do header fixo. Baseado no tutorial do Cleber Ferreira.',
    content: `<h2>O problema</h2>
<p>Quando você tem header fixo (sticky) e usa âncoras no menu (ex: <code>#sobre</code>), o Elementor faz scroll até a seção mas o header tampa o início dela.</p>

<h2>A solução</h2>
<p>Sobrescrever o smooth-scroll do Elementor e adicionar <code>scroll-padding-top</code> no html/body.</p>

<h2>Script (cole no Custom Code &gt; Head)</h2>
<pre><code>&lt;script&gt;
window.addEventListener('elementor/frontend/init', function() {
    if (typeof elementorFrontend === 'undefined') {
        return;
    }
    elementorFrontend.on('components:init', function() {
        elementorFrontend.utils.anchors.setSettings('selectors', {});
    });
});
&lt;/script&gt;

&lt;style&gt;
html, body {
    scroll-padding-top: 100px; /* ajuste para a altura do seu header */
}

@media (prefers-reduced-motion: no-preference) {
    html, body {
        scroll-behavior: smooth;
    }
}
&lt;/style&gt;</code></pre>

<h2>O que cada parte faz</h2>
<ul>
  <li>O script remove os seletores padrão do Elementor para que o navegador assuma o scroll nativo.</li>
  <li><code>scroll-padding-top</code> diz: "pare X pixels antes da seção" — exatamente a altura do header.</li>
  <li>O <code>prefers-reduced-motion</code> respeita usuários com sensibilidade a animações (acessibilidade).</li>
</ul>

<h2>Vídeo de referência</h2>
<p><a href="https://youtu.be/A5SUAf8SSGI?feature=shared&t=587" target="_blank" rel="noreferrer noopener">Tutorial original (timestamp 9:47)</a></p>`,
  },
  {
    title: 'Link externo sem perder SEO juice (rel attributes)',
    slug: 'link-externo-sem-perder-seo-juice',
    type: 'TEXT',
    categorySlug: 'snippets-javascript',
    excerpt: 'HTML correto para links externos: nofollow para não passar autoridade, noreferrer e noopener para segurança.',
    content: `<h2>O que cada atributo faz</h2>
<ul>
  <li><strong>nofollow</strong>: avisa ao Google "não passe autoridade SEO por este link".</li>
  <li><strong>noreferrer</strong>: não envia o cabeçalho Referer ao site de destino (privacidade).</li>
  <li><strong>noopener</strong>: o site aberto em nova aba não consegue manipular sua aba original via <code>window.opener</code> (segurança).</li>
  <li><strong>target="_blank"</strong>: abre em nova aba.</li>
</ul>

<h2>Link externo que NÃO deve passar juice</h2>
<pre><code>&lt;a href="#LINK AQUI" rel="nofollow" target="_blank" rel="noreferrer noopener"&gt;TEXTO AQUI&lt;/a&gt;</code></pre>

<h2>Link interno (página própria — passa juice normalmente)</h2>
<pre><code>&lt;a href="#LINK AQUI"&gt;Política de Privacidade&lt;/a&gt;</code></pre>

<h2>Quando usar nofollow</h2>
<ul>
  <li>Links pagos / afiliados.</li>
  <li>Links para parceiros que não fazem parte do seu funil SEO.</li>
  <li>Comentários de usuários ou conteúdo gerado pela comunidade.</li>
</ul>

<h2>Cuidado</h2>
<p>Não saia colocando <code>nofollow</code> em todo lugar — links para fontes confiáveis melhoram seu SEO. Use só para links que você não quer "endossar".</p>`,
  },

  // ───────────────────────── CHECKOUT E VENDAS ───────────────────────────────
  {
    title: 'Checkout pré-populado na Hotmart (parâmetros e ocultação de pagamentos)',
    slug: 'checkout-pre-populado-hotmart',
    type: 'TEXT',
    categorySlug: 'checkout-e-vendas',
    featured: true,
    excerpt: 'URL completa com parâmetros que pré-enchem nome, e-mail, telefone e UTMs no checkout da Hotmart. Inclui flags para esconder formas de pagamento.',
    content: `<h2>Por que pré-popular</h2>
<p>Reduz fricção: o cliente já chega no checkout com os dados preenchidos. Aumenta conversão de 5-15% em média e elimina erros de digitação.</p>

<h2>Setup no formulário</h2>
<ol>
  <li>Configure cada campo com um <em>parâmetro de consulta</em> único (ex: <code>nome</code>, <code>email</code>, <code>whats</code>).</li>
  <li>Redirecione o submit para o link da Hotmart com os shortcodes.</li>
</ol>

<h2>Parâmetros principais</h2>
<ul>
  <li><strong>&amp;name=</strong> Nome do comprador</li>
  <li><strong>&amp;email=</strong> E-mail</li>
  <li><strong>&amp;phoneac=</strong> DDD + telefone (concatenado)</li>
  <li><strong>&amp;phonenumber=</strong> Apenas o telefone (sem DDD)</li>
</ul>

<h2>Exemplo de URL base</h2>
<pre><code>https://pay.hotmart.com/B42241190A?off=paqarjrb&amp;checkoutMode=10</code></pre>

<h2>URL final com pré-preenchimento</h2>
<pre><code>https://pay.hotmart.com/B42241190A?off=paqarjrb&amp;checkoutMode=10&amp;name=[field id="nome"]&amp;email=[field id="email"]&amp;phoneac=[field id="whats"]</code></pre>

<h2>Versão completa com UTMs (recomendada)</h2>
<pre><code>https://pay.hotmart.com/V102345728W?checkoutMode=0&amp;name=[field id="nome"]&amp;phoneac=[field id="telefone"]&amp;email=[field id="email"]&amp;utm_source=[field id="utm_source"]&amp;utm_medium=[field id="utm_medium"]&amp;utm_campaign=[field id="utm_campaign"]&amp;utm_term=[field id="utm_term"]&amp;utm_content=[field id="utm_content"]&amp;sck=[field id="source"]|[field id="medium"]|[field id="campaign"]|[field id="term"]|[field id="content"]</code></pre>

<h2>Flags úteis</h2>
<ul>
  <li><strong>&amp;split=12</strong> — mostra preço parcelado em 12x na vitrine.</li>
  <li><strong>&amp;hideBillet=1</strong> — esconde boleto.</li>
  <li><strong>&amp;hidePayPal=1</strong> — esconde PayPal.</li>
  <li><strong>&amp;hideTransf=1</strong> — esconde transferência.</li>
  <li><strong>&amp;hideMultipleCards=1</strong> — esconde pagamento em 2 cartões.</li>
  <li><strong>&amp;hidePix=1</strong> — esconde PIX.</li>
</ul>

<h2>Dica</h2>
<p>Para sites de oferta de baixo ticket, esconda boleto e transferência — você reduz desistências e fraudes.</p>`,
  },
  {
    title: 'Checkout pré-populado na Guru',
    slug: 'checkout-pre-populado-guru',
    type: 'TEXT',
    categorySlug: 'checkout-e-vendas',
    excerpt: 'URL com parâmetros name, email e phone para pré-encher o checkout da Guru direto do seu formulário.',
    content: `<h2>Estrutura do link</h2>
<p>O checkout da Guru aceita três parâmetros de query string para pré-preencher os campos:</p>

<h2>Exemplo prático</h2>
<pre><code>https://pagamento.ieac.net.br/checkout/mentoria-profissionais?name=[field id="name"]&amp;email=[field id="email"]&amp;phone=[field id="phone"]</code></pre>

<h2>Como adaptar</h2>
<ol>
  <li>Troque <code>pagamento.ieac.net.br/checkout/mentoria-profissionais</code> pelo seu domínio + slug do produto.</li>
  <li>Mantenha os shortcodes <code>[field id="..."]</code> — eles são interpretados pelo Elementor Forms na hora do submit.</li>
  <li>Garanta que os IDs dos campos no Elementor são exatamente <code>name</code>, <code>email</code>, <code>phone</code>.</li>
</ol>

<h2>Como configurar o submit no Elementor</h2>
<ol>
  <li>Edite o widget Form &gt; Ações Após Envio &gt; Adicione <strong>Redirect</strong>.</li>
  <li>Em "Redirect To", cole a URL acima.</li>
  <li>Teste enviando o form com dados reais.</li>
</ol>

<h2>Sem campo telefone</h2>
<p>Você pode omitir <code>phone</code> se o seu funil não captura — a Guru cobra apenas o que está marcado como obrigatório na configuração do produto.</p>`,
  },
  {
    title: 'Checkouts pré-populados: Eduzz e Greenn',
    slug: 'checkouts-pre-populados-eduzz-greenn',
    type: 'TEXT',
    categorySlug: 'checkout-e-vendas',
    excerpt: 'Links para a documentação oficial de pré-preenchimento da Eduzz (Checkout Sun) e da Greenn.',
    content: `<h2>Eduzz (Checkout Sun)</h2>
<p>A Eduzz mantém uma documentação detalhada de todos os parâmetros aceitos no Checkout Sun, incluindo dados do comprador, UTMs, oferta padrão e desconto promocional.</p>
<p><strong>Documentação oficial:</strong></p>
<p><a href="https://ajuda.eduzz.com/hc/pt-br/articles/4402887369627-Como-configurar-os-Par%C3%A2metros-adicionais-no-meu-link-de-vendas-Checkout-Sun" target="_blank" rel="noreferrer noopener">Como configurar os Parâmetros adicionais no meu link de vendas (Checkout Sun)</a></p>

<h2>Greenn</h2>
<p>A Greenn tem um tutorial específico para integração com Elementor.</p>
<p><strong>Documentação oficial:</strong></p>
<p><a href="https://greenn.crisp.help/pt-br/article/checkout-pre-populado-greenn-elementor-p3ulmb/" target="_blank" rel="noreferrer noopener">Checkout pré-populado Greenn + Elementor</a></p>

<h2>Padrão geral entre plataformas</h2>
<p>Os parâmetros são consistentes em todas as plataformas (Hotmart, Guru, Eduzz, Greenn):</p>
<ul>
  <li><strong>name</strong> ou <strong>nome</strong> — nome do comprador</li>
  <li><strong>email</strong> — e-mail</li>
  <li><strong>phone</strong>, <strong>phoneac</strong> ou <strong>celular</strong> — telefone</li>
  <li><strong>utm_*</strong> — parâmetros de campanha</li>
</ul>

<h2>Dica</h2>
<p>Antes de migrar de plataforma, valide se os campos do seu funil seguem a nomenclatura mais comum (<code>name</code>, <code>email</code>, <code>phone</code>). Isso economiza tempo de reconfiguração no futuro.</p>`,
  },

  // ───────────────────── ELEMENTOR E ACESSIBILIDADE ──────────────────────────
  {
    title: 'Fix de acessibilidade em sanfona, acordeão e abas do Elementor',
    slug: 'fix-acessibilidade-sanfona-abas-elementor',
    type: 'TEXT',
    categorySlug: 'elementor-e-acessibilidade',
    excerpt: 'Script que corrige os erros de acessibilidade reportados pelo Lighthouse nos widgets de sanfona, acordeão, abas e botões SVG.',
    content: `<h2>Os erros comuns do Lighthouse</h2>
<ul>
  <li><strong>Heading elements are not in a sequentially-descending order</strong> — títulos da sanfona usam h3 dentro de h1.</li>
  <li><strong>[tabindex] values are greater than 0</strong> — abas com tabindex incorreto.</li>
  <li><strong>Buttons do not have an accessible name</strong> — botões SVG sem aria-label.</li>
</ul>

<h2>O script completo</h2>
<p>Cole no Custom Code (footer):</p>
<pre><code>&lt;script nowprocket&gt;
/* widget sanfona — substitui o título por span sem heading conflitante */
const elementosAccordion = document.querySelectorAll('.elementor-accordion-title');
elementosAccordion.forEach(elementoAccordion =&gt; {
    const novoElemento = document.createElement('span');
    novoElemento.innerHTML = elementoAccordion.innerHTML;
    novoElemento.classList.add("elementor-accordion-title");
    elementoAccordion.parentNode.replaceChild(novoElemento, elementoAccordion);
});

/* widget sanfona e acordeão — remove tabindex inválido */
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() =&gt; {
        const tabTitles = document.querySelectorAll('.elementor-tab-title');
        tabTitles.forEach(tabTitle =&gt; {
            tabTitle.setAttribute("tabindex", "-1");
        });
    }, 500);
});

/* widget de abas — corrige aria-hidden e tabindex */
const tabsWrapper = document.querySelectorAll(".elementor-tabs-content-wrapper");
const tabContents = document.querySelectorAll('.elementor-tab-content');
tabContents.forEach(tabContent =&gt; {
    tabContent.setAttribute("tabindex", "-1");
});
tabsWrapper.forEach(tabWrapper =&gt; {
    tabWrapper.setAttribute('aria-hidden', 'true');
});

/* botões SVG — adiciona aria-label */
const botoes = document.querySelectorAll(".botao a");
botoes.forEach(botao =&gt; {
    botao.setAttribute('aria-label', 'QUERO ME INSCREVER AGORA');
});
&lt;/script&gt;</code></pre>

<h2>Como adaptar</h2>
<ul>
  <li>Troque o texto <code>'QUERO ME INSCREVER AGORA'</code> pelo texto do seu CTA (esse será lido por leitores de tela).</li>
  <li>Para botões com classes diferentes de <code>.botao a</code>, ajuste o seletor.</li>
</ul>

<h2>Validação</h2>
<p>Rode o Lighthouse novamente (DevTools &gt; Lighthouse &gt; Accessibility) — os 4 erros listados devem desaparecer.</p>`,
  },
  {
    title: 'Honeypot para evitar bots em formulário ActiveCampaign nativo',
    slug: 'honeypot-bots-active-campaign',
    type: 'TEXT',
    categorySlug: 'elementor-e-acessibilidade',
    excerpt: 'Campo invisível tipo "chamariz" que bots preenchem e humanos não. Bloqueia o envio sem mostrar captcha.',
    content: `<h2>Como funciona</h2>
<p>Bots leem o HTML do formulário e preenchem todos os campos. Humanos só preenchem o que veem. Adicionando um campo escondido por CSS, podemos detectar bots: se vier preenchido, é spam — bloqueia o submit.</p>

<h2>Vantagem sobre captcha</h2>
<ul>
  <li>Zero fricção para usuário real.</li>
  <li>Não depende de Google reCAPTCHA (privacidade).</li>
  <li>Não tem custo.</li>
</ul>

<h2>Passo 1 — adicione o campo no formulário do ActiveCampaign</h2>
<p>Antes do botão de submit/enviar, insira este input:</p>
<pre><code>&lt;!-- CAMPO HONEYPOT --&gt;
&lt;input class="cmz" type="text" id="field[19]" name="field[19]" value="" placeholder=""/&gt;
&lt;!-- FIM DO CAMPO --&gt;</code></pre>

<h2>Passo 2 — adicione o CSS + JS abaixo do form</h2>
<p>Em um campo de HTML ou no Custom Code do final da página:</p>
<pre><code>&lt;style&gt;
    .cmz {
        display: none;
    }
&lt;/style&gt;

&lt;script&gt;
document.addEventListener('DOMContentLoaded', function() {
    const botao = document.querySelector('._submit');
    const cmz = document.querySelector('.cmz');

    botao.addEventListener('click', function(event) {
        if (cmz.value.trim() !== '') {
            event.preventDefault();
        }
    });
});
&lt;/script&gt;</code></pre>

<h2>Como ler</h2>
<ul>
  <li>O CSS esconde o campo de humanos.</li>
  <li>O JS intercepta o clique no botão (<code>._submit</code>) — se o campo invisível tiver qualquer valor, bloqueia o envio.</li>
</ul>

<h2>Adaptações</h2>
<ul>
  <li>O ID/name <code>field[19]</code> deve existir no seu formulário ActiveCampaign (pode ser qualquer field personalizado não usado).</li>
  <li>Se seu botão não tem a classe <code>._submit</code>, ajuste o seletor.</li>
</ul>

<h2>Resultado em produção</h2>
<p>Em uma campanha real, esse truque costuma bloquear 90%+ do spam sem que nenhum usuário humano perceba.</p>`,
  },
]

// ─── Runner ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Importando códigos da compilação "Códigos Luana"...\n')

  // 1. Upsert das categorias
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: { ...c, active: true },
    })
  }
  console.log(`✅ ${CATEGORIES.length} categorias criadas/atualizadas.`)

  // 2. Buscar admin
  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
  if (!admin) {
    throw new Error(`Usuário "${ADMIN_EMAIL}" não encontrado. Rode "npm run seed" antes para criar o admin.`)
  }

  // 3. Mapear slug → categoryId
  const allCategories = await prisma.category.findMany({ select: { id: true, slug: true } })
  const catBySlug = new Map(allCategories.map((c) => [c.slug, c.id]))

  // 4. Upsert dos artigos
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
  for (const c of CATEGORIES) {
    const n = ARTICLES.filter((a) => a.categorySlug === c.slug).length
    console.log(`   ${c.icon} ${c.name.padEnd(34)} ${n} artigos`)
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
