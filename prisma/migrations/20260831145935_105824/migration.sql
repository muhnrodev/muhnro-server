/*
  Warnings:

  - Added the required column `name` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Location_city_idx";

-- DropIndex
DROP INDEX "Location_country_idx";

-- DropIndex
DROP INDEX "Location_isVirtual_idx";

-- DropIndex
DROP INDEX "Location_region_idx";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Location_name_idx" ON "Location"("name");

-- CreateIndex
CREATE INDEX "Location_country_region_city_idx" ON "Location"("country", "region", "city");
