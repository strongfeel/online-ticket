import { IsEnum, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column('varchar', { nullable: false })
  email: string;

  @IsString()
  @Column('varchar', { length: 10, select: false, nullable: false })
  password: string;

  @IsString()
  @Column('varchar', { nullable: false })
  nickName: string;

  @IsEnum(UserRole)
  @Column('varchar')
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
