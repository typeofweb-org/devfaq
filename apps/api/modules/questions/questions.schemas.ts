import { Type, Static } from '@sinclair/typebox';

const getQuestionsQuerySchema = Type.Object({
  category: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
  level: Type.Optional(Type.String({ pattern: '^(\\w+,?)+$' })),
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
  orderBy: Type.Optional(
    Type.Union([Type.Literal('acceptedAt'), Type.Literal('level'), Type.Literal('votesCount')])
  ),
  order: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')])),
});
export type GetQuestionsQuery = Static<typeof getQuestionsQuerySchema>;
export type GetQuestionsOrderBy = GetQuestionsQuery['orderBy'];
export type GetQuestionsOrder = GetQuestionsQuery['order'];

const questionShape = {
  id: Type.Integer(),
  question: Type.String(),
  _categoryId: Type.String(),
  _levelId: Type.String(),
  _statusId: Type.String(),
  acceptedAt: Type.Optional(Type.String({ format: 'date-time' })),
} as const;

const createQuestionShape = {
  question: Type.String(),
  level: Type.String(),
  category: Type.String(),
};

const questionResponseSchema = Type.Object({
  ...questionShape,
  votesCount: Type.Integer(),
  currentUserVotedOn: Type.Boolean(),
});

export const getQuestionsSchema = {
  querystring: getQuestionsQuerySchema,
  response: {
    200: Type.Object({
      data: Type.Array(questionResponseSchema),
      meta: Type.Object({
        total: Type.Integer(),
      }),
    }),
  },
} as const;

export const postQuestionsSchema = {
  body: Type.Object(createQuestionShape),
  response: {
    200: Type.Object({
      data: questionResponseSchema,
    }),
  },
} as const;

export const patchQuestionByIdSchema = {
  params: Type.Object({
    id: Type.Integer(),
  }),
  body: Type.Object({ ...createQuestionShape, status: Type.String() }),
  response: {
    200: Type.Object({
      data: questionResponseSchema,
    }),
  },
};

export const getQuestionByIdSchema = {
  params: Type.Object({
    id: Type.Integer(),
  }),
  response: {
    200: Type.Object({
      data: questionResponseSchema,
    }),
  },
};

export const deleteQuestionByIdSchema = {
  params: Type.Object({
    id: Type.Integer(),
  }),
};
