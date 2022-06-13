/*
  Warnings:

  - You are about to drop the column `version` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `QuestionCategory` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `QuestionLevel` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `QuestionStatus` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `UserRole` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "version",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "QuestionCategory" DROP COLUMN "version",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "QuestionLevel" DROP COLUMN "version",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "QuestionStatus" DROP COLUMN "version",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "QuestionVote" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "version",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "version",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserRole" DROP COLUMN "version",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
