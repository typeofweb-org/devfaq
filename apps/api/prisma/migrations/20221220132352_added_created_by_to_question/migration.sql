-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "_createdById" INTEGER;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question__createdById_fkey" FOREIGN KEY ("_createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
