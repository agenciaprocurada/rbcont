import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/admin/Sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  // VIEWER não acessa o painel administrativo
  if (session.user.role === 'VIEWER') {
    redirect('/')
  }

  const isSuperAdmin = session.user.role === 'SUPER_ADMIN'

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        userName={session.user.name}
        userRole={session.user.role}
        isSuperAdmin={isSuperAdmin}
      />
      <main
        style={{
          flex: 1,
          marginLeft: '260px',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-secondary)',
          padding: '32px',
        }}
        id="admin-content"
      >
        {children}
      </main>
    </div>
  )
}
