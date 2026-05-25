-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('TEXT', 'SUPPORT', 'VIDEO');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "type" "ArticleType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "videoUrl" TEXT;

-- CreateTable
CREATE TABLE "support_blocks" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "badge" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "support_blocks_articleId_idx" ON "support_blocks"("articleId");

-- CreateIndex
CREATE INDEX "articles_type_idx" ON "articles"("type");

-- AddForeignKey
ALTER TABLE "support_blocks" ADD CONSTRAINT "support_blocks_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

