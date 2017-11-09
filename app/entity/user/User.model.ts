import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
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

    @Column({ default: 'user' })
    public role: UserRoles;

    @BeforeUpdate()
    public async onBeforeUpdate() {
        return this.hashPassword();
    }

    @BeforeInsert()
    public async onBeforeInsert() {
        return this.hashPassword();
    }

    private async hashPassword() {
        this.password = await encryptionService.hash(this.password);
    }
}
