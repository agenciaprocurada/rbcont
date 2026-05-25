import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Rota de DIAGNOSTICO temporaria — REMOVER apos uso.
const DIAG_KEY = 'th-dbg-9f7a3e4b2c1d-2026'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  if (url.searchParams.get('key') !== DIAG_KEY) {
    return new NextResponse('forbidden', { status: 403 })
  }

  const email = url.searchParams.get('email') || ''
  const password = url.searchParams.get('password') || ''

  const out: Record<string, unknown> = {
    env: {
      NODE_ENV: process.env.NODE_ENV ?? null,
      hasDATABASE_URL: !!process.env.DATABASE_URL,
      DATABASE_URL_host: process.env.DATABASE_URL?.match(/@([^/?]+)/)?.[1] ?? null,
      DATABASE_URL_hasSslmode: process.env.DATABASE_URL?.includes('sslmode=require') ?? false,
      hasDIRECT_URL: !!process.env.DIRECT_URL,
      hasNEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      hasAUTH_SECRET: !!process.env.AUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? null,
      AUTH_URL: process.env.AUTH_URL ?? null,
    },
    db: null as unknown,
    user: null as unknown,
    compareResult: null as unknown,
    error: null as unknown,
  }

  try {
    const userCount = await prisma.user.count()
    out.db = { connected: true, userCount }

    if (email) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        out.user = { notFound: true }
      } else {
        out.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          active: user.active,
          hashPrefix: user.password.slice(0, 7),
          hashLen: user.password.length,
        }
        if (password) {
          out.compareResult = await compare(password, user.password)
        }
      }
    }
  } catch (err) {
    const e = err as { message?: string; name?: string; code?: string; stack?: string }
    out.error = {
      message: e.message ?? String(err),
      name: e.name ?? null,
      code: e.code ?? null,
      stack: e.stack?.split('\n').slice(0, 6).join('\n') ?? null,
    }
  }

  return NextResponse.json(out)
}
