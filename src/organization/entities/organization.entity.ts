import { IsEmail } from '@nestjs/class-validator';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logoUrl: string;

  @Column()
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  bio: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  zipCode: string;

  @Column()
  representativeName: string;

  @Column()
  representativeContact: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(()=>User, (users)=>users.organzation)
  users:User[];
}
