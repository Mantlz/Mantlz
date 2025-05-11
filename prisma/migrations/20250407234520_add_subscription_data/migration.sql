/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "SubscriptionData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "status" TEXT DEFAULT 'inactive',
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "lastPaymentDate" TIMESTAMP(3),
    "lastPaymentAmount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionData_userId_key" ON "SubscriptionData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionData_stripeSubscriptionId_key" ON "SubscriptionData"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "SubscriptionData_stripeSubscriptionId_idx" ON "SubscriptionData"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "SubscriptionData_status_idx" ON "SubscriptionData"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "User_stripeCustomerId_idx" ON "User"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "SubscriptionData" ADD CONSTRAINT "SubscriptionData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
