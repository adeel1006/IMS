import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';
import { Exclude } from 'class-transformer';
export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Exclude()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    role: string;
}