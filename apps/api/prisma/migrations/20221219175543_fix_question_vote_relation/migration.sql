-- DropForeignKey
ALTER TABLE "QuestionVote" DROP CONSTRAINT "QuestionVote__questionId_fkey";

-- AddForeignKey
ALTER TABLE "QuestionVote" ADD CONSTRAINT "QuestionVote__questionId_fkey" FOREIGN KEY ("_questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
