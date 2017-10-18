import * as bcrypt from 'bcrypt';

const NUMBER_OF_ROUNDS = 10;

export const encryptionService = {
  async hash(password: string) {
    return bcrypt.hash(password, NUMBER_OF_ROUNDS);
  },
};
