-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FormType" ADD VALUE 'SURVEY';
ALTER TYPE "FormType" ADD VALUE 'APPLICATION';
ALTER TYPE "FormType" ADD VALUE 'ORDER';
ALTER TYPE "FormType" ADD VALUE 'ANALYTICS_OPT_IN';
ALTER TYPE "FormType" ADD VALUE 'RSVP';
