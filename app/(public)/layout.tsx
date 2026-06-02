import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getActiveCategories } from '@/lib/cache'
import { Sidebar } from '@/components/public/Sidebar'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  const [categories, favoritesCount] = await Promise.all([
    // Conteúdo compartilhado: vem do cache (invalidado on-demand pelo admin).
    getActiveCategories(),
    // Por-usuário: sempre dinâmico.
    prisma.favorite.count({ where: { userId: session.user.id } }),
  ])

  return (
    <div className="tc-shell">
      <Sidebar
        user={{ name: session.user.name, role: session.user.role }}
        categories={categories}
        favoritesCount={favoritesCount}
      />
      <main className="tc-shell__main">{children}</main>
    </div>
  )
}
