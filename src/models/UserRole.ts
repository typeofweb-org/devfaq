import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  AllowNull,
  HasMany,
  PrimaryKey,
} from 'sequelize-typescript';
import { User } from './User';

@Table({ version: true, timestamps: true })
export class UserRole extends Model<UserRole> {
  @Unique
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.TEXT)
  readonly id!: string;

  @HasMany(() => User, '_roleId')
  _users?: User[];
}
