import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Catch, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CONSTANTS } from 'src/users/constants';
import { CurrentUser } from 'src/customDecorators/user.decorator';

@Catch(HttpException)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {} 

  @Post()
  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.EMPLOYEE]),
  )
  create( @CurrentUser() currentUser, @Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.createRequest(createRequestDto);
  }

  @Get()
  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN]),
  )
  findAll(@CurrentUser() currentUser) {
    return this.requestsService.findAllRequests();
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Get(':id')
  findOne(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.requestsService.findOneRequest(+id);
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Patch(':id')
  update(@CurrentUser() currentUser, @Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.updateRequest(+id, updateRequestDto);
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Delete(':id')
  remove(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.requestsService.removeRequest(+id);
  }
  catch(error: HttpException) {
    return { message: error.message };
  }
}
