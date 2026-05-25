-- AlterEnum
BEGIN;
CREATE TYPE "ArticleType_new" AS ENUM ('TEXT', 'VIDEO');
ALTER TABLE "articles" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "articles" ALTER COLUMN "type" TYPE "ArticleType_new" USING ("type"::text::"ArticleType_new");
ALTER TYPE "ArticleType" RENAME TO "ArticleType_old";
ALTER TYPE "ArticleType_new" RENAME TO "ArticleType";
DROP TYPE "ArticleType_old";
ALTER TABLE "articles" ALTER COLUMN "type" SET DEFAULT 'TEXT';
COMMIT;

-- DropForeignKey
ALTER TABLE "support_blocks" DROP CONSTRAINT "support_blocks_articleId_fkey";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "metaDesc",
DROP COLUMN "metaTitle";

-- DropTable
DROP TABLE "support_blocks";
