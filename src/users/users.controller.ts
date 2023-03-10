import { Controller , Post, Body} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './Models/dto/create-user.dto';
import { User } from './Models/entities/user.entity';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Post('signup')
  createUser(@Body() createUserDto:CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
