import { IsString, IsNotEmpty } from "@nestjs/class-validator";

export class CreateComplaintDto {
    // @IsNotEmpty()
    // @IsString()
    // employeeName: string;

    @IsNotEmpty()
    @IsString()
    userId:number;

    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @IsString()
    status: string;
  
    @IsString()
    action: string;
}
