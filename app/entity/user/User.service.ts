import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { User } from './User.model';

@Service()
export class UserService {
  @OrmRepository(User)
  public repository: Repository<User>;
}
