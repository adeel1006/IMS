import { IsString, IsNotEmpty } from '@nestjs/class-validator';

export class CreateComplaintDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  suggestion: string;

  @IsString()
  status: string;

  @IsString()
  action: string;
}
