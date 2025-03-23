/*
  Warnings:

  - A unique constraint covering the columns `[formId,email]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE INDEX "Submission_email_idx" ON "Submission"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_formId_email_key" ON "Submission"("formId", "email");
