import { isUndefined, omitBy } from 'lodash';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { QuestionNotFound } from '../../exception/exceptions';
import { PartiallyUpdateQuestionRequestPayload } from '../../validation-schema-types/types';
import { QuestionCategory, QuestionEntity, QuestionLevels, QuestionStatus, QuestionStatuses } from './Question.model';

export interface QuestionWhere {
  category?: QuestionCategory;
  status?: QuestionStatuses;
  level?: QuestionLevels;
  id?: number | number[];
}

export type QuestionOrderBy = keyof QuestionEntity;

@Service()
export class QuestionService {
  @OrmRepository(QuestionEntity)
  private repository: Repository<QuestionEntity>;

  public async getAcceptedQuestionsByIds(ids: number[]) {
    return this.findAcceptedBy({
      id: ids
    });
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

  public async findAcceptedBy(where: QuestionWhere) {
    return this.findBy({
      ...where,
      status: [QuestionStatus.accepted]
    });
  }

  public async findBy(optionalWhere: QuestionWhere, orderBy: QuestionOrderBy = 'acceptedAt'): Promise<QuestionEntity[]> {
    const where = removeUndefinedWhere(optionalWhere);
    const query = this.repository
      .createQueryBuilder('QuestionEntity')
      .select('*')
      .orderBy(`QuestionEntity.${orderBy}`, 'DESC');

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
