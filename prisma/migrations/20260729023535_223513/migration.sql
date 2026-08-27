/*
  Warnings:

  - You are about to drop the `FeaturedImage` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `featuredImageId` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE', 'OTHER');

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_featuredImageId_fkey";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "featuredImageId" SET NOT NULL;

-- DropTable
DROP TABLE "FeaturedImage";

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" "MediaType" NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "altText" TEXT,
    "caption" TEXT,
    "checksum" TEXT,
    "createById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_featuredImageId_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_createById_fkey" FOREIGN KEY ("createById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
