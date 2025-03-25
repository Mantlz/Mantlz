-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "emailSettings" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resendApiKey" TEXT;
