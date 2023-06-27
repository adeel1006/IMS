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
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(createOrganizationDto);
  }

  @Get('orgByMonth')
  async getAdminsByMonth() {
    return await this.organizationService.getOrgByMonth();
  }

  @Get('currentMonthOrg')
  async getRecentOrganizations() {
    return await this.organizationService.getCurrentMonthOrganizationsCount();
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
}
