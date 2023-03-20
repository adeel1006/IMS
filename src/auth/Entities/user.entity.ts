import { IsEmail, MinLength } from '@nestjs/class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @MinLength(8)
  password: string;

  @Column()
  role: string;
}
