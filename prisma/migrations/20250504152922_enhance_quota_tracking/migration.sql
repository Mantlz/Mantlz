/*
  Warnings:

  - You are about to drop the column `count` on the `Quota` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,year,month]` on the table `Quota` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Quota" DROP COLUMN "count",
ADD COLUMN     "campaignCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "emailsClicked" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "emailsOpened" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "emailsSent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "formCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "submissionCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Quota_userId_idx" ON "Quota"("userId");

-- CreateIndex
CREATE INDEX "Quota_year_month_idx" ON "Quota"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "Quota_userId_year_month_key" ON "Quota"("userId", "year", "month");
