import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  AllowNull,
  HasMany,
  PrimaryKey
} from "sequelize-typescript";
import { Question } from "./Question";

@Table({ version: true, timestamps: true })
export class QuestionStatus extends Model<QuestionStatus> {
  @Unique
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.TEXT)
  readonly id!: string;

  @HasMany(() => Question, "_statusId")
  _questions?: Question[];
}
