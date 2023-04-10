import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    categoryName: string;

    @IsString()
    subCategoryName: string;
}
