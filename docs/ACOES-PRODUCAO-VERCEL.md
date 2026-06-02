# Ações necessárias em produção (Vercel) — conta agenciaprocurada

> Estas ações **só podem ser feitas por quem tem acesso ao team Vercel
> `agenciaprocuradas-projects`** (onde o projeto `rbcont` / `rbcont.vercel.app`
> está hospedado). Levam ~5 minutos e resolvem a lentidão do site.

## Contexto (por que isso é necessário)

O site estava lento (requisições de 1,5 s–2,3 s e travadas de ~10 s) porque a
aplicação conectava ao banco Supabase pela **conexão direta** (porta 5432). Em
ambiente serverless (Vercel), isso é lento para estabelecer e estoura o limite
de conexões. A correção é usar o **connection pooler** do Supabase (porta 6543).

A mudança é **só de configuração** (variáveis de ambiente) — o código já está
preparado. Nenhum dado é alterado.

---

## Ação 1 — Corrigir as variáveis de ambiente (PRINCIPAL)

No painel da Vercel:

1. Acesse o projeto **`rbcont`** no team **`agenciaprocuradas-projects`**.
2. Vá em **Settings → Environment Variables**.
3. **Edite** (ou crie, se não existir) a variável **`DATABASE_URL`**, ambiente
   **Production**, com este valor (troque `<SENHA>` pela senha do banco):

   ```
   postgresql://postgres.jiaiwdybyyrprfhczjyu:<SENHA>@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

4. **Edite** (ou crie) a variável **`DIRECT_URL`**, ambiente **Production**, com:

   ```
   postgresql://postgres.jiaiwdybyyrprfhczjyu:<SENHA>@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
   ```

5. **Salve** as duas.
6. Vá em **Deployments**, abra o último deploy de produção, menu **⋯ →
   Redeploy** (pode deixar marcado "use existing build cache").

> **Senha:** não está neste documento por segurança. Como você vai **rotacioná-la**
> (Ação 3 abaixo), gere a senha nova no Supabase e use-a aqui já codificada para
> URL (ex.: `?` → `%3F`, `@` → `%40`, `*` → `%2A`, `#` → `%23`).

### Como saber se funcionou
Depois do redeploy, abra o site e navegue entre artigos. As respostas devem cair
de ~1,5–2 s para algumas centenas de ms, e as travadas de ~10 s devem sumir.

---

## Ação 2 — Confirmar o cron de keep-alive (automático)

O código novo já inclui um **Vercel Cron** diário (configurado em `vercel.json`)
que faz um `SELECT 1` no banco para o projeto Supabase no plano Free não pausar
por inatividade. **Não precisa fazer nada manual** — ele passa a rodar sozinho
após o deploy. Para conferir: **Settings → Cron Jobs** deve listar
`/api/cron/keep-alive` rodando uma vez por dia.

---

## Ação 3 (SEGURANÇA — recomendada) — Rotacionar a senha do banco

A senha atual do banco **vazou no histórico do Git** (estava embutida em um
arquivo de configuração versionado). Mesmo após a limpeza, ela continua nos
commits antigos. Recomendação:

1. No **Supabase** (projeto `jiaiwdybyyrprfhczjyu`): **Project Settings →
   Database → Reset database password**.
2. Gerar uma senha nova.
3. Atualizar `DATABASE_URL` e `DIRECT_URL` na Vercel (Ação 1) com a senha nova
   (lembre de codificar caracteres especiais na URL).
4. Avisar para atualizarmos o `.env.local` local também.

> Sem isso, qualquer pessoa com acesso ao histórico do repositório consegue a
> senha do banco de produção.

---

## Ação 4 — Aplicar a migration de índices (uma vez)

Foi adicionada a migration `20260602120000_add_perf_indexes` — apenas **4
`CREATE INDEX`** (não-destrutivo, não altera dados) que aceleram as listagens
(recentes, mais acessados, rankings por categoria). O build da Vercel **não**
aplica migrations sozinho, então precisa rodar uma vez.

Por quem tem o `DATABASE_URL`/`DIRECT_URL` (com a senha já rotacionada),
localmente ou em qualquer máquina com o repo:

```bash
# garanta que DATABASE_URL e DIRECT_URL estão no ambiente (ou em .env)
npx prisma migrate deploy
```

`migrate deploy` é o comando seguro para produção: aplica só as migrations
pendentes, sem prompt e sem recriar nada. Os índices são criados sem travar a
tabela (volume pequeno). Para conferir: a tabela `_prisma_migrations` deve
listar `20260602120000_add_perf_indexes`.

> Alternativa manual: o SQL está em
> `prisma/migrations/20260602120000_add_perf_indexes/migration.sql` e pode ser
> colado no **SQL Editor** do Supabase.

---

## Resumo rápido

| Ação | Onde | Obrigatória? |
|------|------|--------------|
| 1. `DATABASE_URL` + `DIRECT_URL` para o pooler | Vercel → Env Vars | ✅ Sim (resolve a lentidão) |
| 2. Conferir cron keep-alive | Vercel → Cron Jobs | Automático |
| 3. Rotacionar senha do banco | Supabase → Database | ⚠️ Fortemente recomendada |
| 4. `npx prisma migrate deploy` (índices) | Terminal / SQL Editor | ✅ Sim (acelera listagens) |
