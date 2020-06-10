/** Types generated for queries found in "src/questions.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'FindAllQuestions' parameters type */
export interface IFindAllQuestionsParams {
  levels: Array<string | null | void>;
  userId: number | null | void;
  category: string | null | void;
  status: string | null | void;
  orderBy: string | null | void;
  limit: number | null | void;
  offset: number | null | void;
}

/** 'FindAllQuestions' return type */
export interface IFindAllQuestionsResult {
  id: number;
  question: string;
  _categoryId: string;
  _levelId: string;
  _statusId: string;
  acceptedAt: Date | null;
  didUserVoteOn: boolean;
  votesCount: number;
}

/** 'FindAllQuestions' query type */
export interface IFindAllQuestionsQuery {
  params: IFindAllQuestionsParams;
  result: IFindAllQuestionsResult;
}

const findAllQuestionsIR: any = {"name":"FindAllQuestions","params":[{"name":"levels","codeRefs":{"defined":{"a":35,"b":40,"line":3,"col":8},"used":[{"a":762,"b":767,"line":32,"col":33},{"a":781,"b":786,"line":33,"col":11}]},"transform":{"type":"array_spread"}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":341,"b":346,"line":16,"col":25}]}},{"name":"category","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":674,"b":681,"line":28,"col":35},{"a":695,"b":702,"line":29,"col":11}]}},{"name":"status","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":846,"b":851,"line":36,"col":33},{"a":865,"b":870,"line":37,"col":11}]}},{"name":"orderBy","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":924,"b":930,"line":41,"col":10}]}},{"name":"limit","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":939,"b":943,"line":42,"col":7}]}},{"name":"offset","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":953,"b":958,"line":42,"col":21}]}}],"usedParamSet":{"userId":true,"category":true,"levels":true,"status":true,"orderBy":true,"limit":true,"offset":true},"statement":{"body":"SELECT \"Question\".\"id\",\n  \"Question\".\"question\",\n  \"Question\".\"_categoryId\",\n  \"Question\".\"_levelId\",\n  \"Question\".\"_statusId\",\n  \"Question\".\"acceptedAt\",\n  COALESCE(\n    (\n      SELECT true\n      FROM \"QuestionVote\"\n      WHERE \"_questionId\" = \"Question\".\"id\"\n        AND \"_userId\" = :userId\n      LIMIT 1\n    ), false\n  ) as \"didUserVoteOn\",\n  count(\"_votes\".\"id\") as \"votesCount\"\nFROM \"Question\"\n  LEFT OUTER JOIN (\n    \"QuestionVote\"\n    INNER JOIN \"User\" AS \"_votes\" ON \"_votes\".\"id\" = \"QuestionVote\".\"_userId\"\n  ) ON \"Question\".\"id\" = \"QuestionVote\".\"_questionId\"\nWHERE (\n    (\n      (\"Question\".\"_categoryId\" = :category)\n      OR (:category IS NULL)\n    )\n    AND (\n      (\"Question\".\"_levelId\" IN :levels)\n      OR (:levels IS NULL)\n    )\n    AND (\n      (\"Question\".\"_statusId\" = :status)\n      OR (:status IS NULL)\n    )\n  )\nGROUP BY \"Question\".id\nORDER BY :orderBy\nLIMIT :limit OFFSET :offset","loc":{"a":55,"b":958,"line":5,"col":0}}};

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
 *   count("_votes"."id") as "votesCount"
 * FROM "Question"
 *   LEFT OUTER JOIN (
 *     "QuestionVote"
 *     INNER JOIN "User" AS "_votes" ON "_votes"."id" = "QuestionVote"."_userId"
 *   ) ON "Question"."id" = "QuestionVote"."_questionId"
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
 * GROUP BY "Question".id
 * ORDER BY :orderBy
 * LIMIT :limit OFFSET :offset
 * ```
 */
export const findAllQuestions = new PreparedQuery<IFindAllQuestionsParams,IFindAllQuestionsResult>(findAllQuestionsIR);


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

const countAllQuestionsIR: any = {"name":"CountAllQuestions","params":[{"name":"levels","codeRefs":{"defined":{"a":997,"b":1002,"line":45,"col":8},"used":[{"a":1186,"b":1191,"line":55,"col":33},{"a":1205,"b":1210,"line":56,"col":11}]},"transform":{"type":"array_spread"}},{"name":"category","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1098,"b":1105,"line":51,"col":35},{"a":1119,"b":1126,"line":52,"col":11}]}},{"name":"status","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1270,"b":1275,"line":59,"col":33},{"a":1289,"b":1294,"line":60,"col":11}]}}],"usedParamSet":{"category":true,"levels":true,"status":true},"statement":{"body":"SELECT COUNT(*)\nFROM \"Question\"\nWHERE (\n    (\n      (\"Question\".\"_categoryId\" = :category)\n      OR (:category IS NULL)\n    )\n    AND (\n      (\"Question\".\"_levelId\" IN :levels)\n      OR (:levels IS NULL)\n    )\n    AND (\n      (\"Question\".\"_statusId\" = :status)\n      OR (:status IS NULL)\n    )\n  )","loc":{"a":1017,"b":1313,"line":47,"col":0}}};

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
export const countAllQuestions = new PreparedQuery<ICountAllQuestionsParams,ICountAllQuestionsResult>(countAllQuestionsIR);


