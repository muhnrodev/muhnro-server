/*
  Warnings:

  - You are about to drop the column `dataInsights` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `eventInvitations` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyNewsletter` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `productAnnouncements` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `projectUpdates` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `specialOffers` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionReminders` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `vacancies` on the `NotificationPreference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotificationPreference" DROP COLUMN "dataInsights",
DROP COLUMN "eventInvitations",
DROP COLUMN "monthlyNewsletter",
DROP COLUMN "productAnnouncements",
DROP COLUMN "projectUpdates",
DROP COLUMN "specialOffers",
DROP COLUMN "subscriptionReminders",
DROP COLUMN "vacancies",
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "smsNotifications" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PromotionalPreference" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "monthlyNewsletter" BOOLEAN NOT NULL DEFAULT true,
    "vacanciesUpdates" BOOLEAN NOT NULL DEFAULT true,
    "productAnnouncements" BOOLEAN NOT NULL DEFAULT true,
    "specialOffers" BOOLEAN NOT NULL DEFAULT true,
    "eventInvitations" BOOLEAN NOT NULL DEFAULT true,
    "projectUpdates" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionReminders" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PromotionalPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightsPreference" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "monthlyInsights" BOOLEAN NOT NULL DEFAULT true,
    "suggestedReports" BOOLEAN NOT NULL DEFAULT true,
    "suggestedArticles" BOOLEAN NOT NULL DEFAULT true,
    "followedAuthors" BOOLEAN NOT NULL DEFAULT true,
    "followedTags" BOOLEAN NOT NULL DEFAULT true,
    "followedIndustries" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "InsightsPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromotionalPreference_userId_key" ON "PromotionalPreference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InsightsPreference_userId_key" ON "InsightsPreference"("userId");

-- AddForeignKey
ALTER TABLE "PromotionalPreference" ADD CONSTRAINT "PromotionalPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightsPreference" ADD CONSTRAINT "InsightsPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
