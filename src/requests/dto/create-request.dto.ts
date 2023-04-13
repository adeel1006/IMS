import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CreateRequestDto {
    @IsNotEmpty()
    @IsString()
    requestType: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
