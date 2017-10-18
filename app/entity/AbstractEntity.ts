import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn() public readonly id?: number;
  @CreateDateColumn() public readonly createdAt?: Date;
  @UpdateDateColumn() public readonly updatedAt?: Date;
  @VersionColumn() public readonly version?: number;
}
