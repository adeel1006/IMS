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
  

  // @UseGuards(JwtAuthGuard)
  // @Get('test')
  // test(@Request() req: any) {
  //   return 'Test Access Granted ' + JSON.stringify(req.user);
  // }

  @UseGuards(JwtAuthGuard, new RoleGuard(CONSTANTS.ROLES.SUPER_ADMIN))
  @Get('superAdmin')
  SuperAdmin(@Request() req: any) {
    return 'Super Admin Access Granted ' + JSON.stringify(req.user);
  }

  @UseGuards(JwtAuthGuard, new RoleGuard(CONSTANTS.ROLES.ADMIN))
  @Get('admin')
  Admin(@Request() req: any) {
    return 'Admin Access Granted ' + JSON.stringify(req.user);
  }

  @UseGuards(JwtAuthGuard, new RoleGuard(CONSTANTS.ROLES.EMPLOYEE))
  @Get('employee')
  Employee(@Request() req: any) {
    return 'Employee Access Granted ' + JSON.stringify(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async test() {
  //   return 'You have authorized !';
  //   // To test endpoint on terminal
  //   // curl http://localhost:3000/auth -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3ODQ1MjU2Mn0.CF-S4-vSBFBwHQSHZhD2jjewq4iJwUL_SUGzAoCwsNw"
  // }
}

//Task to do (exception handling)
