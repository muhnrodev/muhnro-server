-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE INDEX "Client_industryId_idx" ON "Client"("industryId");

-- CreateIndex
CREATE INDEX "Client_stakeholderId_idx" ON "Client"("stakeholderId");

-- CreateIndex
CREATE INDEX "Client_isDeleted_createdAt_idx" ON "Client"("isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "Client_email_idx" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_phone_idx" ON "Client"("phone");
