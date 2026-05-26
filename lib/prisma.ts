import { PrismaClient } from '@prisma/client'

// Cacheia em globalThis em DEV (HMR) e em serverless warm-instances (Vercel).
// Sem isso, cada invocação warm cria nova PrismaClient + conexão = lento.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

globalForPrisma.prisma = prisma
