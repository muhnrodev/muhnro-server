/*
  Warnings:

  - You are about to drop the column `industryCode` on the `Industry` table. All the data in the column will be lost.
  - You are about to drop the column `industryName` on the `Industry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Industry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Industry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Industry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "FieldType" ADD VALUE 'IDENTITY';

-- AlterTable
ALTER TABLE "Industry" DROP COLUMN "industryCode",
DROP COLUMN "industryName",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Tag" (
    "tagId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");

-- AddForeignKey
ALTER TABLE "ArticleTag" ADD CONSTRAINT "ArticleTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("tagId") ON DELETE RESTRICT ON UPDATE CASCADE;
