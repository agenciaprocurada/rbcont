import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import './globals-tc.css'
import { NavProgress } from '@/components/NavProgress'

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
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
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
