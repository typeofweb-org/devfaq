import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  PrimaryKey,
  Sequelize,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';
import nanoid from 'nanoid';

@Table({ version: true, timestamps: true })
export class Session extends Model<Session> {
  @Column
  readonly createdAt!: Date;

  @Column
  readonly updatedAt!: Date;

  @Column
  readonly version!: number;

  // tslint:disable-next-line:no-magic-numbers
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: Sequelize.STRING,
    defaultValue() {
      const TOKEN_LENGTH = 36;
      return nanoid(TOKEN_LENGTH);
    },
  })
  readonly id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  keepMeSignedIn!: boolean;

  @AllowNull(false)
  @Column(DataType.DATE)
  validUntil!: Date;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  _userId!: number;

  @BelongsTo(() => User, '_userId')
  _user?: User;
}
