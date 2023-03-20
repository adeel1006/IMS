import { Controller, Post, Body, Get , UseInterceptors, ClassSerializerInterceptor, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './Models/dto/create-user.dto';
import { User } from './Models/entities/user.entity';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { Userdto } from './Models/dto/user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('createUser')
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
  
  @UseInterceptors(SerializeInterceptor)
  @Get("/:id") 
  async getUsers(@Param('id') id: string){
    console.log("Handler is running")
    const user = await this.usersService.findUser(parseInt(id));
    if(user.length<=0){
      throw new NotFoundException("User not found...")
    }
    return user;
  }
}
