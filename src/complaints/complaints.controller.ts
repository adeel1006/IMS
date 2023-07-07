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
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/customDecorators/user.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CONSTANTS } from 'src/users/constants';

@Catch(HttpException)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  create(
    @CurrentUser() currentUser,
    @Body() createComplaintDto: CreateComplaintDto,
  ) {
    return this.complaintsService.createComplain(
      currentUser,
      createComplaintDto,
    );
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN,CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Get()
  findAll() {
    return this.complaintsService.findAllComplaints();

  }

  @Get("/userComplaints")
  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN,CONSTANTS.ROLES.EMPLOYEE]),
  )
  findUserRequests(@CurrentUser() currentUser){
    return this.complaintsService.findUserComplaints(currentUser);
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([
      CONSTANTS.ROLES.ADMIN,
      CONSTANTS.ROLES.EMPLOYEE,
      CONSTANTS.ROLES.SUPER_ADMIN,
    ]),
  )
  @Get('status')
  findAllComplaintStatus(@CurrentUser() currentUser) {
    return this.complaintsService.getComplaintsStatus();
  }


  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN,CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Get('pending')
  async getPendingComplaintCount(@CurrentUser() currentUser) {
    return await this.complaintsService.getPendingComplaintCount();
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN,CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Get('resolved')
  async countResolvedComplaints(@CurrentUser() currentUser) {
    return await this.complaintsService.countResolvedComplaints();
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([
      CONSTANTS.ROLES.ADMIN,
      CONSTANTS.ROLES.EMPLOYEE,
      CONSTANTS.ROLES.SUPER_ADMIN,
    ]),
  )
  @Get(':id')
  findOne(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.complaintsService.findOneComplaint(+id);
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN,CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Patch(':id')
  update(
    @CurrentUser() currentUser,
    @Param('id') id: string,
    @Body() updateComplaintDto: UpdateComplaintDto,
  ) {
    return this.complaintsService.updateComplaint(+id, updateComplaintDto);
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Delete(':id')
  remove(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.complaintsService.removeComplaint(+id);
  }

  catch(error: HttpException) {
    return { message: error.message };
  }
}
