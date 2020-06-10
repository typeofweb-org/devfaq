/*
 @name FindAllQuestions
 @param levels -> (...)
 */
SELECT "Question"."id",
  "Question"."question",
  "Question"."_categoryId",
  "Question"."_levelId",
  "Question"."_statusId",
  "Question"."acceptedAt",
  COALESCE(
    (
      SELECT true
      FROM "QuestionVote"
      WHERE "_questionId" = "Question"."id"
        AND "_userId" = :userId
      LIMIT 1
    ), false
  ) as "didUserVoteOn",
  count("_votes"."id") as "votesCount"
FROM "Question"
  LEFT OUTER JOIN (
    "QuestionVote"
    INNER JOIN "User" AS "_votes" ON "_votes"."id" = "QuestionVote"."_userId"
  ) ON "Question"."id" = "QuestionVote"."_questionId"
WHERE (
    (
      ("Question"."_categoryId" = :category)
      OR (:category IS NULL)
    )
    AND (
      ("Question"."_levelId" IN :levels)
      OR (:levels IS NULL)
    )
    AND (
      ("Question"."_statusId" = :status)
      OR (:status IS NULL)
    )
  )
GROUP BY "Question".id
ORDER BY :orderBy
LIMIT :limit OFFSET :offset;
/*
 @name CountAllQuestions
 @param levels -> (...)
 */
SELECT COUNT(*)
FROM "Question"
WHERE (
    (
      ("Question"."_categoryId" = :category)
      OR (:category IS NULL)
    )
    AND (
      ("Question"."_levelId" IN :levels)
      OR (:levels IS NULL)
    )
    AND (
      ("Question"."_statusId" = :status)
      OR (:status IS NULL)
    )
  );
