-- AlterTable
ALTER TABLE "QuestionAnswer" ADD COLUMN     "sources" TEXT[] DEFAULT ARRAY[]::TEXT[];
