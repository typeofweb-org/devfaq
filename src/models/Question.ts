import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  ForeignKey,
  AllowNull,
  Default,
  BeforeUpdate,
  BeforeCreate,
  BelongsToMany,
  Scopes,
  IFindOptions,
  Sequelize,
} from 'sequelize-typescript';
import { QuestionStatus } from './QuestionStatus';
import { QuestionCategory } from './QuestionCategory';
import { QuestionLevel } from './QuestionLevel';
import { QuestionVote } from './QuestionVote';
import { User } from './User';
import { sequelize } from '../db';
import { isArray } from 'util';
import { QuestionLevelUnion, QuestionCategoryUnion, QuestionStatusUnion } from '../models-consts';

function getQuestionsOrderQuery(orders: Array<[string, 'DESC' | 'ASC'] | [string]>): string {
  if (!orders || !orders.length) {
    return `"Question"."id" ASC`;
  }

  return orders
    .filter((o) => o.length > 0)
    .filter(([colName]) => {
      return colName in Question.rawAttributes;
    })
    .map((o) => {
      const [colName, order = ''] = o;
      if (colName === 'votesCount') {
        return `"votesCount" ${order}`.trim();
      }

      return `"Question"."${colName}" ${order}`.trim();
    })
    .join(',\n');
}

function getQuestionsWhereQuery(
  where: { [P in keyof Question]?: number | string | boolean | number[] | string[] | boolean[] }
): string {
  return Object.entries(where)
    .map(([key, val]) => {
      if (isArray(val)) {
        return `"Question"."${key}" IN (:${key})`;
      }
      return `"Question"."${key}" = :${key}`;
    })
    .join(' AND ');
}

@Scopes({
  withVotes() {
    return {
      include: [
        {
          model: User,
          as: '_votes',
          attributes: ['id'],
        },
      ],
    };
  },
})
@Table({ version: true, timestamps: true })
export class Question extends Model<Question> {
  @BeforeUpdate
  @BeforeCreate
  static setAcceptedAt(instance: Question) {
    if (!instance.acceptedAt && instance._statusId === 'accepted') {
      instance.acceptedAt = new Date();
    }
    if (instance.acceptedAt && instance._statusId === 'pending') {
      instance.acceptedAt = null;
    }
  }

  static async findAllWithVotes(
    { limit, offset, order, where }: IFindOptions<Question>,
    userId?: User['id']
  ): Promise<Question[]> {
    // tslint:disable-next-line:no-any
    const orders = order as any;
    // tslint:disable-next-line:no-any
    const whereQuery = getQuestionsWhereQuery(where as any);

    const didUserVoteOnQuery = userId
      ? `COALESCE( (SELECT true FROM "QuestionVote" WHERE "_questionId" = "Question"."id" AND "_userId" = :userId), false)`
      : `false`;

    return sequelize.query(
      `
    SELECT
      ${didUserVoteOnQuery} as "didUserVoteOn",
      "Question"."id",
      "Question"."question",
      "Question"."_categoryId",
      "Question"."_levelId",
      "Question"."_statusId",
      "Question"."acceptedAt",
      count("_votes"."id") as "votesCount"
    FROM "Question"
    LEFT OUTER JOIN (
      "QuestionVote" INNER JOIN "User" AS "_votes" ON "_votes"."id" = "QuestionVote"."_userId"
    ) ON "Question"."id" = "QuestionVote"."_questionId"

    ${whereQuery ? `WHERE ${whereQuery}` : ''}
    
    GROUP BY "Question".id
    ORDER BY  ${getQuestionsOrderQuery(orders)}
    ${limit ? 'LIMIT :limit' : ''}
    ${offset ? 'OFFSET :offset' : ''}
    ;
    `,
      {
        type: Sequelize.QueryTypes.SELECT,
        nest: true,
        // tslint:disable-next-line:no-any
        replacements: { limit, offset, userId, ...(where as any) },
        // tslint:disable-next-line:no-any
        model: Question as any,
      }
    );
  }

  static async didUserVoteOn(user: User, question: Question): Promise<boolean> {
    const vote = await QuestionVote.findOne({
      where: {
        _userId: user.id,
        _questionId: question.id,
      },
    });

    return Boolean(vote);
  }

  @Unique
  @AllowNull(false)
  @Column(DataType.TEXT)
  question!: string;

  @Unique
  @AllowNull(true)
  @Column(DataType.DATE)
  acceptedAt?: Date | null;

  @ForeignKey(() => QuestionCategory)
  @AllowNull(false)
  @Column(DataType.STRING)
  _categoryId!: QuestionCategoryUnion;

  @ForeignKey(() => QuestionLevel)
  @AllowNull(false)
  @Column(DataType.STRING)
  _levelId!: QuestionLevelUnion;

  @ForeignKey(() => QuestionStatus)
  @Default('pending')
  @AllowNull(false)
  @Column(DataType.STRING)
  _statusId!: QuestionStatusUnion;

  @BelongsToMany(() => User, {
    through: () => QuestionVote,
    foreignKey: '_questionId',
    otherKey: '_userId',
    as: '_votes',
  })
  _votes?: Array<User & { QuestionVote: QuestionVote }>;

  @Column({
    type: new DataType.VIRTUAL(DataType.BOOLEAN),
    get() {
      return this.getDataValue('didUserVoteOn') || false;
    },
  })
  didUserVoteOn?: boolean;

  @Column({
    type: new DataType.VIRTUAL(DataType.INTEGER),
    get() {
      if (this.getDataValue('votesCount')) {
        return this.getDataValue('votesCount');
      }

      const votes = this.getDataValue('_votes') as Question['_votes'];
      if (!votes) {
        throw new Error('Include _votes if you need votesCount!');
      }
      return votes.length;
    },
  })
  votesCount!: number;
}
