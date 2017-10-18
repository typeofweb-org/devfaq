import { BeforeInsert, Column, Entity } from 'typeorm';
import { encryptionService } from '../../services/encryptionService';
import { AbstractEntity } from '../AbstractEntity';

@Entity()
export class User extends AbstractEntity {
    @Column({
        unique: true,
    }) public emailAddress: string;

    @Column({
        nullable: false,
    }) public password: string;

    @Column({nullable: true})
    public firstName: string;

    @Column({nullable: true})
    public lastName: string;

    @BeforeInsert()
    public async hashPassword() {
        return encryptionService
            .hash(this.password)
            .then((hash) => this.password = hash);
    }
}
