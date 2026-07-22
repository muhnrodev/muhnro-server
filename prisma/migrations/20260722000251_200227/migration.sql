/*
  Warnings:

  - Added the required column `name` to the `Webpage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Webpage" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL;
