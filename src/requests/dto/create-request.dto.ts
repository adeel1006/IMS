import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  itemName: string;

  @IsNotEmpty()
  @IsString()
  requestType: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsString()
  subCategory: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
