-- CreateTable
CREATE TABLE "PrivacySettings" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "trackUserBehavior" BOOLEAN NOT NULL,
    "essentialCookies" BOOLEAN NOT NULL,
    "performanceCookies" BOOLEAN NOT NULL,
    "functionalCookies" BOOLEAN NOT NULL,
    "advertisingCookies" BOOLEAN NOT NULL,
    "thirdPartyCookies" BOOLEAN NOT NULL,
    "socialMediaCookies" BOOLEAN NOT NULL,
    "preferenceCookies" BOOLEAN NOT NULL,

    CONSTRAINT "PrivacySettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrivacySettings_userId_key" ON "PrivacySettings"("userId");

-- AddForeignKey
ALTER TABLE "PrivacySettings" ADD CONSTRAINT "PrivacySettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
