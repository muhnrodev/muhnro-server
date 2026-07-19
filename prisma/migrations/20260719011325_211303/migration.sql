-- DropForeignKey
ALTER TABLE "ComponentField" DROP CONSTRAINT "ComponentField_componentId_fkey";

-- DropForeignKey
ALTER TABLE "ComponentFieldValue" DROP CONSTRAINT "ComponentFieldValue_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "ComponentFieldValue" DROP CONSTRAINT "ComponentFieldValue_pageComponentId_fkey";

-- DropForeignKey
ALTER TABLE "ItemSchema" DROP CONSTRAINT "ItemSchema_componentFieldId_fkey";

-- DropForeignKey
ALTER TABLE "PageComponent" DROP CONSTRAINT "PageComponent_componentId_fkey";

-- DropForeignKey
ALTER TABLE "PageComponent" DROP CONSTRAINT "PageComponent_webpageId_fkey";

-- DropForeignKey
ALTER TABLE "Webpage" DROP CONSTRAINT "Webpage_websiteId_fkey";

-- AddForeignKey
ALTER TABLE "Webpage" ADD CONSTRAINT "Webpage_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageComponent" ADD CONSTRAINT "PageComponent_webpageId_fkey" FOREIGN KEY ("webpageId") REFERENCES "Webpage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageComponent" ADD CONSTRAINT "PageComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentField" ADD CONSTRAINT "ComponentField_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemSchema" ADD CONSTRAINT "ItemSchema_componentFieldId_fkey" FOREIGN KEY ("componentFieldId") REFERENCES "ComponentField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentFieldValue" ADD CONSTRAINT "ComponentFieldValue_pageComponentId_fkey" FOREIGN KEY ("pageComponentId") REFERENCES "PageComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentFieldValue" ADD CONSTRAINT "ComponentFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ComponentField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
