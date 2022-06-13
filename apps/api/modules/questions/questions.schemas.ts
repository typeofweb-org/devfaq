import { Type, Static } from '@sinclair/typebox';

const getQuestionsQuerySchema = Type.Object({
  category: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
  level: Type.Optional(Type.Array(Type.String(), { minItems: 1 })),
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
  orderBy: Type.Optional(
    Type.Union([Type.Literal('acceptedAt'), Type.Literal('level'), Type.Literal('votesCount')])
  ),
  order: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')])),
});
export type GetQuestionsOrderBy = Static<typeof getQuestionsQuerySchema>['orderBy'];
export type GetQuestionsOrder = Static<typeof getQuestionsQuerySchema>['order'];

const questionShape = {
  id: Type.Integer(),
  question: Type.String(),
  _categoryId: Type.String(),
  _levelId: Type.String(),
  _statusId: Type.String(),
  acceptedAt: Type.Optional(Type.String({ format: 'date-time' })),
} as const;

const questionResponseSchema = Type.Object({
  ...questionShape,
  votesCount: Type.Integer(),
  currentUserVotedOn: Type.Boolean(),
});

const getQuestionsResponseSchema = Type.Object({
  data: Type.Array(questionResponseSchema),
  meta: Type.Object({
    total: Type.Integer(),
  }),
});

export const getQuestionsSchema = {
  querystring: getQuestionsQuerySchema,
  response: {
    200: getQuestionsResponseSchema,
  },
} as const;
