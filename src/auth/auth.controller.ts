import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  NotFoundException,
  Catch,
  HttpException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { CONSTANTS } from 'src/users/constants';
import { RoleGuard } from './guards/role.guard';
import { UsersService } from '../users/users.service';
import { CurrentUser } from 'src/Custom Decorators/user.decorator';

@Catch(HttpException)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  @Post('login')
  async login(@Body() authLoginDto: LoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body) {
    const { email } = body;

    const user = await this.userService.forgotPassword(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
    @Body('otp') otp: string,
  ) {
    const updatedUser = await this.userService.resetPassword(
      email,
      newPassword,
      otp,
    );
    return {
      message: updatedUser.message,
      UserId: updatedUser.userId,
      email: updatedUser.email,
    };
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.SUPER_ADMIN]))
  @Get('superAdmin')
  SuperAdmin(@Request() req: any) {
    return 'Super Admin Access Granted ' + JSON.stringify(req.user);
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.SUPER_ADMIN]),
  )
  @Get('admin')
  Admin(@Request() req: any, @CurrentUser() user: any) {
    console.log("Current USER====>"+ JSON.stringify(user));
    return 'Admin Access Granted ' + JSON.stringify(req.user);
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Get('employee')
  Employee(@Request() req: any) {
    return 'Employee Access Granted ' + JSON.stringify(req.user);
  }
  catch(error: HttpException) {
    return { message: error.message };
  }
}
