/*
  Warnings:

  - You are about to drop the column `order` on the `PageComponent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PageComponent" DROP COLUMN "order",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
