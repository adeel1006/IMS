import { IsEmail, IsNumber, IsString } from '@nestjs/class-validator';
import { Exclude } from 'class-transformer';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  image: string;

  @IsString()
  username: string;

  @Exclude()
  password: string;

  @IsString()
  role: string;

  @IsString()
  organization: string;

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
