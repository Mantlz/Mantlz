-- CreateTable
CREATE TABLE "PaymentFailure" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriptionId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "failureReason" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentFailure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentFailure_subscriptionId_idx" ON "PaymentFailure"("subscriptionId");

-- CreateIndex
CREATE INDEX "PaymentFailure_invoiceId_idx" ON "PaymentFailure"("invoiceId");

-- AddForeignKey
ALTER TABLE "PaymentFailure" ADD CONSTRAINT "PaymentFailure_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("subscriptionId") ON DELETE RESTRICT ON UPDATE CASCADE;
