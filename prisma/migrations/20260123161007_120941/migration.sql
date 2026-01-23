/*
  Warnings:

  - The primary key for the `NotificationPreference` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "NotificationPreference" DROP CONSTRAINT "NotificationPreference_pkey",
ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "NotificationPreference_id_seq";
