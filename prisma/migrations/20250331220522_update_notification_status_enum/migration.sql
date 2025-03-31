/*
  Warnings:

  - The `status` column on the `NotificationLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "NotificationLog" DROP COLUMN "status",
ADD COLUMN     "status" "NotificationStatus" NOT NULL DEFAULT 'SENT';

-- CreateIndex
CREATE INDEX "NotificationLog_status_idx" ON "NotificationLog"("status");
