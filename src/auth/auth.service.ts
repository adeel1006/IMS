import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
// import { User } from './Entities/user.entity';
import { User } from "../users/entities/user.entity"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: LoginDto) {
    const user = await this.validateUser(authLoginDto);

    const payload = {
      userId: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(userLoginDto: LoginDto): Promise<User> {
    const { email, password } = userLoginDto;

    const user = await this.usersService.findUserByEmail(email);
    if (!(await user.validatePassword(password))) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
