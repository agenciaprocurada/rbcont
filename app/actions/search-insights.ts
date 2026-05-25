'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GoogleGenAI, Type, Schema } from '@google/genai'

const RETENTION_DAYS = 60
const WINDOW_DAYS = 30
const MIN_FAILED_SEARCHES = 3

export type ContentSuggestion = {
  tema: string
  intencaoDoUsuario: string
  evidencia: string[]
  sugestaoDeArtigo: {
    titulo: string
    excerpt: string
    topicos: string[]
  }
  prioridade: 'alta' | 'media' | 'baixa'
}

/**
 * Remove registros mais antigos que RETENTION_DAYS.
 * Roda no acesso da página admin (oportunista, sem cron).
 */
export async function pruneOldSearchActivities() {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return { deleted: 0 }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
  const res = await prisma.searchActivity.deleteMany({
    where: { createdAt: { lt: cutoff } },
  })
  return { deleted: res.count }
}

/**
 * Analisa pesquisas sem resultado dos últimos WINDOW_DAYS dias. O agrupamento
 * semântico é delegado ao Gemini — manda a lista crua e a IA decide quais
 * buscas representam o mesmo tema, ignora ruído e sugere conteúdo apenas para
 * temas com intenção clara e recorrente.
 *
 * Threshold local: precisa de pelo menos MIN_FAILED_SEARCHES buscas sem
 * resultado na janela para acionar a análise (proteção contra chamadas
 * desnecessárias à API).
 */
export async function analyzeSearchActivities(): Promise<{
  suggestions: ContentSuggestion[]
  totalAnalyzed: number
}> {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    throw new Error('Não autorizado')
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada no servidor.')
  }

  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000)

  const failed = await prisma.searchActivity.findMany({
    where: {
      resultsCount: 0,
      createdAt: { gte: since },
    },
    select: { query: true, userId: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 500,
  })

  if (failed.length < MIN_FAILED_SEARCHES) {
    return { suggestions: [], totalAnalyzed: failed.length }
  }

  // Compacta para o prompt: query + quantos usuários distintos a pesquisaram
  const usersByQuery = new Map<string, Set<string>>()
  const countByQuery = new Map<string, number>()
  for (const r of failed) {
    const q = r.query.trim()
    if (!usersByQuery.has(q)) usersByQuery.set(q, new Set())
    usersByQuery.get(q)!.add(r.userId)
    countByQuery.set(q, (countByQuery.get(q) ?? 0) + 1)
  }
  const compact = [...countByQuery.entries()].map(([query, total]) => ({
    query,
    total,
    distinctUsers: usersByQuery.get(query)!.size,
  }))

  const existingArticles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { title: true },
    take: 300,
  })

  const ai = new GoogleGenAI({ apiKey })

  const prompt = `
Você é um analista de comportamento de busca em uma central de ajuda (knowledge base).
Recebeu a lista bruta de PESQUISAS QUE NÃO RETORNARAM RESULTADOS nos últimos ${WINDOW_DAYS} dias.

Cada item é uma string única pesquisada, com o número total de ocorrências e usuários distintos.

PESQUISAS SEM RESULTADO:
${JSON.stringify(compact, null, 2)}

ARTIGOS JÁ PUBLICADOS NA BASE (NÃO sugira temas que já existem):
${JSON.stringify(existingArticles.map((a) => a.title), null, 2)}

SUA TAREFA:
1. Faça AGRUPAMENTO SEMÂNTICO das pesquisas. Considere:
   - Sinônimos ("instalar" ≈ "configurar" ≈ "ativar")
   - Permutação de palavras ("X como instalar" = "como instalar X")
   - Variações de escrita, typos, plural/singular
   - Mesma entidade (produto/feature) sendo perguntada de jeitos diferentes
2. Para cada grupo, identifique a INTENÇÃO REAL do usuário (o que ele queria saber).
3. IGNORE buscas isoladas que parecem ruído, teste, digitação aleatória ou gibberish.
4. Sugira artigo APENAS para grupos com:
   - Intenção clara e específica
   - Pelo menos 2 buscas similares (mesmo que de 1 usuário só, se as variações sugerem genuíno interesse)
   - Tema NÃO coberto pelos artigos já publicados
5. Para cada tema válido, gere uma sugestão de artigo (título, excerpt SEO ≤160 chars, tópicos).
6. Priorize por: volume total + usuários distintos + clareza da intenção.
7. Se nenhum grupo for digno de virar artigo, retorne lista vazia.

Sempre responda em Português do Brasil (PT-BR).
  `.trim()

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      suggestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            tema: { type: Type.STRING, description: 'Nome curto do tema identificado' },
            intencaoDoUsuario: {
              type: Type.STRING,
              description: 'Descrição da necessidade real por trás das pesquisas',
            },
            evidencia: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Termos pesquisados que evidenciam esta intenção',
            },
            sugestaoDeArtigo: {
              type: Type.OBJECT,
              properties: {
                titulo: { type: Type.STRING, description: 'Título sugerido do artigo' },
                excerpt: {
                  type: Type.STRING,
                  description: 'Resumo curto otimizado para SEO (máx 160 chars)',
                },
                topicos: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Tópicos/seções que o artigo deveria cobrir',
                },
              },
              required: ['titulo', 'excerpt', 'topicos'],
            },
            prioridade: {
              type: Type.STRING,
              description: 'alta | media | baixa',
            },
          },
          required: ['tema', 'intencaoDoUsuario', 'evidencia', 'sugestaoDeArtigo', 'prioridade'],
        },
      },
    },
    required: ['suggestions'],
  }

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.3,
      },
    })

    if (!result.text) {
      throw new Error('Resposta vazia da IA')
    }

    const parsed = JSON.parse(result.text) as { suggestions: ContentSuggestion[] }
    return {
      suggestions: parsed.suggestions ?? [],
      totalAnalyzed: failed.length,
    }
  } catch (err: any) {
    throw new Error('Falha na comunicação com o Gemini: ' + err.message)
  }
}
