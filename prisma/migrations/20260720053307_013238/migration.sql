-- AlterTable
ALTER TABLE "ComponentField" ADD COLUMN     "arrayType" "FieldType";

-- AlterTable
ALTER TABLE "ObjectSchemaField" ADD COLUMN     "arrayType" "FieldType",
ALTER COLUMN "objectSchemaRefId" DROP NOT NULL,
ALTER COLUMN "objectSchemaRefId" DROP DEFAULT,
ALTER COLUMN "objectSchemaRefId" SET DATA TYPE TEXT;
