import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}