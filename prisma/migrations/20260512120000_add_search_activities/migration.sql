-- CreateTable
CREATE TABLE "search_activities" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "normalizedQ" TEXT NOT NULL,
    "resultsCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "search_activities_normalizedQ_idx" ON "search_activities"("normalizedQ");

-- CreateIndex
CREATE INDEX "search_activities_resultsCount_idx" ON "search_activities"("resultsCount");

-- CreateIndex
CREATE INDEX "search_activities_createdAt_idx" ON "search_activities"("createdAt");

-- CreateIndex
CREATE INDEX "search_activities_userId_idx" ON "search_activities"("userId");

-- AddForeignKey
ALTER TABLE "search_activities" ADD CONSTRAINT "search_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
