'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type { UserRole } from '@prisma/client'

async function checkSuperAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    throw new Error('Sem permissão')
  }
  return session
}

export async function approveRegistration(data: { id: string; role: UserRole }) {
  const session = await checkSuperAdmin()

  const pending = await prisma.pendingRegistration.findUnique({ where: { id: data.id } })
  if (!pending) throw new Error('Solicitação não encontrada.')
  if (pending.status !== 'PENDING') throw new Error('Esta solicitação já foi processada.')

  const existing = await prisma.user.findUnique({ where: { email: pending.email } })
  if (existing) {
    await prisma.pendingRegistration.update({
      where: { id: pending.id },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        rejectReason: 'E-mail já cadastrado como usuário ativo.',
      },
    })
    revalidatePath('/admin/aprovacoes')
    throw new Error('Já existe um usuário com este e-mail. Solicitação marcada como rejeitada.')
  }

  await prisma.$transaction([
    prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        phone: pending.phone,
        password: pending.password,
        role: data.role,
        active: true,
      },
    }),
    prisma.pendingRegistration.update({
      where: { id: pending.id },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    }),
  ])

  revalidatePath('/admin/aprovacoes')
  revalidatePath('/admin/usuarios')
  return { success: true }
}

export async function rejectRegistration(data: { id: string; reason?: string }) {
  const session = await checkSuperAdmin()

  const pending = await prisma.pendingRegistration.findUnique({ where: { id: data.id } })
  if (!pending) throw new Error('Solicitação não encontrada.')
  if (pending.status !== 'PENDING') throw new Error('Esta solicitação já foi processada.')

  await prisma.pendingRegistration.update({
    where: { id: pending.id },
    data: {
      status: 'REJECTED',
      reviewedAt: new Date(),
      reviewedBy: session.user.id,
      rejectReason: data.reason?.trim() || null,
    },
  })

  revalidatePath('/admin/aprovacoes')
  return { success: true }
}
