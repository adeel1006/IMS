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
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CONSTANTS } from 'src/users/constants';

@Catch(HttpException)
@Controller('organization')
@UseGuards(
  JwtAuthGuard,
  new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.SUPER_ADMIN]),
)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return this.organizationService.createOrganization(
      createOrganizationDto,
      logo,
    );
  }

  @Get()
  findAll() {
    return this.organizationService.findAllOrganizations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOneOrganization(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.updateOrganization(
      +id,
      updateOrganizationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.removeOrganization(+id);
  }
  catch(error: HttpException) {
    return { message: error.message };
  }

  @Get('currentMonthOrg')
  async getRecentOrganizations() {
    const count =
      await this.organizationService.getCurrentMonthOrganizationsCount();

    return count;
  }
}
