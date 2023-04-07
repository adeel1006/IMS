import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Catch,
  HttpException
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Catch(HttpException)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(createOrganizationDto);
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
  catch ( error : HttpException){
    return { message: error.message}
  }
}
