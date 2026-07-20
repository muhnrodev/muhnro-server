/*
  Warnings:

  - You are about to drop the `ItemSchema` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('ARTICLE', 'NEWS', 'PROJECT', 'REPORT', 'PODCAST', 'PRODUCT', 'PARTNER', 'PERSON');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FieldType" ADD VALUE 'REFERENCE';
ALTER TYPE "FieldType" ADD VALUE 'REFERENCE_ARRAY';

-- DropForeignKey
ALTER TABLE "ItemSchema" DROP CONSTRAINT "ItemSchema_componentFieldId_fkey";

-- AlterTable
ALTER TABLE "ComponentField" ADD COLUMN     "objectSchemaId" TEXT;

-- DropTable
DROP TABLE "ItemSchema";

-- CreateTable
CREATE TABLE "ObjectSchema" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "ObjectSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectSchemaField" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "objectSchemaId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "objectSchemaRefId" BOOLEAN NOT NULL DEFAULT false,
    "schemaId" TEXT,
    "minLength" INTEGER,
    "maxLength" INTEGER,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "regex" TEXT,

    CONSTRAINT "ObjectSchemaField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ObjectSchema_key_key" ON "ObjectSchema"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ObjectSchemaField_objectSchemaId_key_key" ON "ObjectSchemaField"("objectSchemaId", "key");

-- AddForeignKey
ALTER TABLE "ComponentField" ADD CONSTRAINT "ComponentField_objectSchemaId_fkey" FOREIGN KEY ("objectSchemaId") REFERENCES "ObjectSchema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectSchemaField" ADD CONSTRAINT "ObjectSchemaField_objectSchemaId_fkey" FOREIGN KEY ("objectSchemaId") REFERENCES "ObjectSchema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectSchemaField" ADD CONSTRAINT "ObjectSchemaField_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "ObjectSchema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
