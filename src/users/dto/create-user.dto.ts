import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from '@nestjs/class-validator';
import { Exclude } from 'class-transformer';
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @Exclude()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: string;

  @IsNumber()
  age: number;

  @IsString()
  contact: string;

  @IsString()
  designation: string;

  @IsString()
  department: string;

  @IsString()
  experience: string;

  @IsString()
  education: string;
}
