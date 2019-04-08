import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  HasMany,
  Unique,
  IFindOptions,
  DefaultScope,
  Scopes,
  BelongsToMany,
  HasOne,
  BeforeSave,
  ForeignKey,
} from 'sequelize-typescript';
import { UserRole } from './UserRole';
import { UserType } from './UserType';
import { ShirtSize } from './ShirtSize';
import { News } from './News';
import { Bounty } from './Bounty';
import { BountiesPathLevel } from './BountiesPathLevel';
import { UnlockedBounty } from './UnlockedBounty';
import { AccountingData } from './AccountingData';
import { Project } from './Project';
import { Assignment } from './Assignment';
import { Answer } from './Answer';
import { Question } from './Question';
import { Invoice } from './Invoice';
import { Currency } from './Currency';
import { PaymentType } from './PaymentType';
import { Event } from './Event';
import Boom from 'boom';
import { USER_ROLE, USER_TYPE } from '../models-consts';
import { isScopeRole } from '../utils/permissions';
import { EmergencyContact } from './EmergencyContact';
import { TransactionHistory } from './TransactionHistory';
import { VaultItemPurchase } from './VaultItemPurchase';
import { RaidRound } from './RaidRound';
import { Raid } from './Raid';
import { Session } from './Session';
import { FavoriteBounty } from './FavoriteBounty';
import { Dices } from './Dices';
import { InvoiceItem } from './InvoiceItem';

function withSensitiveData(): IFindOptions<User> {
  return {
    attributes: [
      'lastLoginAt',
      'shippingAddress',
      'rate',
      'tax',
      'notes',
      'telephone',
      'harvestId',
    ],
    include: [Currency, EmergencyContact, { model: AccountingData, include: [PaymentType] }],
  };
}

@DefaultScope({
  attributes: ['id', 'isActive', 'email', 'displayName', 'avatarUrl', 'slackId', '_typeId'],
  include: [() => UserRole, () => UserType, () => ShirtSize],
})
@Scopes({
  withSensitiveData,
  forRole(scope: string[], { includeSensitiveData = true } = {}) {
    if (isScopeRole(scope, USER_ROLE.ADMIN)) {
      return withSensitiveData();
    }

    if (isScopeRole(scope, USER_ROLE.MANAGER)) {
      return {
        ...(includeSensitiveData ? withSensitiveData() : {}),
        where: {
          _typeId: USER_TYPE.DEVELOPER,
        },
      };
    }

    return {};
  },
})
@Table
export class User extends Model<User> {
  @BeforeSave
  static async beforeSaveHook(instance: User) {
    if (instance.id && instance.rate && instance.changed('rate')) {
      await Assignment.update(
        { rate: instance.rate },
        {
          where: {
            _userId: instance.id,
            isActive: true,
          },
        }
      );
    }
  }

  @Unique
  @Column(DataType.TEXT)
  email!: string;

  @Column(DataType.TEXT)
  displayName!: string;

  @Column(DataType.DATE)
  lastLoginAt?: Date | null;

  @Column(DataType.TEXT)
  slackId?: string | null;

  @Column(DataType.TEXT)
  firebaseId?: string | null;

  @Column(DataType.BOOLEAN)
  isActive?: boolean | null;

  @Column(DataType.TEXT)
  avatarUrl?: string | null;

  @Column(DataType.TEXT)
  shippingAddress?: string | null;

  @Column(DataType.DOUBLE)
  rate?: number | null;

  @Column(DataType.DOUBLE)
  tax?: number | null;

  @Column(DataType.TEXT)
  telephone?: string | null;

  @Column(DataType.TEXT)
  notes?: string | null;

  @ForeignKey(() => AccountingData)
  @Column(DataType.INTEGER)
  _accountingDataId?: number | null;

  @BelongsTo(() => AccountingData, {
    foreignKey: '_accountingDataId',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  _accountingData?: AccountingData | null;

  @ForeignKey(() => Currency)
  @Column(DataType.INTEGER)
  _currencyId!: number;

  @BelongsTo(() => Currency, {
    foreignKey: '_currencyId',
    onUpdate: 'CASCADE',
  })
  _currency?: Currency | null;

  @ForeignKey(() => UserRole)
  @Column(DataType.INTEGER)
  _roleId!: number;

  @Column(DataType.TEXT)
  harvestId!: string | null;

  @BelongsTo(() => UserRole, {
    foreignKey: '_roleId',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  _role?: UserRole | null;

  @ForeignKey(() => UserType)
  @Column(DataType.TEXT)
  _typeId!: string;

  @BelongsTo(() => UserType, {
    foreignKey: '_typeId',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  _type?: UserType | null;

  @ForeignKey(() => ShirtSize)
  @Column(DataType.INTEGER)
  _shirtSizeId?: number | null;

  @BelongsTo(() => ShirtSize, {
    foreignKey: '_shirtSizeId',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  _shirtSize?: ShirtSize | null;

  @HasMany(() => Answer, '_userId')
  _answers?: Answer[];

  @HasMany(() => Assignment, '_userId')
  _assignments?: Assignment[];

  @HasMany(() => BountiesPathLevel, '_userId')
  _bountiesPathLevels?: BountiesPathLevel[];

  @HasMany(() => Bounty, '_addedById')
  _bounties?: Bounty[];

  @HasMany(() => Dices, '_grantedById')
  _dicesGrantedBy?: Dices[];

  @HasMany(() => Dices, '_grantedToId')
  _diceGrantedTo?: Dices[];

  @HasOne(() => EmergencyContact, '_userId')
  _emergencyContact?: EmergencyContact[];

  @HasMany(() => Event, '_userId')
  _events?: Event[];

  @HasMany(() => FavoriteBounty, '_favedById')
  _favoriteBounties?: FavoriteBounty[];

  @HasMany(() => InvoiceItem, '_approvedById')
  _invoiceItems?: InvoiceItem[];

  @HasMany(() => Invoice, '_userId')
  _invoices?: Invoice[];

  @HasMany(() => News, '_userId')
  _news?: News[];

  @HasMany(() => Project, '_adminId')
  _projectsCreated?: Project[];

  @HasMany(() => Question, '_userId')
  _questions?: Question[];

  @HasMany(() => RaidRound, '_createdById')
  _raidRounds?: RaidRound[];

  @HasMany(() => Raid, '_createdById')
  _raids?: Raid[];

  @HasMany(() => Session, '_userId')
  _sessions?: Session[];

  @HasMany(() => TransactionHistory, '_grantedById')
  _transactionHistoriesGrantedBy?: TransactionHistory[];

  @HasMany(() => TransactionHistory, '_grantedToId')
  _transactionHistoriesGrantedTo?: TransactionHistory[];

  @HasMany(() => UnlockedBounty, '_grantedById')
  _unlockedBountiesGrantedBy?: UnlockedBounty[];

  @HasMany(() => UnlockedBounty, '_grantedToId')
  _unlockedBountiesGrantedTo?: UnlockedBounty[];

  @HasMany(() => VaultItemPurchase, '_buyerId')
  _vaultItemPurchases?: VaultItemPurchase[];

  @BelongsToMany(() => Project, {
    through: 'Assignment',
    foreignKey: '_userId',
    otherKey: '_projectId',
    as: '_inProjects',
  })
  _inProjects?: Project[];
}

export async function getUserBySlackId(slackId: string): Promise<User> {
  const user = await User.scope('defaultScope', 'withSensitiveData').findOne({
    where: {
      slackId,
    },
  });
  if (!user) {
    throw Boom.notFound(`User with slack ID: ${slackId} not found`);
  }
  return user;
}

export function isUserAdmin(user: User): boolean {
  return Boolean(user._roleId === USER_ROLE.ADMIN);
}
