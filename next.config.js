/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone' removido — conflita com o build da Vercel e estava
  // resultando em __dirname undefined no middleware Edge. Vercel não precisa
  // de standalone (usa seu próprio runtime).
  images: {
    // AVIF/WebP automáticos: imagens (inclusive os PNGs grandes de uploads)
    // são servidas otimizadas, encolhendo bastante o peso transferido.
    formats: ['image/avif', 'image/webp'],
    // remotePatterns substitui o `domains` (deprecated).
    remotePatterns: [
      { protocol: 'https', hostname: 'ajuda.turbocloud.com.br' },
      { protocol: 'https', hostname: 'ajuda.rbcont.com.br' },
    ],
  },
}

module.exports = nextConfig
