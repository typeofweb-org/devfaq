/** Types generated for queries found in "src/questions.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** Query 'FindAllQuestions' is invalid, so its result is assigned type 'never' */
export type IFindAllQuestionsResult = never;

/** Query 'FindAllQuestions' is invalid, so its parameters are assigned type 'never' */
export type IFindAllQuestionsParams = never;

const findAllQuestionsIR: any = {
  name: 'FindAllQuestions',
  params: [
    {
      name: 'levels',
      codeRefs: {
        defined: { a: 35, b: 40, line: 3, col: 8 },
        used: [
          { a: 665, b: 670, line: 30, col: 33 },
          { a: 684, b: 689, line: 31, col: 11 },
        ],
      },
      transform: { type: 'array_spread' },
    },
    {
      name: 'userId',
      transform: { type: 'scalar' },
      codeRefs: { used: [{ a: 341, b: 346, line: 16, col: 25 }] },
    },
    {
      name: 'category',
      transform: { type: 'scalar' },
      codeRefs: {
        used: [
          { a: 577, b: 584, line: 26, col: 35 },
          { a: 598, b: 605, line: 27, col: 11 },
        ],
      },
    },
    {
      name: 'status',
      transform: { type: 'scalar' },
      codeRefs: {
        used: [
          { a: 749, b: 754, line: 34, col: 33 },
          { a: 768, b: 773, line: 35, col: 11 },
        ],
      },
    },
    {
      name: 'order',
      transform: { type: 'scalar' },
      codeRefs: {
        used: [
          { a: 843, b: 847, line: 40, col: 10 },
          { a: 1076, b: 1080, line: 50, col: 10 },
        ],
      },
    },
    {
      name: 'orderBy',
      transform: { type: 'scalar' },
      codeRefs: {
        used: [
          { a: 874, b: 880, line: 41, col: 7 },
          { a: 1108, b: 1114, line: 51, col: 7 },
        ],
      },
    },
    {
      name: 'limit',
      transform: { type: 'scalar' },
      codeRefs: { used: [{ a: 1300, b: 1304, line: 59, col: 7 }] },
    },
    {
      name: 'offset',
      transform: { type: 'scalar' },
      codeRefs: { used: [{ a: 1314, b: 1319, line: 59, col: 21 }] },
    },
  ],
  usedParamSet: {
    userId: true,
    category: true,
    levels: true,
    status: true,
    order: true,
    orderBy: true,
    limit: true,
    offset: true,
  },
  statement: {
    body:
      'SELECT "Question"."id",\n  "Question"."question",\n  "Question"."_categoryId",\n  "Question"."_levelId",\n  "Question"."_statusId",\n  "Question"."acceptedAt",\n  COALESCE(\n    (\n      SELECT true\n      FROM "QuestionVote"\n      WHERE "_questionId" = "Question"."id"\n        AND "_userId" = :userId\n      LIMIT 1\n    ), false\n  ) as "didUserVoteOn",\n  count("QuestionVote") as "votesCount"\nFROM "Question",\n  "QuestionVote"\nWHERE (\n    "QuestionVote"."_questionId" = "Question"."id"\n    AND (\n      ("Question"."_categoryId" = :category)\n      OR (:category IS NULL)\n    )\n    AND (\n      ("Question"."_levelId" IN :levels)\n      OR (:levels IS NULL)\n    )\n    AND (\n      ("Question"."_statusId" = :status)\n      OR (:status IS NULL)\n    )\n  )\nGROUP BY "Question"."id"\nORDER BY CASE\n    WHEN :order = \'asc\' THEN CASE\n      :orderBy\n      WHEN \'level\' THEN "_levelId"\n      WHEN \'acceptedAt\' THEN "acceptedAt"\n      WHEN \'votesCount\' THEN count("QuestionVote")\n      ELSE NULL\n    END\n    ELSE NULL\n  END ASC,\n  CASE\n    WHEN :order = \'desc\' THEN CASE\n      :orderBy\n      WHEN \'level\' THEN "_levelId"\n      WHEN \'acceptedAt\' THEN "acceptedAt"\n      WHEN \'votesCount\' THEN count("QuestionVote")\n      ELSE NULL\n    END\n    ELSE NULL\n  END DESC\nLIMIT :limit OFFSET :offset',
    loc: { a: 55, b: 1319, line: 5, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * SELECT "Question"."id",
 *   "Question"."question",
 *   "Question"."_categoryId",
 *   "Question"."_levelId",
 *   "Question"."_statusId",
 *   "Question"."acceptedAt",
 *   COALESCE(
 *     (
 *       SELECT true
 *       FROM "QuestionVote"
 *       WHERE "_questionId" = "Question"."id"
 *         AND "_userId" = :userId
 *       LIMIT 1
 *     ), false
 *   ) as "didUserVoteOn",
 *   count("QuestionVote") as "votesCount"
 * FROM "Question",
 *   "QuestionVote"
 * WHERE (
 *     "QuestionVote"."_questionId" = "Question"."id"
 *     AND (
 *       ("Question"."_categoryId" = :category)
 *       OR (:category IS NULL)
 *     )
 *     AND (
 *       ("Question"."_levelId" IN :levels)
 *       OR (:levels IS NULL)
 *     )
 *     AND (
 *       ("Question"."_statusId" = :status)
 *       OR (:status IS NULL)
 *     )
 *   )
 * GROUP BY "Question"."id"
 * ORDER BY CASE
 *     WHEN :order = 'asc' THEN CASE
 *       :orderBy
 *       WHEN 'level' THEN "_levelId"
 *       WHEN 'acceptedAt' THEN "acceptedAt"
 *       WHEN 'votesCount' THEN count("QuestionVote")
 *       ELSE NULL
 *     END
 *     ELSE NULL
 *   END ASC,
 *   CASE
 *     WHEN :order = 'desc' THEN CASE
 *       :orderBy
 *       WHEN 'level' THEN "_levelId"
 *       WHEN 'acceptedAt' THEN "acceptedAt"
 *       WHEN 'votesCount' THEN count("QuestionVote")
 *       ELSE NULL
 *     END
 *     ELSE NULL
 *   END DESC
 * LIMIT :limit OFFSET :offset
 * ```
 */
export const findAllQuestions = new PreparedQuery<IFindAllQuestionsParams, IFindAllQuestionsResult>(
  findAllQuestionsIR
);

/** 'CountAllQuestions' parameters type */
export interface ICountAllQuestionsParams {
  levels: Array<string | null | void>;
  category: string | null | void;
  status: string | null | void;
}

/** 'CountAllQuestions' return type */
export interface ICountAllQuestionsResult {
  count: number;
}

/** 'CountAllQuestions' query type */
export interface ICountAllQuestionsQuery {
  params: ICountAllQuestionsParams;
  result: ICountAllQuestionsResult;
}

const countAllQuestionsIR: any = {
  name: 'CountAllQuestions',
  params: [
    {
      name: 'levels',
      codeRefs: {
        defined: { a: 1358, b: 1363, line: 62, col: 8 },
        used: [
          { a: 1547, b: 1552, line: 72, col: 33 },
          { a: 1566, b: 1571, line: 73, col: 11 },
        ],
      },
      transform: { type: 'array_spread' },
    },
    {
      name: 'category',
      transform: { type: 'scalar' },
      codeRefs: {
        used: [
          { a: 1459, b: 1466, line: 68, col: 35 },
          { a: 1480, b: 1487, line: 69, col: 11 },
        ],
      },
    },
    {
      name: 'status',
      transform: { type: 'scalar' },
      codeRefs: {
        used: [
          { a: 1631, b: 1636, line: 76, col: 33 },
          { a: 1650, b: 1655, line: 77, col: 11 },
        ],
      },
    },
  ],
  usedParamSet: { category: true, levels: true, status: true },
  statement: {
    body:
      'SELECT COUNT(*)\nFROM "Question"\nWHERE (\n    (\n      ("Question"."_categoryId" = :category)\n      OR (:category IS NULL)\n    )\n    AND (\n      ("Question"."_levelId" IN :levels)\n      OR (:levels IS NULL)\n    )\n    AND (\n      ("Question"."_statusId" = :status)\n      OR (:status IS NULL)\n    )\n  )',
    loc: { a: 1378, b: 1674, line: 64, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*)
 * FROM "Question"
 * WHERE (
 *     (
 *       ("Question"."_categoryId" = :category)
 *       OR (:category IS NULL)
 *     )
 *     AND (
 *       ("Question"."_levelId" IN :levels)
 *       OR (:levels IS NULL)
 *     )
 *     AND (
 *       ("Question"."_statusId" = :status)
 *       OR (:status IS NULL)
 *     )
 *   )
 * ```
 */
export const countAllQuestions = new PreparedQuery<
  ICountAllQuestionsParams,
  ICountAllQuestionsResult
>(countAllQuestionsIR);
