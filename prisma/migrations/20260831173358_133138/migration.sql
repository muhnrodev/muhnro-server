/*
  Warnings:

  - The primary key for the `TeamMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fullName` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `roleName` on the `TeamRole` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[role]` on the table `TeamRole` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ProjectTeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `TeamRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_projectLeadId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectNote" DROP CONSTRAINT "ProjectNote_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTeamMember" DROP CONSTRAINT "ProjectTeamMember_memberId_fkey";

-- DropIndex
DROP INDEX "TeamRole_roleName_key";

-- AlterTable
ALTER TABLE "ProjectTeamMember" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_pkey",
DROP COLUMN "fullName",
DROP COLUMN "id",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "teamMemberId" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("teamMemberId");

-- AlterTable
ALTER TABLE "TeamRole" DROP COLUMN "roleName",
ADD COLUMN     "role" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TeamMember_lastName_firstName_idx" ON "TeamMember"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "TeamMember_department_idx" ON "TeamMember"("department");

-- CreateIndex
CREATE INDEX "TeamMember_employmentType_idx" ON "TeamMember"("employmentType");

-- CreateIndex
CREATE INDEX "TeamMember_isDeleted_createdAt_idx" ON "TeamMember"("isDeleted", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TeamRole_role_key" ON "TeamRole"("role");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectLeadId_fkey" FOREIGN KEY ("projectLeadId") REFERENCES "TeamMember"("teamMemberId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeamMember" ADD CONSTRAINT "ProjectTeamMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("teamMemberId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectNote" ADD CONSTRAINT "ProjectNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "TeamMember"("teamMemberId") ON DELETE RESTRICT ON UPDATE CASCADE;
