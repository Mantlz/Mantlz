/*
  Warnings:

  - You are about to drop the column `digestFrequency` on the `EmailSettings` table. All the data in the column will be lost.
  - You are about to drop the column `error` on the `NotificationLog` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `NotificationLog` table. All the data in the column will be lost.
  - Changed the type of `type` on the `NotificationLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "NotificationLog_formId_submissionId_idx";

-- AlterTable
ALTER TABLE "EmailSettings" DROP COLUMN "digestFrequency";

-- AlterTable
ALTER TABLE "NotificationLog" DROP COLUMN "error",
DROP COLUMN "status",
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "NotificationLog_formId_type_idx" ON "NotificationLog"("formId", "type");
