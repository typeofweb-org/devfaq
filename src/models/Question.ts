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
} from 'sequelize-typescript';
import { QuestionStatus } from './QuestionStatus';
import { QUESTION_STATUS, QUESTION_CATEGORY, QUESTION_LEVEL } from '../models-consts';
import { QuestionCategory } from './QuestionCategory';
import { QuestionLevel } from './QuestionLevel';

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
}
