import { isUndefined, omitBy } from 'lodash';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { QuestionNotFound } from '../../exception/exceptions';
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

  public async findAcceptedBy(where: WhereBy<QuestionEntity>) {
    return this.findBy({
      ...where,
      status: QuestionStatus.accepted
    });
  }

  public async findBy(where: WhereBy<QuestionEntity>) {
    return this.repository.find({
      where: removeUndefinedWhere(where),
      order: {
        acceptedAt: 'DESC'
      }
    });
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

export type WhereBy<T> = {
  [P in keyof T]?: T[P];
};

const removeUndefinedWhere = <T extends object>(where: T): Partial<T> => {
  return omitBy<T>(where, isUndefined);
};
