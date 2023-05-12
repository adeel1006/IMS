import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CreateVendorDto {
    @IsNotEmpty()
    @IsString()
    vendorName: string;

    @IsNotEmpty()
    @IsString()
    contactNumber: string;

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsString()
    subCategory: [];

    @IsString()
    action: string;
}
