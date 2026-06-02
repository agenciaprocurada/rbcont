import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware Edge-safe (zero deps).
 *
 * Por que tudo é manual:
 * - NextAuth()/getToken arrastam @auth/core com __dirname (quebra no Edge)
 * - req.cookies.has() arrasta o pacote `cookie` que tem eval() (quebra no Edge)
 * Então parseamos o header de cookie na unha — só primitivos de Edge Runtime.
 *
 * Estratégia: verificar PRESENÇA do cookie de sessão.
 * Validação real do JWT acontece em cada Server Component via lib/auth.ts (Node).
 */

const SESSION_COOKIE_NAMES = [
  '__Secure-authjs.session-token',
  'authjs.session-token',
  '__Secure-next-auth.session-token',
  'next-auth.session-token',
]

function hasSessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false
  return SESSION_COOKIE_NAMES.some((name) => cookieHeader.includes(name + '='))
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', pathname)

  if (!hasSessionCookie(req.headers.get('cookie'))) {
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
    '/((?!login|cadastro|api/auth|api/cadastro|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
