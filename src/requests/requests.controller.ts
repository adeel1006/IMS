import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Catch,
  UseGuards,
} from '@nestjs/common';
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
  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.EMPLOYEE]))
  create(
    @CurrentUser() currentUser,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return this.requestsService.createRequest(createRequestDto, currentUser);
  }

  @Get()
  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.ADMIN]))
  findAll(@CurrentUser() currentUser) {
    return this.requestsService.findAllRequests();
  }

  @Get('/returns')
  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.ADMIN]))
  findApprovedRequests(@CurrentUser() currentUser) {
    return this.requestsService.findApprovedRequests();
  }

  @Get('/userRequests')
  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  findUserRequests(@CurrentUser() currentUser) {
    return this.requestsService.findUserRequests(currentUser);
  }

  @Get('/employee/:id')
  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.ADMIN]))
  findAnEmployeeRequests(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.requestsService.findAnEmployeeRequests(+id);
  }

  @Get('/employeesRequests')
  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.ADMIN]))
  findEmpRequests(@CurrentUser() currentUser) {
    return this.requestsService.getEmployeesRequests();
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
    new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Patch(':id')
  update(
    @CurrentUser() currentUser,
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
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
