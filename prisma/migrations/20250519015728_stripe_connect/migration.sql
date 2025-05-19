-- CreateEnum
CREATE TYPE "StripeOrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELED');

-- CreateTable
CREATE TABLE "StripeConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeAccountId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "tokenType" TEXT NOT NULL DEFAULT 'bearer',
    "scope" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastRefreshedAt" TIMESTAMP(3),

    CONSTRAINT "StripeConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeProduct" (
    "id" TEXT NOT NULL,
    "stripeConnectionId" TEXT NOT NULL,
    "stripeProductId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "image" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeOrder" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "submissionId" TEXT,
    "stripeConnectionId" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "status" "StripeOrderStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerName" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeOrderItem" (
    "id" TEXT NOT NULL,
    "stripeOrderId" TEXT NOT NULL,
    "stripeProductId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeConnection_userId_key" ON "StripeConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeConnection_stripeAccountId_key" ON "StripeConnection"("stripeAccountId");

-- CreateIndex
CREATE INDEX "StripeConnection_userId_idx" ON "StripeConnection"("userId");

-- CreateIndex
CREATE INDEX "StripeConnection_stripeAccountId_idx" ON "StripeConnection"("stripeAccountId");

-- CreateIndex
CREATE INDEX "StripeProduct_stripeConnectionId_idx" ON "StripeProduct"("stripeConnectionId");

-- CreateIndex
CREATE INDEX "StripeProduct_stripeProductId_idx" ON "StripeProduct"("stripeProductId");

-- CreateIndex
CREATE INDEX "StripeProduct_stripePriceId_idx" ON "StripeProduct"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeProduct_stripeConnectionId_stripeProductId_stripePric_key" ON "StripeProduct"("stripeConnectionId", "stripeProductId", "stripePriceId");

-- CreateIndex
CREATE INDEX "StripeOrder_formId_idx" ON "StripeOrder"("formId");

-- CreateIndex
CREATE INDEX "StripeOrder_submissionId_idx" ON "StripeOrder"("submissionId");

-- CreateIndex
CREATE INDEX "StripeOrder_stripeConnectionId_idx" ON "StripeOrder"("stripeConnectionId");

-- CreateIndex
CREATE INDEX "StripeOrder_stripeCheckoutSessionId_idx" ON "StripeOrder"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "StripeOrder_stripePaymentIntentId_idx" ON "StripeOrder"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "StripeOrder_status_idx" ON "StripeOrder"("status");

-- CreateIndex
CREATE INDEX "StripeOrderItem_stripeOrderId_idx" ON "StripeOrderItem"("stripeOrderId");

-- CreateIndex
CREATE INDEX "StripeOrderItem_stripeProductId_idx" ON "StripeOrderItem"("stripeProductId");

-- AddForeignKey
ALTER TABLE "StripeConnection" ADD CONSTRAINT "StripeConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeProduct" ADD CONSTRAINT "StripeProduct_stripeConnectionId_fkey" FOREIGN KEY ("stripeConnectionId") REFERENCES "StripeConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeOrder" ADD CONSTRAINT "StripeOrder_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeOrder" ADD CONSTRAINT "StripeOrder_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeOrder" ADD CONSTRAINT "StripeOrder_stripeConnectionId_fkey" FOREIGN KEY ("stripeConnectionId") REFERENCES "StripeConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeOrderItem" ADD CONSTRAINT "StripeOrderItem_stripeOrderId_fkey" FOREIGN KEY ("stripeOrderId") REFERENCES "StripeOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeOrderItem" ADD CONSTRAINT "StripeOrderItem_stripeProductId_fkey" FOREIGN KEY ("stripeProductId") REFERENCES "StripeProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
