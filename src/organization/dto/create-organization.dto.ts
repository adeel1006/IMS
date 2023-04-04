import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  logoUrl: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  zipCode: string;

  @IsNotEmpty()
  @IsString()
  representativeName: string;

  @IsNotEmpty()
  @IsString()
  representativeContact: string;
}
