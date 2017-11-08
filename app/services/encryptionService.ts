import * as bcrypt from 'bcrypt';
import * as Jwt from 'jsonwebtoken';
import { UserEntity } from '../entity/user/User.model';
import { configService } from './configService';

const NUMBER_OF_ROUNDS = 10;

export const encryptionService = {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, NUMBER_OF_ROUNDS);
  },

  createToken(user: UserEntity): string {
    return Jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      configService.getJwtSecret(),
      { algorithm: 'HS256', expiresIn: '1h' }
    );
  }
};
