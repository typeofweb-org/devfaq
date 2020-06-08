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
export class QuestionCategory extends Model<QuestionCategory> {
  @Unique
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.TEXT)
  readonly id!: string;

  @HasMany(() => Question, "_categoryId")
  _questions?: Question[];
}
