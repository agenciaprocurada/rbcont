import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ApprovalsList } from '@/components/admin/ApprovalsList'

export const dynamic = 'force-dynamic'

export default async function AprovacoesPage() {
  const session = await auth()

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Sem permissão</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Apenas Administradores têm acesso a esta página.
        </p>
      </div>
    )
  }

  const pending = await prisma.pendingRegistration.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  })

  const history = await prisma.pendingRegistration.findMany({
    where: { status: { in: ['APPROVED', 'REJECTED'] } },
    orderBy: { reviewedAt: 'desc' },
    take: 20,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      createdAt: true,
      reviewedAt: true,
      rejectReason: true,
    },
  })

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.3px' }}>
          Aprovações
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', margin: 0 }}>
          Solicitações de cadastro pendentes de revisão. Ao aprovar, escolha o tipo de usuário.
        </p>
      </div>

      <ApprovalsList pending={pending} history={history} />
    </div>
  )
}
