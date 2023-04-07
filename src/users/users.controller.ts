import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  Catch,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './Models/dto/create-user.dto';
import { User } from './Models/entities/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { Userdto } from './Models/dto/user.dto';

@Catch(HttpException)
@Controller('users')
@Serialize(Userdto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('createUser')
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/:id')
  async getUsers(@Param('id') id: string) {
    console.log('Handler is running');
    const user = await this.usersService.findUser(parseInt(id));
    if (user.length <= 0) {
      throw new NotFoundException('User not found...');
    }
    return user;
  }
  catch(error: HttpException) {
    return { message: error.message };
  }
}
