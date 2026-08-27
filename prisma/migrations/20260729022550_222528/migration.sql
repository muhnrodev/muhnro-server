/*
  Warnings:

  - You are about to drop the column `body` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `caption` on the `Article` table. All the data in the column will be lost.
  - Added the required column `content` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "body",
DROP COLUMN "caption",
ADD COLUMN     "content" JSONB NOT NULL,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT,
ALTER COLUMN "subtitle" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
