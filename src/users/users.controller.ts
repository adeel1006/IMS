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
@UseGuards(
  JwtAuthGuard,
  new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN, CONSTANTS.ROLES.ADMIN]),
)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('createUser')
  createUser(
    @CurrentUser() currentUser,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('adminsCount')
  async getAdminCount(@CurrentUser() currentUser) {
    return await this.usersService.getAdminCounts();
  }

  @Get('adminsByMonth')
  async getAdminsByMonth() {
    return await this.usersService.getAdminsByMonth();
  }

  @Get('/allAdmins')
  async getAllAdminUsers() {
    return this.usersService.getAllAdminUsers();
  }

  @Serialize(Userdto)
  @Get()
  async findAll(@CurrentUser() currentUser) {
    return this.usersService.findAllUsers();
  }

  @Get('employees/count')
  async countEmployees(@CurrentUser() currentUser) {
    return await this.usersService.countEmployeesNumbers();
  }

  @Get('/:id')
  async getUser(@CurrentUser() currentUser, @Param('id') id: string) {
    const user = await this.usersService.findUser(parseInt(id));
    if (user.length <= 0) {
      throw new NotFoundException('User not found...');
    }
    return user;
  }

  
  @Patch(':id')
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

  @Delete(':id')
  remove(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.usersService.removeUser(+id);
  }
}
