/*
  Warnings:

  - You are about to drop the column `itemSchema` on the `ComponentField` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ComponentFieldValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PageComponent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "ComponentField" DROP COLUMN "itemSchema",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "ComponentFieldValue" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "PageComponent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Webpage" ALTER COLUMN "createdBy" DROP NOT NULL,
ALTER COLUMN "updatedBy" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ItemSchema" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "componentFieldId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "ItemSchema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemSchema_componentFieldId_key_key" ON "ItemSchema"("componentFieldId", "key");

-- AddForeignKey
ALTER TABLE "ItemSchema" ADD CONSTRAINT "ItemSchema_componentFieldId_fkey" FOREIGN KEY ("componentFieldId") REFERENCES "ComponentField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
