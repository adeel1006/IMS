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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './Models/dto/create-user.dto';
import { User } from './Models/entities/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { Userdto } from './Models/dto/user.dto';
import { UpdateUserDto } from './Models/dto/update-user.dto';

@Catch(HttpException)
@Controller('users')
@Serialize(Userdto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('createUser')
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAllUsers();
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findUser(parseInt(id));
    if (user.length <= 0) {
      throw new NotFoundException('User not found...');
    }
    return user;
  }
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }
  catch(error: HttpException) {
    return { message: error.message };
  }
}
