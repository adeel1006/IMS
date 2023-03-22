import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { CONSTANTS } from 'src/users/constants';
import { RoleGuard } from './guards/role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() authLoginDto: LoginDto) {
    return this.authService.login(authLoginDto);
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
  Admin(@Request() req: any) {
    return 'Admin Access Granted ' + JSON.stringify(req.user);
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([
      CONSTANTS.ROLES.ADMIN,
      CONSTANTS.ROLES.EMPLOYEE,
    ]),
  )
  @Get('employee')
  Employee(@Request() req: any) {
    return 'Employee Access Granted ' + JSON.stringify(req.user);
  }
}
//Task to do (exception handling)
