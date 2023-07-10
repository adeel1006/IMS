import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  Catch,
  HttpException,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { Userdto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/customDecorators/user.decorator';
import { CONSTANTS } from './constants';

@Catch(HttpException)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN, CONSTANTS.ROLES.ADMIN]),
  )
  @Post('createUser')
  createUser(
    @CurrentUser() currentUser,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN, CONSTANTS.ROLES.ADMIN]),
  )
  @Get('adminsCount')
  async getAdminCount(@CurrentUser() currentUser) {
    return await this.usersService.getAdminCounts();
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN, CONSTANTS.ROLES.ADMIN]),
  )
  @Get('adminsByMonth')
  async getAdminsByMonth() {
    return await this.usersService.getAdminsByMonth();
  }

  @Get('/allAdmins')
  async getAllAdminUsers() {
    return this.usersService.getAllAdminUsers();
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN, CONSTANTS.ROLES.ADMIN]),
  )
  @Serialize(Userdto)
  @Get()
  async findAll(@CurrentUser() currentUser) {
    return this.usersService.findAllUsers();
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN, CONSTANTS.ROLES.ADMIN]),
  )
  @Get('employees/count')
  async countEmployees(@CurrentUser() currentUser) {
    return await this.usersService.countEmployeesNumbers();
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN, CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Get('/:id')
  async getUser(@CurrentUser() currentUser, @Param('id') id: string) {
    const user = await this.usersService.findUser(parseInt(id));
    if (user.length <= 0) {
      throw new NotFoundException('User not found...');
    }
    return user;
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN, CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Patch('/:id')
  async updateUser(
    @CurrentUser() currentUser,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(+id, updateUserDto);
  }
  catch(error: HttpException) {
    return { message: error.message };
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN, CONSTANTS.ROLES.ADMIN]),
  )
  @Delete(':id')
  remove(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.usersService.removeUser(+id);
  }
}
