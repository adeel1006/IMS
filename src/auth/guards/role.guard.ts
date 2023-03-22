import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CONSTANTS } from 'src/users/constants';

export class RoleGuard implements CanActivate {
  private rolePassed: string[];
  constructor(role: string[]) {
    this.rolePassed = role;
  }
  canActivate(context: ExecutionContext): boolean {
    const roles = this.rolePassed;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    return roles.includes(user.role);
  }
}
