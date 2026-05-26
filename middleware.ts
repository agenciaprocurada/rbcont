import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware Edge-safe (zero deps de next-auth).
 *
 * Por que não usa NextAuth() ou getToken():
 * O @auth/core (transitive do next-auth) bundla dependências Node-only
 * (__dirname is not defined) que quebram no Edge Runtime da Vercel.
 *
 * Estratégia: o middleware só verifica a PRESENÇA do cookie de sessão.
 * A validação completa do JWT acontece em cada Server Component/Action
 * via lib/auth.ts (Node runtime), que ainda usa NextAuth() normalmente.
 *
 * Tradeoff: um atacante com cookie inválido passa o middleware mas é
 * rejeitado na page (que faz await auth()). Mesmo nível de proteção real,
 * só muda em que camada o usuário não-autenticado é barrado.
 */

const SESSION_COOKIE_NAMES = [
  '__Secure-authjs.session-token', // produção HTTPS
  'authjs.session-token',           // dev local
  '__Secure-next-auth.session-token', // legado v4 HTTPS
  'next-auth.session-token',         // legado v4 dev
]

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', pathname)

  const hasSession = SESSION_COOKIE_NAMES.some((name) => req.cookies.has(name))

  if (!hasSession) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    const loginUrl = new URL('/login', req.nextUrl.origin)
    if (pathname !== '/') {
      loginUrl.searchParams.set('callbackUrl', pathname + req.nextUrl.search)
    }
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    '/((?!login|api/auth|api/diag|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
