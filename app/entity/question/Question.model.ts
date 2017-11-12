import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { AbstractEntity } from '../AbstractEntity';

export enum QuestionCategory {
  html = 'html',
  css = 'css',
  js = 'js'
}
export type QuestionCategories = QuestionCategory[];
export const questionCategories: QuestionCategories = Object.values(QuestionCategory) as QuestionCategories;

export enum QuestionStatus {
  accepted = 'accepted',
  pending = 'pending'
}
export type QuestionStatuses = QuestionStatus[];
export const questionStatuses: QuestionStatuses = Object.values(QuestionStatus) as QuestionStatuses;

export type QuestionLevel = string;

@Entity()
export class QuestionEntity extends AbstractEntity {
  @Column() public question: string;

  @Column({
    type: String, // 'enum',
    enum: questionCategories
  }) public category: QuestionCategory;

  @Column() public level: QuestionLevel;

  @Column({
    default: ''
  }) public answer: string;

  @Column({
    type: String, // 'enum',
    enum: questionStatuses
  }) public status: QuestionStatus;

  @Column({
    nullable: true
  }) public acceptedAt?: Date;

  @BeforeUpdate()
  public async onBeforeUpdate() {
    return this.setAcceptedAt();
  }

  @BeforeInsert()
  public async onBeforeInsert() {
    return this.setAcceptedAt();
  }

  private async setAcceptedAt() {
    if (!this.acceptedAt && this.status === 'accepted') {
      this.acceptedAt = new Date();
    }
  }
}
