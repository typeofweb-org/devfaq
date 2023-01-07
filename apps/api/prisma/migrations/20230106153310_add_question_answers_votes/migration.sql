-- CreateTable
CREATE TABLE "QuestionAnswerVote" (
    "_userId" INTEGER NOT NULL,
    "_questionAnswerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionAnswerVote_pkey" PRIMARY KEY ("_userId","_questionAnswerId")
);

-- AddForeignKey
ALTER TABLE "QuestionAnswerVote" ADD CONSTRAINT "QuestionAnswerVote__questionAnswerId_fkey" FOREIGN KEY ("_questionAnswerId") REFERENCES "QuestionAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswerVote" ADD CONSTRAINT "QuestionAnswerVote__userId_fkey" FOREIGN KEY ("_userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
