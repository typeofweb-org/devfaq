import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  DefaultScope,
  ForeignKey,
  AllowNull,
  Default,
  BelongsTo,
  IFindOptions,
  Scopes,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserRole } from './UserRole';
import { Question } from './Question';
import { QuestionVote } from './QuestionVote';
import { UserRoleUnion } from '../models-consts';

function withSensitiveData(): IFindOptions<User> {
  return {
    attributes: ['createdAt', 'updatedAt', 'version', 'socialLogin'],
  };
}

@DefaultScope({
  attributes: ['id', 'email', 'firstName', 'lastName', '_roleId'],
})
@Scopes({
  withSensitiveData,
})
@Table({ version: true, timestamps: true })
export class User extends Model<User> {
  readonly id!: number;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
  readonly version!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.TEXT)
  email!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  firstName?: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  lastName?: string | null;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSONB)
  socialLogin!: {};

  @AllowNull(true)
  @Column(DataType.TEXT)
  avatarUrl?: string | null;

  @ForeignKey(() => UserRole)
  @Default('user')
  @AllowNull(false)
  @Column(DataType.STRING)
  _roleId!: UserRoleUnion;

  @BelongsTo(() => UserRole, '_roleId')
  _role?: UserRole;

  @BelongsToMany(() => Question, {
    through: () => QuestionVote,
    foreignKey: '_userId',
    otherKey: '_questionId',
    as: '_votedOn',
  })
  _votedOn?: Array<Question & { QuestionVote: QuestionVote }>;
}
