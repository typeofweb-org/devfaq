import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../AbstractEntity';

export enum QuestionCategory {
  html = 'html',
  css = 'css',
  js = 'js'
}
export const questionCategories: QuestionCategory[] = Object.values(QuestionCategory) as QuestionCategory[];

export enum QuestionStatus {
  accepted = 'accepted',
  pending = 'pending',
  rejected = 'rejected'
}
export const questionStatuses: QuestionStatus[] = Object.values(QuestionStatus) as QuestionStatus[];

@Entity()
export class QuestionEntity extends AbstractEntity {
  @Column() public question: string;

  @Column({
    type: String, // 'enum',
    enum: questionCategories
  }) public category: QuestionCategory;

  @Column() public level: string;

  @Column({
    default: ''
  }) public answer: string;

  @Column({
    type: String, // 'enum',
    enum: questionStatuses
  }) public status: QuestionStatus;
}
