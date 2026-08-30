/*
  Warnings:

  - You are about to drop the column `billingAddress` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `contactName` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `Client` table. All the data in the column will be lost.
  - The primary key for the `ProjectImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `binaryHash` on the `ProjectImage` table. All the data in the column will be lost.
  - You are about to drop the column `caption` on the `ProjectImage` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `ProjectImage` table. All the data in the column will be lost.
  - You are about to drop the column `gpsLat` on the `ProjectImage` table. All the data in the column will be lost.
  - You are about to drop the column `gpsLong` on the `ProjectImage` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `ProjectImage` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `ProjectImage` table. All the data in the column will be lost.
  - You are about to drop the column `photographer` on the `ProjectImage` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `ProjectImage` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `ProjectImage` table. All the data in the column will be lost.
  - You are about to drop the column `takenAt` on the `ProjectImage` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `ProjectImage` table. All the data in the column will be lost.
  - The primary key for the `ProjectNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `noteId` on the `ProjectNote` table. All the data in the column will be lost.
  - The primary key for the `ProjectTeamMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `projectMemberId` on the `ProjectTeamMember` table. All the data in the column will be lost.
  - The primary key for the `TeamMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `memberId` on the `TeamMember` table. All the data in the column will be lost.
  - The primary key for the `TeamRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roleId` on the `TeamRole` table. All the data in the column will be lost.
  - You are about to drop the `ProjectServiceActivity` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `story` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaId` to the `ProjectImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TeamRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_projectLeadId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectNote" DROP CONSTRAINT "ProjectNote_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectServiceActivity" DROP CONSTRAINT "ProjectServiceActivity_activityId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectServiceActivity" DROP CONSTRAINT "ProjectServiceActivity_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTeamMember" DROP CONSTRAINT "ProjectTeamMember_memberId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTeamMember" DROP CONSTRAINT "ProjectTeamMember_roleId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "billingAddress",
DROP COLUMN "contactEmail",
DROP COLUMN "contactName",
DROP COLUMN "contactPhone",
ADD COLUMN     "addressId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "story" TEXT NOT NULL,
ADD COLUMN     "subtitle" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProjectImage" DROP CONSTRAINT "ProjectImage_pkey",
DROP COLUMN "binaryHash",
DROP COLUMN "caption",
DROP COLUMN "fileName",
DROP COLUMN "gpsLat",
DROP COLUMN "gpsLong",
DROP COLUMN "imageId",
DROP COLUMN "mimeType",
DROP COLUMN "photographer",
DROP COLUMN "size",
DROP COLUMN "tags",
DROP COLUMN "takenAt",
DROP COLUMN "url",
ADD COLUMN     "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "mediaId" TEXT NOT NULL,
ADD CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProjectNote" DROP CONSTRAINT "ProjectNote_pkey",
DROP COLUMN "noteId",
ADD COLUMN     "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "ProjectNote_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProjectTeamMember" DROP CONSTRAINT "ProjectTeamMember_pkey",
DROP COLUMN "projectMemberId",
ADD COLUMN     "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "ProjectTeamMember_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_pkey",
DROP COLUMN "memberId",
ADD COLUMN     "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TeamRole" DROP CONSTRAINT "TeamRole_pkey",
DROP COLUMN "roleId",
ADD COLUMN     "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "TeamRole_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "ProjectServiceActivity";

-- CreateTable
CREATE TABLE "CaseStudy" (
    "caseStudyId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "summary" TEXT,
    "content" JSONB NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledPublish" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "unpublishedAt" TIMESTAMP(3),
    "readingTime" INTEGER NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "featuredImageId" TEXT NOT NULL,
    "projectId" TEXT,
    "industryId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("caseStudyId")
);

-- CreateTable
CREATE TABLE "ClientContact" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clientId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAddress" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clientId" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stakeholder" (
    "stakeholderId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stakeholder_pkey" PRIMARY KEY ("stakeholderId")
);

-- CreateTable
CREATE TABLE "ProjectStakeholder" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "stakeholderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectStakeholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTag" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ProjectTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_featuredImageId_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("industryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "ClientAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientContact" ADD CONSTRAINT "ClientContact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectLeadId_fkey" FOREIGN KEY ("projectLeadId") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStakeholder" ADD CONSTRAINT "ProjectStakeholder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStakeholder" ADD CONSTRAINT "ProjectStakeholder_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES "Stakeholder"("stakeholderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeamMember" ADD CONSTRAINT "ProjectTeamMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeamMember" ADD CONSTRAINT "ProjectTeamMember_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "TeamRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("tagId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectNote" ADD CONSTRAINT "ProjectNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
