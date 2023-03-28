import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Models/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './Models/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

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

  async findUser(id: number) {
    const user = await this.usersRepository.findBy({ id: id });
    return user;
  }

  async findUserByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException(`User "${email}" not found`);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usersRepository.update(user.id, { otp });
    console.log(`OTP sent to this email "${user.email}" : OTP-${otp}`);
    return otp;
  }

  async resetPassword(email: string, newPassword: string, otp: string) {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException(`User "${email}" not found`);
    }
    if (user.otp !== otp) {
      throw new NotAcceptableException('Invalid OTP');
    }
    console.log(email, newPassword, otp);
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await User.update(user.id, {
      password: hashPassword,
      otp: null,
    });

    return {
      message: 'Password Reset Successful',
      userId: user.id,
      email: user.email,
    };
  }
}
