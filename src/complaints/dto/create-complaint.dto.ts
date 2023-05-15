import { IsString, IsNotEmpty } from "@nestjs/class-validator";

export class CreateComplaintDto {

    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @IsString()
    status: boolean;
  
    @IsString()
    action: string;
}
