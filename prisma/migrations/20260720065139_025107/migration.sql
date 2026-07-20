/*
  Warnings:

  - You are about to drop the column `schemaId` on the `ObjectSchemaField` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ObjectSchemaField" DROP CONSTRAINT "ObjectSchemaField_schemaId_fkey";

-- AlterTable
ALTER TABLE "ObjectSchemaField" DROP COLUMN "schemaId",
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "ObjectSchemaField" ADD CONSTRAINT "ObjectSchemaField_objectSchemaRefId_fkey" FOREIGN KEY ("objectSchemaRefId") REFERENCES "ObjectSchema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
