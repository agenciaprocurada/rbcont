-- Índices de performance para as listagens públicas.
-- Apenas CREATE INDEX (não-destrutivo). Acelera:
--   * recentes        -> articles(status, createdAt)
--   * trending/views  -> articles(status, views)
--   * por categoria   -> articles(categoryId, status, views)
--   * mais acessados  -> article_views(createdAt, articleId) no GROUP BY

-- CreateIndex
CREATE INDEX "article_views_createdAt_articleId_idx" ON "article_views"("createdAt", "articleId");

-- CreateIndex
CREATE INDEX "articles_status_createdAt_idx" ON "articles"("status", "createdAt");

-- CreateIndex
CREATE INDEX "articles_status_views_idx" ON "articles"("status", "views");

-- CreateIndex
CREATE INDEX "articles_categoryId_status_views_idx" ON "articles"("categoryId", "status", "views");
