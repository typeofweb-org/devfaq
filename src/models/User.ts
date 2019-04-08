import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  DefaultScope,
  ForeignKey,
  AllowNull,
  Default,
} from 'sequelize-typescript';
import { UserRole } from './UserRole';
import { USER_ROLE } from '../models-consts';

@DefaultScope({
  attributes: ['email', 'firstName', 'lastName', '_roleId'],
  include: [() => UserRole],
})
@Table({ version: true, timestamps: true })
export class User extends Model<User> {
  @Unique
  @AllowNull(false)
  @Column(DataType.TEXT)
  email!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  firstName?: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  lastName?: string | null;

  @ForeignKey(() => UserRole)
  @Default(USER_ROLE.USER)
  @AllowNull(false)
  @Column(DataType.STRING)
  _roleId!: USER_ROLE;
}
