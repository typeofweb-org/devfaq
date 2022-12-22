-- CreateTable
CREATE TABLE "QuestionsAnswers" (
    "id" SERIAL NOT NULL,
    "_userId" INTEGER NOT NULL,
    "_questionId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "QuestionsAnswers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuestionsAnswers" ADD CONSTRAINT "QuestionsAnswers__userId_fkey" FOREIGN KEY ("_userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionsAnswers" ADD CONSTRAINT "QuestionsAnswers__questionId_fkey" FOREIGN KEY ("_questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
