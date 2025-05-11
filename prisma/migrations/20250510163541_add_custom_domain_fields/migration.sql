-- AlterTable
ALTER TABLE "User" ADD COLUMN     "customDomain" TEXT,
ADD COLUMN     "domainVerified" BOOLEAN NOT NULL DEFAULT false;
