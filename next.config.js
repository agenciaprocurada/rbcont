/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone' removido — conflita com o build da Vercel e estava
  // resultando em __dirname undefined no middleware Edge. Vercel não precisa
  // de standalone (usa seu próprio runtime).
  images: {
    domains: ['ajuda.turbocloud.com.br', 'ajuda.rbcont.com.br'],
  },
}

module.exports = nextConfig
