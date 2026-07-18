/*
  Warnings:

  - Added the required column `createdBy` to the `Webpage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Webpage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Webpage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Website` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Website` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Webpage" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;
