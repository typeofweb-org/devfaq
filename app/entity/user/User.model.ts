import { BeforeInsert, Column, Entity } from 'typeorm';
import { encryptionService } from '../../services/encryptionService';
import { AbstractEntity } from '../AbstractEntity';

export type UserRoles = 'admin' | 'user';

@Entity()
export class UserEntity extends AbstractEntity {
    @Column({
        unique: true,
        nullable: false,
    }) public emailAddress: string;

    @Column() public password: string;

    @Column({ nullable: true, type: String })
    public firstName?: string | null;

    @Column({ nullable: true, type: String })
    public lastName?: string | null;

    @Column({ default: 'admin' })
    public role: UserRoles;

    @BeforeInsert()
    public async hashPassword() {
        this.password = await encryptionService.hash(this.password);
    }
}
