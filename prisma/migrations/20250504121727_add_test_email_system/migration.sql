/*
  Warnings:

  - You are about to drop the column `clickCount` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `filterSettings` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `openCount` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `sentCount` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the `CampaignRecipient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_formId_fkey";

-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_userId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignRecipient" DROP CONSTRAINT "CampaignRecipient_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignRecipient" DROP CONSTRAINT "CampaignRecipient_submissionId_fkey";

-- DropIndex
DROP INDEX "Campaign_userId_status_idx";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "clickCount",
DROP COLUMN "filterSettings",
DROP COLUMN "openCount",
DROP COLUMN "sentCount",
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "sentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "unsubscribed" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "CampaignRecipient";

-- DropEnum
DROP TYPE "DigestFrequency";

-- CreateTable
CREATE TABLE "TestEmailSubmission" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestEmailSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentEmail" (
    "id" TEXT NOT NULL,
    "status" "CampaignSendStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "campaignId" TEXT NOT NULL,
    "submissionId" TEXT,
    "testSubmissionId" TEXT,
    "isTest" BOOLEAN NOT NULL DEFAULT false,
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "lastOpenedAt" TIMESTAMP(3),
    "lastClickedAt" TIMESTAMP(3),
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "bounced" BOOLEAN NOT NULL DEFAULT false,
    "bounceReason" TEXT,
    "spamReported" BOOLEAN NOT NULL DEFAULT false,
    "spamReportedAt" TIMESTAMP(3),
    "unsubscribeClicked" BOOLEAN NOT NULL DEFAULT false,
    "unsubscribeClickedAt" TIMESTAMP(3),

    CONSTRAINT "SentEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TestEmailSubmission_email_idx" ON "TestEmailSubmission"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TestEmailSubmission_formId_email_key" ON "TestEmailSubmission"("formId", "email");

-- CreateIndex
CREATE INDEX "SentEmail_campaignId_idx" ON "SentEmail"("campaignId");

-- CreateIndex
CREATE INDEX "SentEmail_submissionId_idx" ON "SentEmail"("submissionId");

-- CreateIndex
CREATE INDEX "SentEmail_testSubmissionId_idx" ON "SentEmail"("testSubmissionId");

-- CreateIndex
CREATE INDEX "SentEmail_openedAt_idx" ON "SentEmail"("openedAt");

-- CreateIndex
CREATE INDEX "SentEmail_clickedAt_idx" ON "SentEmail"("clickedAt");

-- CreateIndex
CREATE INDEX "SentEmail_status_idx" ON "SentEmail"("status");

-- CreateIndex
CREATE INDEX "SentEmail_isTest_idx" ON "SentEmail"("isTest");

-- CreateIndex
CREATE INDEX "Campaign_userId_idx" ON "Campaign"("userId");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestEmailSubmission" ADD CONSTRAINT "TestEmailSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentEmail" ADD CONSTRAINT "SentEmail_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentEmail" ADD CONSTRAINT "SentEmail_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentEmail" ADD CONSTRAINT "SentEmail_testSubmissionId_fkey" FOREIGN KEY ("testSubmissionId") REFERENCES "TestEmailSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
