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
  IFindOptions,
  Scopes,
} from 'sequelize-typescript';
import { UserRole } from './UserRole';
import { USER_ROLE } from '../models-consts';

function withSensitiveData(): IFindOptions<User> {
  return {
    attributes: ['createdAt', 'updatedAt', 'version'],
  };
}

@DefaultScope({
  attributes: ['id', 'email', 'firstName', 'lastName', '_roleId'],
})
@Scopes({
  withSensitiveData,
})
@Table({ version: true, timestamps: true })
export class User extends Model<User> {
  readonly id!: number;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
  readonly version!: number;

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
