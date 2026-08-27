/*
  Warnings:

  - You are about to drop the column `heroImageId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Article` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Industry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `caption` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Article` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_heroImageId_fkey";

-- DropIndex
DROP INDEX "Article_heroImageId_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "heroImageId",
DROP COLUMN "summary",
ADD COLUMN     "caption" TEXT NOT NULL,
ADD COLUMN     "featuredImageId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ContentStatus" NOT NULL;

-- CreateTable
CREATE TABLE "FeaturedImage" (
    "imageId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "caption" TEXT,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedImage_pkey" PRIMARY KEY ("imageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Industry_code_key" ON "Industry"("code");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_featuredImageId_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "FeaturedImage"("imageId") ON DELETE SET NULL ON UPDATE CASCADE;
