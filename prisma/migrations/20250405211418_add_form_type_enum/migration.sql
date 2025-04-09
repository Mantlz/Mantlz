-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('WAITLIST', 'FEEDBACK', 'CONTACT', 'CUSTOM');

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "formType" "FormType" NOT NULL DEFAULT 'CUSTOM';
