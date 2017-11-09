import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { QuestionEntity, QuestionStatus } from './Question.model';

@Service()
export class QuestionService {
  @OrmRepository(QuestionEntity)
  private repository: Repository<QuestionEntity>;

  public async addNew(question: Partial<QuestionEntity>) {
    const questionEntity = this.repository.create(question);
    return this.repository.save(questionEntity);
  }

  public async countByQuestion(question: string) {
    return this.repository.count({
      where: { question }
    });
  }

  public async findAcceptedBy(where: Partial<QuestionEntity>) {
    return this.repository.find({
      where: {
        ...where,
        status: QuestionStatus.accepted
      }
    });
  }
}
