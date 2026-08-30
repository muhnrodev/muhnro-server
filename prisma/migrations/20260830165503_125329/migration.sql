/*
  Warnings:

  - A unique constraint covering the columns `[name,stakeholderId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Stakeholder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StakeholderType" AS ENUM ('CLIENT', 'CLIENT_CONTACT', 'PARTNER', 'VENDOR', 'EMPLOYEE', 'INVESTOR', 'OTHER');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "stakeholderId" TEXT;

-- AlterTable
ALTER TABLE "ClientContact" ADD COLUMN     "stakeholderId" TEXT;

-- AlterTable
ALTER TABLE "Stakeholder" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "StakeholderType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_stakeholderId_key" ON "Client"("name", "stakeholderId");

-- CreateIndex
CREATE INDEX "Stakeholder_name_idx" ON "Stakeholder"("name");

-- CreateIndex
CREATE INDEX "Stakeholder_organization_idx" ON "Stakeholder"("organization");

-- CreateIndex
CREATE INDEX "Stakeholder_email_idx" ON "Stakeholder"("email");

-- CreateIndex
CREATE INDEX "Stakeholder_phone_idx" ON "Stakeholder"("phone");

-- CreateIndex
CREATE INDEX "Stakeholder_type_idx" ON "Stakeholder"("type");

-- CreateIndex
CREATE INDEX "Stakeholder_isDeleted_createdAt_idx" ON "Stakeholder"("isDeleted", "createdAt");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES "Stakeholder"("stakeholderId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientContact" ADD CONSTRAINT "ClientContact_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES "Stakeholder"("stakeholderId") ON DELETE SET NULL ON UPDATE CASCADE;
