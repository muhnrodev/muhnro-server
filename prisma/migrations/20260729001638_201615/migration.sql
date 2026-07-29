/*
  Warnings:

  - Added the required column `updatedBy` to the `Industry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Industry" ADD COLUMN     "updatedBy" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "updatedBy" TEXT NOT NULL;
