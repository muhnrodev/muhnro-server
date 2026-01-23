-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "monthlyNewsletter" BOOLEAN NOT NULL DEFAULT true,
    "vacancies" BOOLEAN NOT NULL DEFAULT true,
    "dataInsights" BOOLEAN NOT NULL DEFAULT true,
    "productAnnouncements" BOOLEAN NOT NULL DEFAULT true,
    "specialOffers" BOOLEAN NOT NULL DEFAULT true,
    "eventInvitations" BOOLEAN NOT NULL DEFAULT true,
    "projectUpdates" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionReminders" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
