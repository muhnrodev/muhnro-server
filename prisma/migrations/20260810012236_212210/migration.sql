/*
  Warnings:

  - You are about to drop the `ArticleIndustry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArticleIndustry" DROP CONSTRAINT "ArticleIndustry_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleIndustry" DROP CONSTRAINT "ArticleIndustry_industryId_fkey";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "industryId" TEXT;

-- DropTable
DROP TABLE "ArticleIndustry";

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("industryId") ON DELETE SET NULL ON UPDATE CASCADE;
