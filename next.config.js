/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // ajuda.turbocloud.com.br mantido para artigos seedados do projeto antigo
    // que ainda referenciam imagens externas hospedadas lá.
    domains: ['ajuda.turbocloud.com.br', 'ajuda.rbcont.com.br'],
  },
}

module.exports = nextConfig
