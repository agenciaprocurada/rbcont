import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Manrope, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import './globals-tc.css'
import { NavProgress } from '@/components/NavProgress'

// Fontes self-hosted pelo next/font: sem request render-blocking ao Google,
// sem FOUT, e só os pesos realmente usados. Expostas via CSS variables que o
// globals.css consome em --font-sans / --font-mono.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'RBCont',
  description: 'Base de conhecimento RBCont — tutoriais, guias e respostas organizados por categoria.',
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://ajuda.turbocloud.com.br" />
        <link rel="dns-prefetch" href="https://ajuda.rbcont.com.br" />
      </head>
      <body>
        <Suspense fallback={null}>
          <NavProgress />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
