import { isUndefined, omitBy } from 'lodash';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { QuestionNotFound } from '../../exception/exceptions';
import { GetQuestionsRequestQuery, PartiallyUpdateQuestionRequestPayload } from '../../validation-schema-types/types';
import { QuestionEntity, QuestionStatus } from './Question.model';

@Service()
export class QuestionService {
  @OrmRepository(QuestionEntity)
  private repository: Repository<QuestionEntity>;

  public async getQuestionsByIds(ids: number[]) {
    return this.repository.findByIds(ids);
  }

  public async addNew(question: Partial<QuestionEntity>) {
    const questionEntity = this.repository.create(question);
    return this.repository.save(questionEntity);
  }

  public async countByQuestion(question: string) {
    return this.repository.count({
      where: { question }
    });
  }

  public async findAcceptedBy(where: GetQuestionsRequestQuery) {
    return this.findBy({
      ...where,
      status: [QuestionStatus.accepted]
    });
  }

  public async findBy(optionalWhere: GetQuestionsRequestQuery) {
    const where = removeUndefinedWhere(optionalWhere);
    const query = this.repository
      .createQueryBuilder('QuestionEntity')
      .select('*');

    buildQueryForWhere(query, where);

    return query.getRawMany();
  }

  public async updateById(id: number, updates: PartiallyUpdateQuestionRequestPayload) {
    const question = await this.repository.findOneById(id);
    if (!question) {
      throw new QuestionNotFound();
    }

    Object.entries(updates).forEach(([key, val]) => {
      question[key] = val;
    });

    return this.repository.save(question);
  }

  public async updateStatusById(id: number, status: QuestionStatus) {
    const question = await this.repository.findOneById(id);
    if (!question) {
      throw new QuestionNotFound();
    }

    if (question.status !== status) {
      question.status = status;
      return this.repository.save(question);
    }

    return question;
  }

  public async removeById(id: number) {
    const question = await this.repository.findOneById(id);
    if (!question) {
      throw new QuestionNotFound();
    }

    return this.repository.remove(question);
  }
}

const buildQueryForWhere = <T>(query: SelectQueryBuilder<T>, where: object): SelectQueryBuilder<T> => {
  for (const [key, val] of Object.entries(where)) {
    if (Array.isArray(val)) {
      query.andWhere(`QuestionEntity.${key} in (:${key})`, { [key]: val });
    } else {
      query.andWhere(`QuestionEntity.${key} = :${key}`, { [key]: val });
    }
  }
  return query;
};

const removeUndefinedWhere = <T extends object>(where: T): Partial<T> => {
  return omitBy<T>(where, isUndefined);
};
