/*
  Warnings:

  - Added the required column `_createdById` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "_createdById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question__createdById_fkey" FOREIGN KEY ("_createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
