import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { QuestionCategory, QuestionEntity } from './Question.model';

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

  public async findByCategory(category: QuestionCategory) {
    return this.repository.find({
      where: {
        category
      }
    });
  }
}
