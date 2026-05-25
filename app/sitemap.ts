import type { MetadataRoute } from 'next'

// Conteúdo atualmente protegido por login. Quando a leitura for liberada para
// visitantes anônimos, popular este array com URLs de artigos publicados para SEO.
export default function sitemap(): MetadataRoute.Sitemap {
  return []
}
