import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Models/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './Models/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(createUserDto);
    await user.save();

    delete user.password;
    return user;
  }

  async findUser(id: number){
    const user = await this.usersRepository.findBy({id: id});
    // console.log("My console ==>"+user)
    return user;
  }

  async findUserByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }
}
