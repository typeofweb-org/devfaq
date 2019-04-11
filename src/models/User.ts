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
  BelongsTo,
} from 'sequelize-typescript';
import { UserRole } from './UserRole';
import { USER_ROLE } from '../models-consts';

@DefaultScope({
  attributes: ['id', 'email', 'firstName', 'lastName', '_roleId'],
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

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSONB)
  socialLogin!: {};

  @ForeignKey(() => UserRole)
  @Default(USER_ROLE.USER)
  @AllowNull(false)
  @Column(DataType.STRING)
  _roleId!: USER_ROLE;

  @BelongsTo(() => UserRole, '_roleId')
  _role?: UserRole;
}
