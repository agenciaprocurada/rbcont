import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Keep-alive do Supabase: projetos no plano Free pausam apos ~7 dias sem
// atividade. Um SELECT leve diario (via Vercel Cron — ver vercel.json) mantem
// o projeto ativo e evita o cold start de reativacao.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true, ts: new Date().toISOString() })
  } catch (err) {
    const e = err as { message?: string }
    return NextResponse.json({ ok: false, error: e.message ?? String(err) }, { status: 500 })
  }
}
