import type { NextAuthConfig } from 'next-auth'

// UserRole espelhado do enum em prisma/schema.prisma.
// Inline (não importado de @prisma/client) para manter o bundle Edge-safe.
type UserRole = 'SUPER_ADMIN' | 'EDITOR' | 'WRITER' | 'VIEWER'

/**
 * Configuração base do NextAuth — Edge-compatible.
 * SEM imports de Prisma ou bcryptjs (Node.js-only).
 * Usada pelo middleware (Edge Runtime) e extendida por auth.ts (Node.js).
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role as UserRole
        token.name = user.name ?? null
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as UserRole
      session.user.name = (token.name as string) ?? ''
      return session
    },
  },
  providers: [], // Preenchido em auth.ts com Credentials + Prisma
}
