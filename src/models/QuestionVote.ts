import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  AllowNull,
  BelongsTo,
} from 'sequelize-typescript';
import { Question } from './Question';
import { User } from './User';

@Table({ timestamps: true, updatedAt: false })
export class QuestionVote extends Model<QuestionVote> {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, primaryKey: true })
  _userId!: number;

  @ForeignKey(() => Question)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, primaryKey: true })
  _questionId!: number;

  @BelongsTo(() => User, '_userId')
  _user?: User;

  @BelongsTo(() => Question, '_questionId')
  _question?: Question;
}
