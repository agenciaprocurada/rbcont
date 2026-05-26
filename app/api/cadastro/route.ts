import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function extractIp(req: NextRequest): string | null {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim()
  return null
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254
}

function digitsOnly(v: string) {
  return v.replace(/\D/g, '')
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 })
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const phoneRaw = typeof body?.phone === 'string' ? body.phone.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!name || name.length < 3 || name.length > 120) {
    return NextResponse.json({ error: 'Informe um nome válido.' }, { status: 400 })
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 })
  }
  const phoneDigits = digitsOnly(phoneRaw)
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return NextResponse.json({ error: 'Informe um telefone válido.' }, { status: 400 })
  }
  if (!password || password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: 'A senha deve ter entre 8 e 128 caracteres.' }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json(
      { error: 'Este e-mail já está cadastrado. Use a tela de login.' },
      { status: 409 },
    )
  }

  const pendingForEmail = await prisma.pendingRegistration.findFirst({
    where: { email, status: 'PENDING' },
  })
  if (pendingForEmail) {
    return NextResponse.json(
      { error: 'Já existe uma solicitação pendente para este e-mail.' },
      { status: 409 },
    )
  }

  const passwordHash = await hash(password, 10)
  const ip = extractIp(req)

  await prisma.pendingRegistration.create({
    data: {
      name,
      email,
      phone: phoneRaw,
      password: passwordHash,
      ip,
    },
  })

  return NextResponse.json({ ok: true })
}
