import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Middleware Edge-safe.
 * Não usa NextAuth(authConfig) porque o bundle do @auth/core arrasta dependências
 * Node-only (__dirname) que quebram no Edge Runtime da Vercel.
 * Em vez disso, usamos getToken — função expressamente Edge-compatible do next-auth.
 */
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', pathname)

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    salt: process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token',
  })

  if (!token) {
    // APIs respondem JSON 401 em vez de redirecionar para HTML
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
