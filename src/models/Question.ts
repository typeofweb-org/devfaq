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
import { QUESTION_STATUS, QUESTION_CATEGORY, QUESTION_LEVEL } from '../models-consts';
import { QuestionCategory } from './QuestionCategory';
import { QuestionLevel } from './QuestionLevel';
import { QuestionVote } from './QuestionVote';
import { User } from './User';
import { sequelize } from '../db';

function getQuestionsOrderQuery(orders: Array<[string, 'DESC' | 'ASC'] | [string]>): string {
  if (!orders || !orders.length) {
    return `"Question"."id" ASC`;
  }

  return orders
    .filter(o => o.length > 0)
    .map(o => {
      const [colName, order = ''] = o;
      if (colName === 'votesCount') {
        return `"votesCount" ${order}`.trim();
      }

      return `"Question"."${colName}" ${order}`.trim();
    })
    .join(',\n');
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
    if (!instance.acceptedAt && instance._statusId === QUESTION_STATUS.ACCEPTED) {
      instance.acceptedAt = new Date();
    }
    if (instance.acceptedAt && instance._statusId === QUESTION_STATUS.PENDING) {
      instance.acceptedAt = null;
    }
  }

  static async findAllWithVotes({
    limit,
    offset,
    order,
  }: IFindOptions<Question>): Promise<Question[]> {
    // tslint:disable-next-line:no-any
    const orders = order as any;
    return sequelize.query(
      `
    SELECT
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
    GROUP BY "Question".id
    ORDER BY  ${getQuestionsOrderQuery(orders)}
    ${limit ? 'LIMIT :limit' : ''}
    ${offset ? 'OFFSET :offset' : ''}
    ;
    `,
      {
        type: Sequelize.QueryTypes.SELECT,
        nest: true,
        replacements: { limit, offset },
        // tslint:disable-next-line:no-any
        model: Question as any,
      }
    );
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
  _categoryId!: QUESTION_CATEGORY;

  @ForeignKey(() => QuestionLevel)
  @AllowNull(false)
  @Column(DataType.STRING)
  _levelId!: QUESTION_LEVEL;

  @ForeignKey(() => QuestionStatus)
  @Default(QUESTION_STATUS.PENDING)
  @AllowNull(false)
  @Column(DataType.STRING)
  _statusId!: QUESTION_STATUS;

  @BelongsToMany(() => User, {
    through: () => QuestionVote,
    foreignKey: '_questionId',
    otherKey: '_userId',
    as: '_votes',
  })
  _votes?: Array<User & { QuestionVote: QuestionVote }>;

  @Column({
    type: new DataType.VIRTUAL(DataType.INTEGER, ['_votes']),
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

  didUserVoteOn(user: User | undefined): boolean {
    return Boolean(
      this._votes && user && this._votes.some(v => v.QuestionVote._userId === user.id)
    );
  }
}
