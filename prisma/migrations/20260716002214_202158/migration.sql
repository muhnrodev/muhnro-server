-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('STRING', 'TEXT', 'RICHTEXT', 'MARKDOWN', 'IMAGE', 'VIDEO', 'FILE', 'NUMBER', 'BOOLEAN', 'COLOR', 'URL', 'EMAIL', 'ARRAY', 'OBJECT');

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domain" TEXT NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webpage" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "websiteId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Webpage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageComponent" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "webpageId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PageComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentField" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "componentId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "minLength" INTEGER,
    "maxLength" INTEGER,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "regex" TEXT,

    CONSTRAINT "ComponentField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentFieldValue" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "pageComponentId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "ComponentFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Webpage_websiteId_slug_key" ON "Webpage"("websiteId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Component_key_key" ON "Component"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentField_componentId_key_key" ON "ComponentField"("componentId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentFieldValue_pageComponentId_fieldId_key" ON "ComponentFieldValue"("pageComponentId", "fieldId");

-- AddForeignKey
ALTER TABLE "Webpage" ADD CONSTRAINT "Webpage_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageComponent" ADD CONSTRAINT "PageComponent_webpageId_fkey" FOREIGN KEY ("webpageId") REFERENCES "Webpage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageComponent" ADD CONSTRAINT "PageComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentField" ADD CONSTRAINT "ComponentField_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentFieldValue" ADD CONSTRAINT "ComponentFieldValue_pageComponentId_fkey" FOREIGN KEY ("pageComponentId") REFERENCES "PageComponent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentFieldValue" ADD CONSTRAINT "ComponentFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ComponentField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
