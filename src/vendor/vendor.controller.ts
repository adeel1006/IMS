import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Catch,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CONSTANTS } from 'src/users/constants';
import { CurrentUser } from 'src/customDecorators/user.decorator';

@Catch(HttpException)
@UseGuards(
  JwtAuthGuard,
  new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
)
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  create(@CurrentUser() currentUser, @Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.createVendor(createVendorDto);
  }

  @Get()
  findAll(@CurrentUser() currentUser) {
    return this.vendorService.findAllVendor();
  }

  @Get(':id')
  findOne(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.vendorService.findOneVendor(+id);
  }

  @Patch(':id')
  update(@CurrentUser() currentUser, @Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.updateVendor(+id, updateVendorDto);
  }

  @Delete(':id')
  remove(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.vendorService.removeVendor(+id);
  }

  @Get('vendorsCount')
  async vendorsCount(@CurrentUser() currentUser) {
    const count = await this.vendorService.vendorCount();
    return { count };
  }
  catch(error: HttpException) {
    return { message: error.message };
  }
}
