import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsString()
  itemName: string;

  @IsNotEmpty()
  @IsString()
  serialNumber: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: number;

  @IsNotEmpty()
  @IsString()
  subCategoryId: number;

  @IsNotEmpty()
  @IsString()
  price: number;

  @IsString()
  vendor: number;

}
