/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `PageComponent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `PageComponent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'EDITOR');

-- AlterTable
ALTER TABLE "PageComponent" ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "PageComponent_key_key" ON "PageComponent"("key");
